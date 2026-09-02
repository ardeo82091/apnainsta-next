import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { connectDB } from "@/lib/mongodb"
import Comment from "@/models/Comment"
import User from "@/models/User"

export async function POST(_: Request, { params }: { params: { commentId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ message: "Sign in required" }, { status: 401 })
  await connectDB()
  const [user, comment] = await Promise.all([User.findById(session.user.id), Comment.findById(params.commentId)])
  if (!user || !comment) return NextResponse.json({ message: "Comment not found" }, { status: 404 })
  const liked = comment.likes.some((item: any) => item.userName === user.userName)
  comment.likes = liked ? comment.likes.filter((item: any) => item.userName !== user.userName) : [...comment.likes, { userName: user.userName }]
  await comment.save()
  return NextResponse.json({ liked: !liked, likeCount: comment.likes.length })
}
