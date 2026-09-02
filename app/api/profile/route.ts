import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ message: "Sign in required" }, { status: 401 })
  const { fullName, bio, profilePic, isPrivate } = await request.json()
  const updates: Record<string, unknown> = {}
  if (typeof fullName === "string" && fullName.trim()) updates.fullName = fullName.trim().slice(0, 80)
  if (typeof bio === "string") updates.bio = bio.slice(0, 150)
  if (typeof profilePic === "string") updates.profilePic = profilePic.slice(0, 2_000_000)
  if (typeof isPrivate === "boolean") updates.isPrivate = isPrivate
  await connectDB()
  const user = await User.findByIdAndUpdate(session.user.id, { $set: updates }, { new: true })
  return NextResponse.json({ user })
}
