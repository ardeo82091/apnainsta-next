
'use client';

import { StatItem } from '@/lib/hoc/ProfileStatsBar';
import { User } from '@/lib/users';
import { FC, useState } from 'react';

import { FaUser, FaUserTag, FaCalendarAlt, FaBell, FaVideo, FaHeart, FaThumbsUp, FaComment, FaUserPlus } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';

const Header: FC<{ user: User | null }> = ({ user }) => {
  const [clickedNoty, setClickedNoty] = useState(null);

  const seeNotificationTime = (id : any) => {
    if (clickedNoty === id) {
      setClickedNoty(null);
    } else {
      setClickedNoty(id);
    }
  };

  return (
    <div className="flex flex-col h-screen w-1/4 bg-white shadow-md ">
      <div className="flex bg-gray-900 h-14 mt-5 ml-4 mr-4 rounded-full">
          <StatItem label="Posts" value={user?.posts.length || 0} />
          <StatItem label="Followers" value={user?.followers.length || 0} />
          <StatItem label="Following" value={user?.following.length || 0} />
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
            <span className="text-gray-900 text-xl font-bold">{user?.fullName}</span>
          </div>
          <div className="flex items-center mb-2">
            <FaUserTag className="text-gray-900 text-md mr-2" />
            <div className="text-gray-900 text-lg">@{user?.userName}</div>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="text-gray-900 text-md mr-2" />
            <div className="text-gray-900 text-lg font-extrabold">
              {(user?.dob) ? new Date(user.dob).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }) : "N/A" }
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t-2 border-gray-300 mx-4 my-4 rounded-full"></div>

      <div className="flex flex-col h-[22rem] ml-4 mr-4 bg-gray-100 rounded-b-lg p-4">
        <div className="flex items-center justify-between  mb-2">
          <span className="text-gray-900 text-lg font-bold">Notifications</span>
          <FaBell className="text-gray-900 text-xl mr-2" />
        </div>

        <div className="overflow-y-auto h-64">
          {user?.notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`flex flex-col bg-gradient-to-r ${
                notification.type === "like" ? 'from-blue-100 to-blue-300' :
                notification.type === "comment" ? 'from-green-100 to-green-300' :
                notification.type === "follow" ? 'from-purple-100 to-purple-300' : ''
              } text-gray-900 shadow-md rounded-lg p-2 mb-2 cursor-pointer`}
              onClick={() => seeNotificationTime(notification.id)}
            >
              <div className="flex items-center">
                <div className="flex items-center">
                  {notification.type === "like" && <FaThumbsUp className="text-blue-600 mr-2" />}
                  {notification.type === "comment" && <FaComment className="text-green-600 mr-2" />}
                  {notification.type === "follow" && <FaUserPlus className="text-purple-600 mr-2" />}
                  <span className="ml-2 text-sm">{notification.message}</span>
                </div>
              </div>
              {clickedNoty === notification.id && (
                <div className="mt-1 text-xs text-gray-500 text-right">
                  {new Date(notification.timestamp).toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>

        <button className="text-[14px] pt-4 font-bold underline hover:text-blue-600">View all</button>
      </div>
    </div>
  );
};

export default Header;