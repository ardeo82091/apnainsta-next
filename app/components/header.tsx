
'use client';

import { StatItem } from '@/lib/hoc/ProfileStatsBar';
import { User } from '@/lib/users';
import { FC, useState } from 'react';

import { FaUser, FaUserTag, FaCalendarAlt, FaBell, FaThumbsUp, FaComment, FaUserPlus, FaHeart } from 'react-icons/fa';

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
      <div className="flex bg-gray-900 h-14 mt-5 mx-4 rounded-full justify-around items-center">
        <StatItem label="Posts" value={user?.posts.length || 0} />
        <StatItem label="Followers" value={user?.followers.length || 0} />
        <StatItem label="Following" value={user?.following.length || 0} />
    </div>
      <div className="flex items-center">
        <img
          src="/images/profile.jpg"
          alt="User Profile"
          className="h-24 w-18 mt-4 ml-4 rounded-full"
        />
        <div className="flex flex-col mt-4 ml-4">
          <div className="flex items-center mb-2">
            <FaUser className="text-gray-900 text-md mr-2" />
            <span className="text-gray-900 text-lg font-bold">{user?.fullName}</span>
          </div>
          <div className="flex items-center mb-2">
            <FaUserTag className="text-gray-900 text-md mr-2" />
            <div className="text-gray-900 text-md">@{user?.userName}</div>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="text-gray-900 text-md mr-2" />
            <div className="text-gray-900 text-md font-extrabold">
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

      <div className="flex flex-col h-auto min-h-[12rem] ml-4 mr-4 bg-gray-100 rounded-b-lg p-4">
        <div className="flex items-center justify-between  mb-2">
          <span className="text-gray-900 text-md font-bold">Notifications</span>
          <FaBell className="text-gray-900 text-xl mr-2" />
        </div>

        <div className="overflow-y-auto h-64">
          {user?.notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`flex flex-col bg-gradient-to-r ${
                notification.type === "like" ? 'from-rose-100 to-rose-400' :
                notification.type === "comment" ? 'from-sky-100 to-sky-500' :
                notification.type === "follow" ? 'from-teal-50 to-teal-500' : ''
              } text-gray-900 shadow-md rounded-lg p-2 mb-2 cursor-pointer`}
              onClick={() => seeNotificationTime(notification.id)}
            >
              <div className="flex items-center">
                <div className="flex items-center">
                  {notification.type === "like" && <FaHeart className="text-red-600 mr-2" />}
                  {notification.type === "comment" && <FaComment className="text-sky-700 mr-2" />}
                  {notification.type === "follow" && <FaUserPlus className="text-teal-600 mr-2" />}
                  <span className="ml-2 text-xs">{notification.message}</span>
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

        <button className="text-sm pt-3 font-bold underline hover:text-blue-600">View all</button>
      </div>
    </div>
  );
};

export default Header;