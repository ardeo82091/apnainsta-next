import { NextResponse } from "next/server"
import Chat from "@/models/Chat"
import User from "@/models/User"
import { connectDB } from "@/lib/mongodb"

export async function GET(
  req: Request,
  { params }: { params: { userName: string } }
) {
  try {
    await connectDB()

    const { userName } = params
    const currentUser = await User.findOne({ userName })

    if (!currentUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    const userId = currentUser._id
    const chats = await Chat.find({
      participants: userId
    })
      .sort({ updatedAt: -1 })
      .populate("participants", "userName fullName profilePic")

    const results = chats.map((chat: any) => {
      const otherUser = chat.participants.find(
        (p: any) => p._id.toString() !== userId.toString()
      )

      return {
        chatId: chat._id,

        person: {
          _id: otherUser?._id,
          userName: otherUser?.userName,
          name: otherUser?.fullName,
          img: otherUser?.profilePic
        },

        lastMessage: chat.lastMessage || null,
        updatedAt: chat.updatedAt
      }
    })

    return NextResponse.json(results, { status: 200 })

  } catch (error) {
    console.error("Error fetching chats:", error)
    return NextResponse.json(
      { message: "Failed to fetch chats" },
      { status: 500 }
    )
  }
}