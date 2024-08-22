// app/api/users/[userName]/route.ts

import { findUser } from '@/lib/users';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { userName: string } }) {
  const userName = params.userName;
  const [isUserExist, user] = findUser(userName);

  if (isUserExist && user) {
    return NextResponse.json(user);
  } else {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }
}
