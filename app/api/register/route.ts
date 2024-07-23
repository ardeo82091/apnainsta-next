import { NextResponse } from 'next/server';
import { addUser, findUser } from '../../../lib/users';

export async function POST(request: Request) {
  try {
    const { email, password, userName, dob, firstName, lastName } = await request.json();

    if (findUser(email)) {
      return NextResponse.json({ success: false, message: 'Email already exists' }, { status: 400 });
    }
    if (findUser(userName)) {
      return NextResponse.json({ success: false, message: 'Username already exists' }, { status: 400 });
    }
    const isActive = true;
    addUser({ email, password, userName, dob, firstName, lastName, isActive });
    return NextResponse.json({ success: true, message: 'Account Registered Successfully'});
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, message: 'An unexpected error occurred' }, { status: 500 });
  }
}
