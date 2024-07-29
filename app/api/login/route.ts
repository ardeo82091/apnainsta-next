import { NextResponse } from 'next/server';
import { findUser, passwordCorrect } from '../../../lib/users';

export async function POST(request: Request) {
  try {
    const { emailorUserName, password} = await request.json();
    const [isUserExist, user] = passwordCorrect(emailorUserName, password);

    if (isUserExist) {
      return NextResponse.json({ success: true, user });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'An unexpected error occurred' }, { status: 500 });
  }
}
