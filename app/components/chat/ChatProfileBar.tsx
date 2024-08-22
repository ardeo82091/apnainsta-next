import { StatItem } from '@/lib/hoc/ProfileStatsBar';
import Image from 'next/image';
import { FC } from 'react';
import { FaCalendarAlt, FaHeart, FaTimes, FaUser, FaUserMinus, FaUserTag, FaVideo } from 'react-icons/fa';
import { FaEye, FaMessage } from 'react-icons/fa6';
import { MdClose } from 'react-icons/md';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

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

const chats = 
[
  {
    "chatId": "chat1",
    "person": {
      "username": "@naman123",
      "name": "Naman"
    },
    "messages": [
      {
        "messageId": "msg1",
        "timestamp": "2024-08-17T10:00:00Z",
        "sender": "Naman",
        "content": "Hello, Ankit! How are you?",
        "read": false
      },
      {
        "messageId": "msg2",
        "timestamp": "2024-08-17T10:05:00Z",
        "sender": "Ankit Raj",
        "content": "Hey Naman! I'm good, just busy with some coding.",
        "read": true
      }
    ]
  },
  {
    "chatId": "chat2",
    "person": {
      "username": "@shivay456",
      "name": "Shivay"
    },
    "messages": [
      {
        "messageId": "msg3",
        "timestamp": "2024-08-17T11:00:00Z",
        "sender": "Shivay",
        "content": "Are you coming to the meeting today?",
        "read": true
      },
      {
        "messageId": "msg4",
        "timestamp": "2024-08-17T11:05:00Z",
        "sender": "Ankit Raj",
        "content": "Yes, I'll be there in 10 minutes.",
        "read": true
      }
    ]
  },
  {
    "chatId": "chat3",
    "person": {
      "username": "@aarohi789",
      "name": "Aarohi"
    },
    "messages": [
      {
        "messageId": "msg5",
        "timestamp": "2024-08-17T12:00:00Z",
        "sender": "Aarohi",
        "content": "Don't forget to submit the report.",
        "read": false
      }
    ]
  },
  {
    "chatId": "chat4",
    "person": {
      "username": "@divya321",
      "name": "Divya"
    },
    "messages": [
      {
        "messageId": "msg7",
        "timestamp": "2024-08-17T13:00:00Z",
        "sender": "Divya",
        "content": "Can you review the document I sent?",
        "read": true
      },
      {
        "messageId": "msg8",
        "timestamp": "2024-08-17T13:15:00Z",
        "sender": "Ankit Raj",
        "content": "Sure, I'll take a look at it now.",
        "read": true
      }
    ]
  }
]
const ChatProfileBar: FC<ChatSidebarProps> = ({ isOpen, onClose }) => {
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
        <div className="flex-1 mb-10">
          <MdClose className="text-gray-600 text-4xl hover:text-red-600 cursor-pointer" onClick={onClose} />
        </div>
      </div>
      <div className="flex bg-gray-800 h-14 mt-3 ml-4 mr-4">
          <StatItem label="Posts" value={405} />
          <StatItem label="Followers" value={100} />
          <StatItem label="Following" value={3} />
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

      <div className="flex flex-col h-[22rem] ml-4 mr-4 bg-gray-100 rounded-b-lg p-4">
        <div className="grid grid-cols-3 gap-2 overflow-y-auto">
          {posts.map((post) => (
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
    )
  );
};

export default ChatProfileBar;