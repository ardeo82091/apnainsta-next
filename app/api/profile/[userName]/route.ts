import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import Post from "@/models/Post"

export const dynamic = "force-dynamic"

export async function GET(_: Request, { params }: { params: { userName: string } }) {
  await connectDB()
  const session = await getServerSession(authOptions)
  const userName = decodeURIComponent(params.userName).trim()
  const [profile, viewer] = await Promise.all([User.findOne({ userName }), session?.user?.id ? User.findById(session.user.id) : null])
  if (!profile) return NextResponse.json({ message: "Profile not found" }, { status: 404 })
  const isOwner = viewer?._id.equals(profile._id)
  const followsProfile = viewer?.friendAndRequests?.followings?.some((item: any) => item.person.userName === profile.userName)
  if (profile.isPrivate && !isOwner && !followsProfile) return NextResponse.json({ private: true, userName: profile.userName, fullName: profile.fullName, profilePic: profile.profilePic })
  if (viewer && !isOwner) {
    profile.viewedBy = (profile.viewedBy || []).filter((view: any) => view.username !== viewer.userName)
    profile.viewedBy.unshift({ username: viewer.userName, name: viewer.fullName, img: viewer.profilePic, viewedAt: new Date() })
    profile.viewedBy = profile.viewedBy.slice(0, 10)
    await profile.save()
  }
  const posts = await Post.find({ userName: profile.userName, isArchived: { $ne: true } }).sort({ isPinned: -1, createdAt: -1 }).lean()
  return NextResponse.json({ profile: { userName: profile.userName, fullName: profile.fullName, bio: profile.bio, profilePic: profile.profilePic, isPrivate: profile.isPrivate, followers: profile.friendAndRequests?.followers?.length || 0, following: profile.friendAndRequests?.followings?.length || 0 }, posts })
}
