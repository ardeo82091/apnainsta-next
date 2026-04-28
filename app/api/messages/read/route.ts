import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb"
import Message from "@/models/Message";

export async function PATCH(req: NextRequest) {
  try {
    const { chatId, myUserName } = await req.json();

    if (!chatId || !myUserName) {
      return NextResponse.json(
        { error: "chatId and myUserName required" },
        { status: 400 }
      );
    }

    await connectDB();

    await Message.updateMany(
      {
        chatId,
        sender: { $ne: myUserName },
      },
      {
        $addToSet: { readBy: myUserName },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("READ API ERROR:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}