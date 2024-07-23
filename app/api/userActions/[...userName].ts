import type { NextApiRequest, NextApiResponse } from 'next';

import { deleteUser, deactivateUser, activateUser, findUser } from '../../../lib/users';


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userName } = req.query;

  if (typeof userName !== 'string') {
    return res.status(400).json({ message: 'Invalid userName' });
  }

  if (req.method === 'POST') {
    const { action } = req.body;

    switch (action) {
      case 'activate':
        const activateUserResult = findUser(userName);
        if (activateUserResult) {
          activateUser(userName);
          res.status(200).json({ message: 'User activated', user: activateUserResult });
        } else {
          res.status(404).json({ message: 'User not found' });
        }
        break;

      case 'deactivate':
        const deactivateUserResult = findUser(userName);
        if (deactivateUserResult) {
          deactivateUser(userName);
          res.status(200).json({ message: 'User deactivated', user: deactivateUserResult });
        } else {
          res.status(404).json({ message: 'User not found' });
        }
        break;

      case 'delete':
        const deleteUserResult = findUser(userName);
        if (deleteUserResult) {
          deleteUser(userName);
          res.status(200).json({ message: 'User deleted' });
        } else {
          res.status(404).json({ message: 'User not found' });
        }
        break;

      default:
        res.status(400).json({ message: 'Invalid action' });
        break;
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
