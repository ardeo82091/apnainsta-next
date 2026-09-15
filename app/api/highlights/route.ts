import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { connectDB } from "@/lib/mongodb"
import Highlight from "@/models/Highlight"
import Story from "@/models/Story"
import User from "@/models/User"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ highlights: [], stories: [] })
  await connectDB()
  const user = await User.findById(session.user.id)
  if (!user) return NextResponse.json({ highlights: [], stories: [] })
  const [highlights, stories] = await Promise.all([Highlight.find({ userName: user.userName }).sort({ createdAt: -1 }).lean(), Story.find({ userName: user.userName, expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 }).lean()])
  return NextResponse.json({ highlights, stories })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ message: "Sign in required" }, { status: 401 })
  const { title, storyId } = await request.json()
  if (!title?.trim() || !storyId) return NextResponse.json({ message: "Title and story are required" }, { status: 400 })
  await connectDB()
  const user = await User.findById(session.user.id)
  const story = await Story.findOne({ _id: storyId, userName: user?.userName })
  if (!user || !story) return NextResponse.json({ message: "Story not found" }, { status: 404 })
  const highlight = await Highlight.create({ userName: user.userName, title: title.trim().slice(0, 30), storyIds: [story._id], coverUrl: story.mediaUrl })
  return NextResponse.json({ highlight }, { status: 201 })
}
