
import { deleteUser, deactivateUser, activateUser, findUser, updateUser } from '../../../lib/users';
import { NextResponse } from 'next/server';

// function updateUser(action: string, userName: string) {
//   switch (action) {
//     case 'activate':
//       const activateUserResult = findUser(userName);
//       if (activateUserResult) {
//         activateUser(userName);
//         NextResponse.json({ message: 'User activated', user: activateUserResult }, {status: 200});
//       } else {
//         NextResponse.json({ message: 'User not found' }, {status: 404});
//       }
//       break;

//     case 'deactivate':
//       const deactivateUserResult = findUser(userName);
//       if (deactivateUserResult) {
//         deactivateUser(userName);
//         NextResponse.json({ message: 'User deactivated', user: deactivateUserResult }, { status: 200});
//       } else {
//         NextResponse.json({ message: 'User not found' }, {status: 404});
//       }
//       break;

//     case 'delete':
//       const deleteUserResult = findUser(userName);
//       if (deleteUserResult) {
//         deleteUser(userName);
//         NextResponse.json({ message: 'User deleted' });
//       } else {
//         NextResponse.json({ message: 'User not found' });
//       }
//       break;

//     default:
//       NextResponse.json({ message: 'Invalid action' });
//       break;
//   }
// }


export async function PUT(req : Request){
  try{
    const {userName, action} = await req.json();
    const [isUserUpdated, message] = updateUser(userName, action);
    return NextResponse.json({success : isUserUpdated, message: message}, {status: isUserUpdated ? 200 :400})
  }
  catch (error){
    console.error('Error updating user:', error);
    return NextResponse.json({ success: false, message: 'Failed to update user' }, { status: 500 });
  }
}
