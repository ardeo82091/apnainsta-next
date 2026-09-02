import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ message: "Sign in required" }, { status: 401 })
  const { id, all } = await request.json()
  await connectDB()
  if (all) await User.updateOne({ _id: session.user.id }, { $set: { "notifications.$[].read": true } })
  else if (typeof id === "number") await User.updateOne({ _id: session.user.id, "notifications.id": id }, { $set: { "notifications.$.read": true } })
  else return NextResponse.json({ message: "id or all is required" }, { status: 400 })
  return NextResponse.json({ success: true })
}
