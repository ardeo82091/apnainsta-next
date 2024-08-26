'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/userSlice';
import { RootState } from '@/redux/store';

const LoginPage = () => {

  const user = useSelector((state: RootState) => state.user);

  const [emailorUserName, setEmailorUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const navigationHandle = (event: string) => {
    if (event === 'register') {
      router.push('/components/register');
    }
    else {
      router.push('/components/forgotPassword');
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await axios.post('/api/login', { emailorUserName, password });
    const res = response.data;
    const userName = res.user.userName;
    if (res.success) {
      localStorage.setItem('user', JSON.stringify(res.user.userName));
      router.push(`/components/dashboard/${userName}`);
    } else {
      setError(response.data.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded p-8 shadow-md w-full max-w-md">
        <h2 className="text-3xl italic mb-6 font-extrabold text-center bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">LIVE & VIBE</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
              id="username"
              type="text"
              placeholder="Username"
              value={emailorUserName}
              onChange={(e) => setEmailorUserName(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 ... text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              onClick={(handleSubmit)}
            >
              Sign In
            </button>
            <span className='block text-gray-600'><button
              className="text-green-500 pr-4 text-sm hover:text-lg "
              type="submit"
              onClick={() => navigationHandle('register')}
            >
              Register 
            </button> 
               |   
            <button
              className="text-red-500 text-sm pl-4 hover:text-lg"
              type="submit"
              onClick={() => navigationHandle('fPassword')}
            >
               Forgot Password
            </button></span>
          </div>
      </div>
    </div>
  );
};

export default LoginPage;
