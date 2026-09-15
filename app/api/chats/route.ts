import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { connectDB } from "@/lib/mongodb"
import Chat from "@/models/Chat"
import User from "@/models/User"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ message: "Sign in to start a chat" }, { status: 401 })
  const { userName } = await request.json()
  await connectDB()
  const [currentUser, otherUser] = await Promise.all([User.findById(session.user.id), User.findOne({ userName })])
  if (!currentUser || !otherUser || currentUser.userName === otherUser.userName) return NextResponse.json({ message: "User not found" }, { status: 404 })
  const followsPrivateAccount = currentUser.friendAndRequests?.followings?.some((item: any) => item.person.userName === otherUser.userName)
  if (otherUser.isPrivate && !followsPrivateAccount) return NextResponse.json({ message: "Follow this private account before starting a chat" }, { status: 403 })
  let chat = await Chat.findOne({ participants: { $all: [currentUser.userName, otherUser.userName], $size: 2 } })
  if (!chat) chat = await Chat.create({ participants: [currentUser.userName, otherUser.userName] })
  return NextResponse.json({ chatId: chat._id, person: { userName: otherUser.userName, name: otherUser.fullName, img: otherUser.profilePic }, messages: [] }, { status: 201 })
}
