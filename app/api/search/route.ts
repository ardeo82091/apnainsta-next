import { NextResponse } from "next/server"
import User from "@/models/User"
import { connectDB } from "@/lib/mongodb"

export async function GET(req: Request) {

    await connectDB()

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const exclude = searchParams.get("exclude") || "";

    if (!query) {
        return NextResponse.json([])
    }

    const users = await User.find({
    $and: [
        {
        $or: [
            { userName: { $regex: query, $options: "i" } },
            { fullName: { $regex: query, $options: "i" } }
        ]
        },
        { userName: { $ne: exclude } }
    ]
    })
    .limit(10);

    const results = users.map((u: any) => {

        const isFollowing =
        u.friendAndRequests.followings.some(
            (f: any) => f.person.userName === exclude
        )

        const requestSent =
        u.friendAndRequests.requests.some(
            (r: any) => r.person.userName === exclude && !r.isSent
        )

        const acceptReq =
        u.friendAndRequests.requests.some(
            (r: any) => r.person.userName === exclude && r.isSent
        )

        return {
        userName: u.userName,
        name: u.fullName,
        img: u.profilePic,
        followers: u.friendAndRequests.followers.length,
        mutualFriends: 0,
        isFollowing,
        requestSent,
        acceptReq
        }
    })

    return NextResponse.json(results)
}