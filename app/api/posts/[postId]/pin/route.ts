import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { connectDB } from "@/lib/mongodb"
import Post from "@/models/Post"
import User from "@/models/User"

export async function PATCH(_: Request, { params }: { params: { postId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ message: "Sign in required" }, { status: 401 })
  await connectDB()
  const user = await User.findById(session.user.id)
  const post = await Post.findById(params.postId)
  if (!user || !post || post.userName !== user.userName) return NextResponse.json({ message: "Post not found" }, { status: 404 })
  if ((post.media || []).some((media: any) => media.isVideo)) return NextResponse.json({ message: "Only image posts can be pinned" }, { status: 400 })
  post.isPinned = !post.isPinned
  await post.save()
  return NextResponse.json({ isPinned: post.isPinned })
}
