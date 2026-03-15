import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(req: Request) {

  await connectDB()

  const { action, myUserName, targetUserName } = await req.json()

  const myUser = await User.findOne({ userName: myUserName })
  const targetUser = await User.findOne({ userName: targetUserName })

  if (!myUser || !targetUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  switch (action) {

    // FOLLOW REQUEST
    case "follow":

      targetUser.friendAndRequests.requests.push({
        id: Date.now(),
        person: {
          userName: myUser.userName,
          name: myUser.fullName,
          img: myUser.profilePic
        },
        isAdded: false,
        isSent: false
      })

      myUser.friendAndRequests.requests.push({
        id: Date.now(),
        person: {
          userName: targetUser.userName,
          name: targetUser.fullName,
          img: targetUser.profilePic
        },
        isAdded: false,
        isSent: true
      })

      await Promise.all([
        targetUser.save(),
        myUser.save()
      ])

      return NextResponse.json({
        isFollowing: false,
        requestSent: true,
        acceptReq: false
      })

    // ACCEPT REQUEST
    case "accept":

      myUser.friendAndRequests.requests =
        myUser.friendAndRequests.requests.filter(
          (r: any) => r.person.userName !== targetUser.userName
        )

      targetUser.friendAndRequests.requests =
        targetUser.friendAndRequests.requests.filter(
          (r: any) => r.person.userName !== myUser.userName
        )

      myUser.friendAndRequests.followers.push({
        id: Date.now(),
        person: {
          userName: targetUser.userName,
          name: targetUser.fullName,
          img: targetUser.profilePic
        },
        isOnline: false,
        isFollowing: false
      })

      targetUser.friendAndRequests.followings.push({
        id: Date.now(),
        person: {
          userName: myUser.userName,
          name: myUser.fullName,
          img: myUser.profilePic
        },
        isOnline: false,
        isFollowed: false
      })

      await Promise.all([
        targetUser.save(),
        myUser.save()
      ])

      return NextResponse.json({
        isFollowing: true,
        requestSent: false,
        acceptReq: false
      })

    // REJECT REQUEST
    case "reject":

      targetUser.friendAndRequests.requests =
        targetUser.friendAndRequests.requests.filter(
          (r: any) => r.person.userName !== myUserName
        )

      await targetUser.save()

      return NextResponse.json({
        isFollowing: false,
        requestSent: false
      })

    // CANCEL REQUEST
    case "cancel":

      targetUser.friendAndRequests.requests =
        targetUser.friendAndRequests.requests.filter(
          (r: any) => r.person.userName !== myUserName
        )

      await targetUser.save()

      return NextResponse.json({
        isFollowing: false,
        requestSent: false
      })

    // UNFOLLOW
    case "unfollow":

      targetUser.friendAndRequests.followers =
        targetUser.friendAndRequests.followers.filter(
          (f: any) => f.person.userName !== myUserName
        )

      await targetUser.save()

      return NextResponse.json({
        isFollowing: false,
        requestSent: false
      })

    default:
      return NextResponse.json({ message: "Invalid action" }, { status: 400 })
  }
}