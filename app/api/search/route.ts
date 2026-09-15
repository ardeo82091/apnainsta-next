import { NextResponse } from "next/server"
import User from "@/models/User"
import { connectDB } from "@/lib/mongodb"

export const dynamic = "force-dynamic"

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

    const currentUser = await User.findOne({ userName: exclude }).lean()
    const results = users.map((u: any) => {

        const isFollowing =
        currentUser?.friendAndRequests?.followings?.some(
            (f: any) => f.person.userName === u.userName
        )

        const requestSent =
        currentUser?.friendAndRequests?.requests?.some(
            (r: any) => r.person.userName === u.userName && r.type === "sent"
        )

        const acceptReq =
        currentUser?.friendAndRequests?.requests?.some(
            (r: any) => r.person.userName === u.userName && r.type === "received"
        )

        return {
        userName: u.userName,
        name: u.fullName,
        img: u.profilePic,
        isPrivate: Boolean(u.isPrivate),
        followers: u.friendAndRequests.followers.length,
        mutualFriends: 0,
        isFollowing,
        requestSent,
        acceptReq
        }
    })

    return NextResponse.json(results)
}
