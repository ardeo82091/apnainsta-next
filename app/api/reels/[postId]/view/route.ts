import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { connectDB } from "@/lib/mongodb"
import Post from "@/models/Post"
import ReelView from "@/models/ReelView"

export async function POST(request: Request, { params }: { params: { postId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ message: "Sign in required" }, { status: 401 })
  const { completed = false } = await request.json().catch(() => ({}))
  await connectDB()
  const post = await Post.findById(params.postId)
  if (!post || !(post.media || []).some((media: any) => media.isVideo)) return NextResponse.json({ message: "Reel not found" }, { status: 404 })
  await ReelView.findOneAndUpdate({ userId: session.user.id, postId: post._id }, { $set: { watchedAt: new Date() }, $max: { completed: Boolean(completed) } }, { upsert: true })
  return NextResponse.json({ success: true })
}
