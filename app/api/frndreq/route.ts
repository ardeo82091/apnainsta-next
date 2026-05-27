import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";

export async function POST(req: Request) {
  await connectDB();

  const { action, myUserName, targetUserName } = await req.json();

  const myUser = await User.findOne({ userName: myUserName });
  const targetUser = await User.findOne({ userName: targetUserName });

  if (!myUser || !targetUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const createId = () => new mongoose.Types.ObjectId();

  switch (action) {

    // FOLLOW REQUEST
    case "follow": {

      // prevent duplicate request
      const alreadySent = myUser.friendAndRequests.requests.some(
        (r: any) => r.person.userName === targetUserName && r.isSent
      );

      if (alreadySent) {
        return NextResponse.json({ message: "Already requested" });
      }

      targetUser.friendAndRequests.requests.push({
        person: {
          userName: myUser.userName,
          name: myUser.fullName,
          img: myUser.profilePic,
        },
        isAdded: false,
        isSent: false,
      });

      myUser.friendAndRequests.requests.push({
        person: {
          userName: targetUser.userName,
          name: targetUser.fullName,
          img: targetUser.profilePic,
        },
        isAdded: false,
        isSent: true,
      });

      await Promise.all([targetUser.save(), myUser.save()]);

      return NextResponse.json({
        isFollowing: false,
        requestSent: true,
      });
    }

    // ACCEPT REQUEST
    case "accept": {

      // remove requests BOTH sides
      myUser.friendAndRequests.requests =
        myUser.friendAndRequests.requests.filter(
          (r: any) => r.person.userName !== targetUser.userName
        );

      targetUser.friendAndRequests.requests =
        targetUser.friendAndRequests.requests.filter(
          (r: any) => r.person.userName !== myUser.userName
        );

      // add followers/followings
      myUser.friendAndRequests.followers.push({
        person: {
          userName: targetUser.userName,
          name: targetUser.fullName,
          img: targetUser.profilePic,
        },
        isOnline: false,
        isFollowing: false,
      });

      targetUser.friendAndRequests.followings.push({
        person: {
          userName: myUser.userName,
          name: myUser.fullName,
          img: myUser.profilePic,
        },
        isOnline: false,
        isFollowing: true,
      });

      await Promise.all([targetUser.save(), myUser.save()]);

      return NextResponse.json({
        isFollowing: true,
        requestSent: false,
      });
    }

    // REJECT REQUEST
    case "reject": {

      targetUser.friendAndRequests.requests =
        targetUser.friendAndRequests.requests.filter(
          (r: any) => r.person.userName !== myUserName
        );

      myUser.friendAndRequests.requests =
        myUser.friendAndRequests.requests.filter(
          (r: any) => r.person.userName !== targetUserName
        );

      await Promise.all([targetUser.save(), myUser.save()]);

      return NextResponse.json({
        isFollowing: false,
        requestSent: false,
      });
    }

    // CANCEL REQUEST
    case "cancel": {

      targetUser.friendAndRequests.requests =
        targetUser.friendAndRequests.requests.filter(
          (r: any) => r.person.userName !== myUserName
        );

      myUser.friendAndRequests.requests =
        myUser.friendAndRequests.requests.filter(
          (r: any) => r.person.userName !== targetUserName
        );

      await Promise.all([targetUser.save(), myUser.save()]);

      return NextResponse.json({
        isFollowing: false,
        requestSent: false,
      });
    }

    // UNFOLLOW
    case "unfollow": {

      // remove from their followers
      targetUser.friendAndRequests.followers =
        targetUser.friendAndRequests.followers.filter(
          (f: any) => f.person.userName !== myUserName
        );

      // remove from your followings
      myUser.friendAndRequests.followings =
        myUser.friendAndRequests.followings.filter(
          (f: any) => f.person.userName !== targetUserName
        );

      await Promise.all([targetUser.save(), myUser.save()]);

      return NextResponse.json({
        isFollowing: false,
      });
    }

    // REMOVE FRIEND (both sides)
    case "remove": {

      // remove from your followers
      myUser.friendAndRequests.followers =
        myUser.friendAndRequests.followers.filter(
          (f: any) => f.person.userName !== targetUser.userName
        );

      targetUser.friendAndRequests.followings =
        targetUser.friendAndRequests.followings.filter(
          (f: any) => f.person.userName !== myUser.userName
        );

      await Promise.all([targetUser.save(), myUser.save()]);

      return NextResponse.json({
        removed: true,
      });
    }

    default:
      return NextResponse.json(
        { message: "Invalid action" },
        { status: 400 }
      );
  }
}