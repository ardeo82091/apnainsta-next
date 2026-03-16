import { NextResponse } from "next/server"
import Chat from "@/models/Chat"
import User from "@/models/User"
import Message from "@/models/Message"
import { connectDB } from "@/lib/mongodb"

export async function GET(
  req: Request,
  { params }: { params: { userName: string } }
) {

  await connectDB()

  const { userName } = params

  const chats = await Chat.find({
    participants: userName
  })

  const results = await Promise.all(
    chats.map(async (chat: any) => {

      const otherUserName = chat.participants.find(
        (p: string) => p !== userName
      )

      const otherUser = await User.findOne({
        userName: otherUserName
      })

      const messages = await Message.find({
        chatId: chat._id
      }).sort({ timestamp: 1 })

      return {
        person: {
          userName: otherUser.userName,
          name: otherUser.fullName,
          img: otherUser.profilePic
        },
        messages
      }
    })
  )

  return NextResponse.json(results)
}