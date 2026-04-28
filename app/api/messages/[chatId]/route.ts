import { NextResponse } from "next/server"
import Message from "@/models/Message"
import { connectDB } from "@/lib/mongodb"

export async function GET(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    await connectDB()

    const { chatId } = params

    if (!chatId) {
      return NextResponse.json(
        { message: "chatId is required" },
        { status: 400 }
      )
    }

    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get("page")) || 1
    const limit = Number(searchParams.get("limit")) || 20
    const userId = searchParams.get("userId") 

    const messages = await Message.find({ chatId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    if (userId) {
      await Message.updateMany(
        {
          chatId,
          sender: { $ne: userId },
          readBy: { $ne: userId }
        },
        {
          $addToSet: { readBy: userId }
        }
      )
    }

    const orderedMessages = messages.reverse()

    return NextResponse.json(orderedMessages, { status: 200 })

  } catch (error) {
    console.error("Error fetching messages:", error)

    return NextResponse.json(
      { message: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}