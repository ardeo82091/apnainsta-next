import { NextResponse } from 'next/server';
import { addUser, findUser } from '../../../lib/users';

export async function POST(request: Request) {
  try {
    const { email, password, userName, dob, fullName, phoneNumber } = await request.json();
    
    const [isEmailExist, user] = findUser(email);
    const [isUserExist, userRef] = findUser(userName);
    if (isEmailExist) {
      return NextResponse.json({ success: false, message: 'Email already exists' }, { status: 400 });
    }
    if (isUserExist) {
      return NextResponse.json({ success: false, message: 'Username already exists' }, { status: 400 });
    }
    const isActive = true;
    const role = 'user';
    const [isUserAdded, newUser] = addUser({ email, password, userName, dob, fullName, phoneNumber, isActive, role, followers: [], following: [], chatPerson: [], posts: [], notifications: [], });
    return NextResponse.json({ success: isUserAdded, user: newUser, message: 'Account Registered Successfully'}, {status: 200});
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, message: 'An unexpected error occurred' }, { status: 500 });
  }
}
