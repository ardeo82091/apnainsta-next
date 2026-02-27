'use client'

import Image from 'next/image';
import profilePic from '@/public/images/profile.jpg';
import bannerPic from '@/public/images/bkg.jpg';
import Sidebar from '../../sidebar';
import Header from '../../header';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const MyProfile = () => {

  const user = useSelector((state: RootState) => state.user);

  return (
    <div className="flex h-screen">
  <Sidebar />

  <div className="flex flex-row-reverse flex-1">
    <Header />

    <div className="flex-1 ml-40 overflow-hidden">
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
        </div>

        <div>
          
        </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
