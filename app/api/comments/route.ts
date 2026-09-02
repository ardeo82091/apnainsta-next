import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { moderateComment } from "@/lib/commentModeration"
import { connectDB } from "@/lib/mongodb"
import Comment from "@/models/Comment"
import Post from "@/models/Post"
import User from "@/models/User"

const MAX_ABUSIVE_COMMENTS_PER_STRIKE = 10
const DAY = 24 * 60 * 60 * 1000

function isMutualFollow(commenter: any, postOwner: any) {
  const commenterFollowsOwner = commenter.friendAndRequests?.followings?.some(
    (follow: any) => follow.person?.userName === postOwner.userName
  )
  const ownerFollowsCommenter = postOwner.friendAndRequests?.followings?.some(
    (follow: any) => follow.person?.userName === commenter.userName
  )
  return Boolean(commenterFollowsOwner && ownerFollowsCommenter)
}

function commentAccessError(moderation: any) {
  if (moderation?.status === "permanently_locked") {
    return NextResponse.json({ code: "PERMANENTLY_LOCKED", message: "Your profile is permanently locked from commenting." }, { status: 403 })
  }
  if (moderation?.status === "blocked") {
    return NextResponse.json({ code: "ADMIN_REVIEW_REQUIRED", message: "Your commenting access is blocked. Contact the admin team with a reason for review.", requiresAdminAppeal: true }, { status: 403 })
  }
  if (moderation?.status === "suspended" && moderation.suspendedUntil && new Date(moderation.suspendedUntil) > new Date()) {
    return NextResponse.json({ code: "COMMENT_SUSPENDED", message: "Your commenting access is temporarily suspended.", suspendedUntil: moderation.suspendedUntil }, { status: 403 })
  }
  return null
}

export async function GET(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get("postId")
  if (!postId) return NextResponse.json({ message: "postId is required" }, { status: 400 })
  await connectDB()
  const comments = await Comment.find({ postId }).sort({ createdAt: 1 }).lean()
  const roots = comments.filter((comment: any) => !comment.parentCommentId)
  const replies = new Map<string, any[]>()
  comments.filter((comment: any) => comment.parentCommentId).forEach((comment: any) => {
    const key = comment.parentCommentId.toString(); replies.set(key, [...(replies.get(key) || []), comment])
  })
  return NextResponse.json({ comments: roots.map((comment: any) => ({ ...comment, replies: replies.get(comment._id.toString()) || [] })).reverse() })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ message: "Sign in to comment" }, { status: 401 })

  let body: { postId?: string; text?: string; parentCommentId?: string }
  try { body = await request.json() } catch { return NextResponse.json({ message: "Invalid JSON" }, { status: 400 }) }
  const text = body.text?.trim()
  if (!body.postId || !text || text.length > 1000) {
    return NextResponse.json({ message: "postId and a comment of 1–1000 characters are required" }, { status: 400 })
  }

  await connectDB()
  const [commenter, post] = await Promise.all([User.findById(session.user.id), Post.findById(body.postId)])
  if (!commenter || !post) return NextResponse.json({ message: "User or post not found" }, { status: 404 })
  if (!post.allowComments) return NextResponse.json({ message: "Comments are disabled on this post" }, { status: 403 })

  const accessError = commentAccessError(commenter.commentModeration)
  if (accessError) return accessError

  const postOwner = await User.findOne({ userName: post.userName })
  if (!postOwner) return NextResponse.json({ message: "Post owner not found" }, { status: 404 })
  const trustedFriend = commenter._id.equals(postOwner._id) || isMutualFollow(commenter, postOwner)
  const moderation = trustedFriend
    ? { abusive: false, categories: [], source: "trusted_friend" as const }
    : await moderateComment(text)

  if (moderation.abusive) {
    const state = commenter.commentModeration ?? {}
    const newCount = (state.abusiveCommentCount ?? 0) + 1
    const now = new Date()
    const update: Record<string, unknown> = {
      "commentModeration.abusiveCommentCount": newCount,
      "commentModeration.lastOffenseAt": now
    }
    let response: Record<string, unknown> = {
      code: "ABUSIVE_COMMENT_REJECTED",
      message: "This comment was not published because it may be abusive.",
      remainingWarnings: Math.max(0, MAX_ABUSIVE_COMMENTS_PER_STRIKE - newCount)
    }
    let status = 422

    if (newCount >= MAX_ABUSIVE_COMMENTS_PER_STRIKE) {
      const strikes = (state.strikes ?? 0) + 1
      update["commentModeration.abusiveCommentCount"] = 0
      update["commentModeration.strikes"] = strikes
      if (state.wasAdminUnblocked) {
        update["commentModeration.status"] = "permanently_locked"
        update["commentModeration.suspendedUntil"] = null
        response = { code: "PERMANENTLY_LOCKED", message: "Your profile has been permanently locked from commenting after a post-review violation." }
      } else if (strikes === 1 || strikes === 2) {
        const suspendedUntil = new Date(now.getTime() + (strikes === 1 ? 7 : 30) * DAY)
        update["commentModeration.status"] = "suspended"
        update["commentModeration.suspendedUntil"] = suspendedUntil
        response = { code: "COMMENT_SUSPENDED", message: `Commenting is disabled for ${strikes === 1 ? 7 : 30} days.`, suspendedUntil }
      } else {
        update["commentModeration.status"] = "blocked"
        update["commentModeration.suspendedUntil"] = null
        response = { code: "ADMIN_REVIEW_REQUIRED", message: "Commenting is blocked. Submit an appeal to the admin team to request review.", requiresAdminAppeal: true }
      }
      status = 403
    }
    await User.updateOne({ _id: commenter._id }, { $set: update })
    return NextResponse.json(response, { status })
  }

  const comment = await Comment.create({
    postId: post._id,
    authorId: commenter._id,
    authorUserName: commenter.userName,
    text,
    parentCommentId: body.parentCommentId || null,
    moderation: { source: moderation.source, flagged: false, categories: [] }
  })
  return NextResponse.json({ comment }, { status: 201 })
}
