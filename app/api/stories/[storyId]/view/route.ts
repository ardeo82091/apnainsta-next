import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { connectDB } from "@/lib/mongodb"
import Story from "@/models/Story"
import User from "@/models/User"

export async function POST(_: Request, { params }: { params: { storyId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ message: "Sign in required" }, { status: 401 })
  await connectDB()
  const user = await User.findById(session.user.id)
  const story = await Story.findById(params.storyId)
  if (!user || !story) return NextResponse.json({ message: "Story not found" }, { status: 404 })
  if (story.userName !== user.userName && !story.viewedBy.some((view: any) => view.userName === user.userName)) {
    story.viewedBy.push({ userName: user.userName, viewedAt: new Date() }); await story.save()
  }
  return NextResponse.json({ viewedBy: story.viewedBy })
}
