import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  await connectDB();

  const { action, myUserName, targetUserName } = await req.json();

  const myUser = await User.findOne({ userName: myUserName });
  const targetUser = await User.findOne({ userName: targetUserName });

  if (!myUser || !targetUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const notification = (actor: any) => ({
    id: Date.now(), type: "follow", user: { userName: actor.userName, name: actor.fullName, img: actor.profilePic }, timestamp: new Date(), read: false
  });
  const person = (account: any) => ({ userName: account.userName, name: account.fullName, img: account.profilePic });
  const addFollow = (follower: any, followed: any) => {
    if (!followed.friendAndRequests.followers.some((item: any) => item.person.userName === follower.userName)) followed.friendAndRequests.followers.push({ person: person(follower) });
    if (!follower.friendAndRequests.followings.some((item: any) => item.person.userName === followed.userName)) follower.friendAndRequests.followings.push({ person: person(followed) });
  };

  switch (action) {

    // FOLLOW REQUEST
    case "follow": {

      if (myUser.userName === targetUser.userName) return NextResponse.json({ message: "You cannot follow yourself" }, { status: 400 });
      if (myUser.friendAndRequests.followings.some((item: any) => item.person.userName === targetUserName)) return NextResponse.json({ message: "Already following" }, { status: 409 });

      // Public accounts behave like Instagram: follow immediately. Private
      // accounts retain the pending request workflow.
      if (!targetUser.isPrivate) {
        addFollow(myUser, targetUser);
        targetUser.notifications.push(notification(myUser));
        await Promise.all([targetUser.save(), myUser.save()]);
        return NextResponse.json({ isFollowing: true, requestSent: false, message: "Following" });
      }

      // prevent duplicate request
      const alreadySent = myUser.friendAndRequests.requests.some(
        (r: any) => r.person.userName === targetUserName && r.type === "sent"
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
        type: "received",
      });

      myUser.friendAndRequests.requests.push({
        person: {
          userName: targetUser.userName,
          name: targetUser.fullName,
          img: targetUser.profilePic,
        },
        type: "sent",
      });

      targetUser.notifications.push(notification(myUser));

      await Promise.all([targetUser.save(), myUser.save()]);

      return NextResponse.json({
        isFollowing: false,
        requestSent: true,
        message: "Follow request sent"
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

      // Here `myUser` accepted `targetUser`'s request, so target follows myUser.
      addFollow(targetUser, myUser);

      targetUser.notifications.push(notification(myUser));

      await Promise.all([targetUser.save(), myUser.save()]);

      return NextResponse.json({
        isFollowing: true,
        requestSent: false,
        message: "Request accepted"
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
