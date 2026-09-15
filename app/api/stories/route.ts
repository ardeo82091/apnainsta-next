import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { connectDB } from "@/lib/mongodb"
import Story from "@/models/Story"
import User from "@/models/User"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ stories: [] })
  await connectDB()
  const user = await User.findById(session.user.id)
  if (!user) return NextResponse.json({ stories: [] })
  const following = user.friendAndRequests?.followings?.map((item: any) => item.person.userName) || []
  const stories = await Story.find({ userName: { $in: [user.userName, ...following] }, expiresAt: { $gt: new Date() } }).sort({ createdAt: 1 }).lean()
  return NextResponse.json({ stories: stories.map((story: any) => ({ ...story, viewed: story.viewedBy?.some((view: any) => view.userName === user.userName) || story.userName === user.userName })) })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ message: "Sign in to add a story" }, { status: 401 })
  const { mediaUrl, mediaType } = await request.json()
  if (!mediaUrl || typeof mediaUrl !== "string" || mediaUrl.length > 7_000_000) return NextResponse.json({ message: "Choose an image smaller than 5 MB" }, { status: 400 })
  await connectDB()
  const user = await User.findById(session.user.id)
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 })
  const story = await Story.create({ userName: user.userName, mediaUrl, mediaType: mediaType === "video" ? "video" : "image", expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) })
  return NextResponse.json({ story }, { status: 201 })
}
