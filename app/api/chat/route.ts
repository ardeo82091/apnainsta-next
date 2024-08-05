import { addMessages } from "@/lib/users";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";


export async function POST(req: Request){
    const {userName,message, myUserName} = await req.json();
    // const {myUserName} =req.query;

    if (!userName || !message || !myUserName) {
        return NextResponse.json({ success: false, message: 'Missing required fields' },{status: 400});
    }

    const [isAdded, errormessage] = addMessages(myUserName, userName, message);
    return NextResponse.json({ success: isAdded, message: errormessage }, {status: 200});
}