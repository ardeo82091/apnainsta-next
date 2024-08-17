// 'use client';

// import axios from 'axios';
// import { useEffect, useState } from 'react';

// const UsersPage = () => {
//   const [users, setUsers] = useState<{ email: string; password: string }[]>([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.post('/api/register');

//         if (response.data.success) {
//           setUsers(response.data.users);
//         } else {
//           setError(response.data.message || 'Failed to fetch users');
//         }
//       } catch (error) {
//         console.error('An error occurred:', error);
//         setError('An unexpected error occurred');
//       }
//     };

//     fetchUsers();
//   }, []);

//   return (
//     <div>
//       <h1>Registered Users</h1>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <ul>
//         {users.map((user, index) => (
//           <li key={index}>{user.email}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default UsersPage;
