import { NextResponse } from "next/server"
import Chat from "@/models/Chat"
import Message from "@/models/Message"
import User from "@/models/User"
import { connectDB } from "@/lib/mongodb"

export async function GET(
  req: Request,
  { params }: { params: { userName: string } }
) {
  try {
    await connectDB()

    const { userName } = params
    const chats = await Chat.find({
      participants: userName
    })
      .sort({ updatedAt: -1 })

    const results = await Promise.all(chats.map(async (chat: any) => {
      const otherUserName = chat.participants.find((participant: string) => participant !== userName)
      const [otherUser, messages] = await Promise.all([
        User.findOne({ userName: otherUserName }).select("userName fullName profilePic").lean(),
        Message.find({ chatId: chat._id }).sort({ createdAt: 1 }).limit(50).lean()
      ])

      return {
        chatId: chat._id,

        person: {
          _id: otherUser?._id,
          userName: otherUser?.userName,
          name: otherUser?.fullName,
          img: otherUser?.profilePic
        },

        lastMessage: chat.lastMessage || null,
        updatedAt: chat.updatedAt,
        messages
      }
    }))

    return NextResponse.json(results, { status: 200 })

  } catch (error) {
    console.error("Error fetching chats:", error)
    return NextResponse.json(
      { message: "Failed to fetch chats" },
      { status: 500 }
    )
  }
}
