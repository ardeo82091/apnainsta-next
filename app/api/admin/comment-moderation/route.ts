import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ message: "Sign in required" }, { status: 401 })
  await connectDB()
  const admin = await User.findById(session.user.id)
  if (admin?.role !== "admin") return NextResponse.json({ message: "Admin access required" }, { status: 403 })

  const { userName, action } = await request.json()
  if (!userName || action !== "unblock") return NextResponse.json({ message: "userName and action: unblock are required" }, { status: 400 })
  const user = await User.findOneAndUpdate(
    { userName, "commentModeration.status": "blocked" },
    { $set: { "commentModeration.status": "active", "commentModeration.suspendedUntil": null, "commentModeration.wasAdminUnblocked": true, "commentModeration.abusiveCommentCount": 0 } },
    { new: true }
  )
  if (!user) return NextResponse.json({ message: "Blocked user not found" }, { status: 404 })
  return NextResponse.json({ success: true, moderation: user.commentModeration })
}
