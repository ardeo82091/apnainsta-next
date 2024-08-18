
'use client';

import { StatItem } from '@/lib/hoc/ProfileStatsBar';
import Image from 'next/image';
import { FC } from 'react';

import { FaUser, FaUserTag, FaCalendarAlt, FaBell, FaVideo, FaHeart } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';

interface Post {
  id: number;
  src: string;
  isVideo?: boolean;
  likes?: number;
  comments?: number;
}

const posts: Post[] = [
  { id: 1, src: '/images/profile.jpg' },
  { id: 1, src: '/images/profile.jpg' },
  { id: 2, src: '/images/profile.jpg', likes: 12, comments: 3 },
  { id: 1, src: '/images/profile.jpg' },
  { id: 2, src: '/images/profile.jpg', likes: 42, comments: 5 },
  { id: 1, src: '/images/profile.jpg' },
  { id: 2, src: '/images/profile.jpg', likes: 42, comments: 3 },
  { id: 1, src: '/images/profile.jpg' },
  { id: 2, src: '/images/profile.jpg', likes: 42, comments: 3 },
  { id: 1, src: '/images/profile.jpg' },
  { id: 2, src: '/images/profile.jpg', likes: 42, comments: 3 },
  { id: 3, src: '/images/profile.jpg', isVideo: true },
];

const Header: FC = () => {
  const notifications = [
    "Notification a",
    "Notification b",
    "Notification c",
    "Notification d",
    "Notification e",
    "Notification f",
    "Notification g",
    "Notification h",
    "Notification i",
    "Notification a",
    "Notification b",
    "Notification c",
    "Notification d",
    "Notification e",
    "Notification f",
    "Notification g",
    "Notification h",
    "Notification i",
  ];

  return (
    <div className="flex flex-col h-screen w-1/4 bg-white shadow-md ">
      <div className="flex bg-gray-900 h-14 mt-5 ml-4 mr-4 rounded-full">
          <StatItem label="Posts" value={405} />
          <StatItem label="Followers" value={100} />
          <StatItem label="Following" value={3} />
      </div>
      <div className="flex items-center">
        <img
          src="/images/profile.jpg"
          alt="User Profile"
          className="h-24 w-18 mt-7 ml-4 rounded-full"
        />
        <div className="flex flex-col mt-7 ml-4">
          <div className="flex items-center mb-2">
            <FaUser className="text-gray-900 text-md mr-2" />
            <span className="text-gray-900 text-xl font-bold">Ankit Raj</span>
          </div>
          <div className="flex items-center mb-2">
            <FaUserTag className="text-gray-900 text-md mr-2" />
            <div className="text-gray-900 text-lg">@ankit1</div>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="text-gray-900 text-md mr-2" />
            <div className="text-gray-900 text-lg font-extrabold">November 17, 2000</div>
          </div>
        </div>
      </div>
      
      <div className="border-t-2 border-gray-300 mx-4 my-4 rounded-full"></div>

      {/* <div className="flex flex-col h-[22rem] ml-4 mr-4 bg-gray-100 rounded-b-lg p-4">
        <div className="flex items-center justify-between  mb-2">
          <span className="text-gray-900 text-lg font-bold">Notifications</span>
          <FaBell className="text-gray-900 text-xl mr-2" />
        </div>

        <div className="overflow-y-auto h-64">
          {notifications.map((notification, index) => (
            <div key={index} className="text-gray-600 text-sm mb-2">
              {notification}
            </div>
          ))}
        </div>
        <button className="text-[14px] pt-4 font-bold underline hover:text-blue-600">View all</button>
      </div> */}

      <div className="flex flex-col h-[22rem] ml-4 mr-4 bg-gray-100 rounded-b-lg p-4">
        <div className="grid grid-cols-3 gap-2 overflow-y-auto">
          {posts.map((post) => (
            <div key={post.id} className="relative">
              <Image
                src={post.src}
                alt={`Post ${post.id}`}
                width={200}
                height={200}
                className="object-cover w-full h-full"
              />
              {post.isVideo && (
                <div className="absolute top-2 left-2 text-white">
                  <FaVideo className="text-blue-400 text-sm " />
                </div>
              )}
              {(post.likes || post.comments) && (
                <div className="absolute bottom-2 left-2 text-white">
                  <div className="flex space-x-2">
                    {post.likes && (
                      <div className="flex items-center">
                        <FaHeart className="text-red-600 text-sm" />
                        <span className="ml-1">{post.likes}</span>
                      </div>
                    )}
                    {post.comments && (
                      <div className="flex items-center">
                        <FaMessage className="text-blue-200 text-sm" />
                        <span className="ml-1">{post.comments}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;