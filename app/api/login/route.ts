import { NextResponse } from 'next/server';
import { findUser } from '../../../lib/users';

export async function POST(request: Request) {
  try {
    const { emailorUserName, password} = await request.json();
    const user = findUser(emailorUserName);

    if (user && user.password === password) {
      return NextResponse.json({ success: true, user });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'An unexpected error occurred' }, { status: 500 });
  }
}
