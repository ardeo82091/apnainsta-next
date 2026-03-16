import { NextResponse } from "next/server"
import Message from "@/models/Message"
import { connectDB } from "@/lib/mongodb"

export async function GET(
  req: Request,
  { params }: { params: { chatId: string } }
) {

  await connectDB()

  const messages = await Message.find({
    chatId: params.chatId
  }).sort({ timestamp: 1 })

  return NextResponse.json(messages)
}