import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"

export async function GET() {
  const session = await getServerSession(authOptions); if (!session?.user?.id) return NextResponse.json([])
  await connectDB(); const user = await User.findById(session.user.id)
  if (!user) return NextResponse.json([])
  const excluded = [user.userName, ...(user.friendAndRequests?.followings || []).map((item: any) => item.person.userName), ...(user.friendAndRequests?.requests || []).map((item: any) => item.person.userName)]
  const users = await User.aggregate([{ $match: { userName: { $nin: excluded } } }, { $sample: { size: 4 } }, { $project: { userName: 1, fullName: 1, profilePic: 1 } }])
  return NextResponse.json(users)
}
