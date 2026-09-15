import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { connectDB } from "@/lib/mongodb"
import Post from "@/models/Post"
import User from "@/models/User"

async function ownedPost(postId: string, userId?: string) {
  if (!userId) return null
  const [user, post] = await Promise.all([User.findById(userId), Post.findById(postId)])
  return user && post?.userName === user.userName ? post : null
}

export async function PATCH(request: Request, { params }: { params: { postId: string } }) {
  const session = await getServerSession(authOptions); await connectDB()
  const post = await ownedPost(params.postId, session?.user?.id)
  if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 })
  const { action } = await request.json()
  if (action === "archive") post.isArchived = !post.isArchived
  else return NextResponse.json({ message: "Unsupported action" }, { status: 400 })
  await post.save(); return NextResponse.json({ isArchived: post.isArchived })
}

export async function DELETE(_: Request, { params }: { params: { postId: string } }) {
  const session = await getServerSession(authOptions); await connectDB()
  const post = await ownedPost(params.postId, session?.user?.id)
  if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 })
  await post.deleteOne(); return NextResponse.json({ success: true })
}
