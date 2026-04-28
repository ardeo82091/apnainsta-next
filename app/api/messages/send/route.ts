import { NextResponse } from "next/server"
import Message from "@/models/Message"
import Chat from "@/models/Chat"
import { connectDB } from "@/lib/mongodb"

export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()

    const { sender, chatId, content, type, participants } = body

    let chat

    if (chatId) {
      chat = await Chat.findById(chatId)
    }

    if (!chat) {
      if (!participants || participants.length < 2) {
        return NextResponse.json(
          { message: "Participants required to create chat" },
          { status: 400 }
        )
      }

      chat = await Chat.create({
        participants
      })
    }

    const message = await Message.create({
      chatId: chat._id,
      sender,
      content,
      type: type || "text",
      readBy: [sender],
      createdAt: new Date()
    })

    chat.lastMessage = {
      text: content,
      sender,
      timestamp: message.createdAt
    }

    chat.updatedAt = new Date()
    await chat.save()

    return NextResponse.json(message, { status: 201 })

  } catch (error) {
    console.error("Error sending message:", error)

    return NextResponse.json(
      { message: "Failed to send message" },
      { status: 500 }
    )
  }
}