
import User from "@/models/User"
import { connectDB } from "@/lib/mongodb"
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { userName: string } }) {
  await connectDB()

  const user = await User.findOne({ userName: params.userName })

  if (user) {
    return NextResponse.json(user);
  } else {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }
}