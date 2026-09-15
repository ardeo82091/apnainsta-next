import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { connectDB } from "@/lib/mongodb"
import Post from "@/models/Post"
import User from "@/models/User"

export async function POST(_: Request, { params }: { params: { postId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ message: "Sign in to like posts" }, { status: 401 })
  await connectDB()
  const user = await User.findById(session.user.id)
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 })
  const post = await Post.findById(params.postId)
  if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 })
  const alreadyLiked = post.likes.some((like: { userName: string }) => like.userName === user.userName)
  if (alreadyLiked) post.likes = post.likes.filter((like: { userName: string }) => like.userName !== user.userName)
  else post.likes.push({ userName: user.userName })
  await post.save()
  return NextResponse.json({ liked: !alreadyLiked, likeCount: post.likes.length })
}
