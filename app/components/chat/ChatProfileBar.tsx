import { StatItem } from '@/lib/props/ProfileStatsBar';
import { User } from '@/lib/users';
import axios from 'axios';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { FaCalendarAlt, FaHeart, FaUser, FaUserMinus, FaUserTag, FaVideo } from 'react-icons/fa';
import { FaEye, FaMessage } from 'react-icons/fa6';
import { MdClose } from 'react-icons/md';

interface ChatSidebarProps {
  userName: string | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const ChatProfileBar: FC<ChatSidebarProps> = ({userName, isOpen, onClose }) => {

  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await axios.get(`/api/users/${userName}`);
      if (response.data) {
          setUser(response.data);
      } else {
          setError("User not found");
      }
    };

    if (userName) {
        fetchUserData();
    }
  }, [userName]);


  return (
    isOpen && (
      <div className="flex flex-col h-screen w-1/4 bg-white shadow-md ">
      <div className="flex items-center mt-2">
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
              {(user) ? new Date(user.dob).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }) : "N/A" }
            </div>
          </div>
        </div>
        <div className="flex-1 mb-10">
          <MdClose className="text-gray-600 text-4xl hover:text-red-600 cursor-pointer" onClick={onClose} />
        </div>
      </div>
      <div className="flex bg-gray-800 h-14 mt-3 mx-4 justify-around items-center">
        <StatItem label="Posts" value={user?.posts.length || 0} />
        <StatItem label="Followers" value={user?.followers.length || 0} />
        <StatItem label="Following" value={user?.following.length || 0} />
      </div>
      <div className="border-t-2 border-gray-300 mt-4 ml-4 mr-4 rounded-full"></div>
        <div className="flex justify-between">
          <button className="flex text-[14px] font-bold text-gray-900 ml-6 hover:text-blue-600">View Full Profile
          <FaEye className="flex mt-1 ml-2"/>
          </button>
          <button className="text-[14px] font-bold text-gray-900">| </button>
          <button className="flex text-[14px] font-bold text-gray-900 mr-12 hover:text-red-600">
          <FaUserMinus className="flex mt-1 mr-4"/>Unfollow</button>
        </div>
      <div className="border-t-2 border-gray-300 mb-4 ml-4 mr-4 rounded-full"></div>

      <div className="flex flex-col h-auto min-h-[20rem] ml-4 mr-4 bg-gray-100 rounded-b-lg p-4">
        <div className="grid grid-cols-3 gap-2 overflow-y-auto">
          {user?.posts.map((post) => (
            <div key={post.id} className="relative">
              <Image
                src={post.src}
                alt={`Post ${post.id}`}
                width={200}
                height={200}
                className="object-cover w-full h-full z-10"
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
                        <span className="ml-1">{post.likes.length}</span>
                      </div>
                    )}
                    {post.comments && (
                      <div className="flex items-center">
                        <FaMessage className="text-blue-200 text-sm" />
                        <span className="ml-1">{post.comments.length}</span>
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
    )
  );
};

export default ChatProfileBar;