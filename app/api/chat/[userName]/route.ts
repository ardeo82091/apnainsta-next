import { addMessages } from "@/lib/users";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, { params }: { params: { userName: string } }) {
    const myUserName = params.userName;
    const {message, userName} = await req.json();
    console.log(myUserName,message,userName);

    if (!userName || !message || !myUserName) {
        return NextResponse.json({ success: false, message: 'Missing required fields' },{status: 400});
    }

    const [isAdded, errormessage] = addMessages(myUserName, userName, message);
    return NextResponse.json({ success: isAdded, message: errormessage }, {status: 200});
}