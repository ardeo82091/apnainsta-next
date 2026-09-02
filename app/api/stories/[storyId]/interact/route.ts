import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { connectDB } from "@/lib/mongodb"
import Chat from "@/models/Chat"
import Message from "@/models/Message"
import Story from "@/models/Story"
import User from "@/models/User"

export async function POST(request: Request, { params }: { params: { storyId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ message: "Sign in required" }, { status: 401 })
  const { type, text } = await request.json()
  await connectDB()
  const [sender, story] = await Promise.all([User.findById(session.user.id), Story.findById(params.storyId)])
  if (!sender || !story) return NextResponse.json({ message: "Story not found" }, { status: 404 })
  if (type === "like") {
    const liked = story.likes.some((like: any) => like.userName === sender.userName)
    story.likes = liked ? story.likes.filter((like: any) => like.userName !== sender.userName) : [...story.likes, { userName: sender.userName }]
    await story.save(); return NextResponse.json({ liked: !liked, likeCount: story.likes.length })
  }
  if (!text?.trim() || story.userName === sender.userName) return NextResponse.json({ message: "A message is required" }, { status: 400 })
  let chat = await Chat.findOne({ participants: { $all: [sender.userName, story.userName], $size: 2 } })
  if (!chat) chat = await Chat.create({ participants: [sender.userName, story.userName] })
  const content = `${type === "reaction" ? text : `Reply to story: ${text}`}`
  const message = await Message.create({ chatId: chat._id, sender: sender.userName, content, type: "text", readBy: [sender.userName] })
  chat.lastMessage = { text: content, sender: sender.userName, timestamp: message.createdAt }; chat.updatedAt = new Date(); await chat.save()
  return NextResponse.json({ success: true, chatId: chat._id })
}
