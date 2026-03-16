import { NextResponse } from "next/server"
import Message from "@/models/Message"
import Chat from "@/models/Chat"
import { connectDB } from "@/lib/mongodb"

export async function POST(req: Request) {

  await connectDB()

  const { sender, recipient, content } = await req.json()

  let chat = await Chat.findOne({
    participants: { $all: [sender, recipient] }
  })

  if (!chat) {
    chat = await Chat.create({
      participants: [sender, recipient]
    })
  }

  const message = await Message.create({
    chatId: chat._id,
    sender,
    recipient,
    content
  })

  chat.lastMessage = content
  chat.updatedAt = new Date()

  await chat.save()

  return NextResponse.json(message)
}