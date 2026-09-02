import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { connectDB } from "@/lib/mongodb"
import Post from "@/models/Post"
import ReelView from "@/models/ReelView"

export async function GET() {
  const session = await getServerSession(authOptions)
  await connectDB()
  const views = session?.user?.id ? await ReelView.find({ userId: session.user.id }).sort({ watchedAt: -1 }).limit(50).populate("postId", "userName hashtags").lean() : []
  const authors = Array.from(new Set(views.map((view: any) => view.postId?.userName).filter(Boolean)))
  const tags = Array.from(new Set(views.flatMap((view: any) => view.postId?.hashtags || [])))
  const reels = await Post.find({ isArchived: { $ne: true }, "media.isVideo": true }).sort({ createdAt: -1 }).limit(100).lean()
  const ranked = reels.map((reel: any) => ({ reel, score: (authors.includes(reel.userName) ? 3 : 0) + (reel.hashtags || []).filter((tag: string) => tags.includes(tag)).length * 2 + reel.likes.length / 100 })).sort((a, b) => b.score - a.score).slice(0, 24).map((item) => item.reel)
  return NextResponse.json({ reels: ranked })
}
