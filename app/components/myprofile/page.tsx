'use-client'

import Image from 'next/image';
import profilePic from '@/public/images/profile.jpg';
import bannerPic from '@/public/images/bkg.jpg';
import Sidebar from '../sidebar';
import Header from '../header';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const MyProfile = () => {

  const user = useSelector((state: RootState) => state.user);

  return (
    <div className="flex flex-col">
      <Sidebar />

        <div className="p-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="h-48 w-full overflow-hidden">
                <Image src={bannerPic} fill
                  style={{ objectFit: 'cover' }}
                  alt="Background image" />
              </div>

              <div className="absolute ml-20 transform -translate-x-1/2 -translate-y-1/2">
                <Image
                  src={profilePic}
                  alt="Profile Picture"
                  width={100}
                  height={100}
                  className="rounded-full border-4 border-white"
                />
              </div>
            </div>

            <div className="flex flex-col items-center mt-10">
              <h2 className="text-2xl font-bold">Ankit Raj</h2>
              <div className="flex space-x-4 mt-4">
                <button className="flex items-center bg-white text-gray-700 border border-gray-300 shadow-sm rounded-md px-4 py-2 hover:bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75m19.5 0v10.5M2.25 6.75L12 12.75l9.75-6"
                    />
                  </svg>
                  Message
                </button>

                {/* Call Button */}
                <button className="flex items-center bg-white text-gray-700 border border-gray-300 shadow-sm rounded-md px-4 py-2 hover:bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5.25v13.5A1.5 1.5 0 004.5 20.25h15a1.5 1.5 0 001.5-1.5V5.25A1.5 1.5 0 0019.5 3.75h-15A1.5 1.5 0 003 5.25zm12 0h3v3h-3v-3zm-6 0h3v3H9v-3z"
                    />
                  </svg>
                  Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default MyProfile;
