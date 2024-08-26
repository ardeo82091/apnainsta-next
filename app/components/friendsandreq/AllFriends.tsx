import { RootState } from '@/redux/store';
import { useState } from 'react';
import { FaUserMinus, FaUserPlus, FaBan, FaUserFriends, FaUserCheck } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const users = [
    { id: 1, name: "Ankit Singh", img: "", isActive: true, isFollowing: true },
    { id: 2, name: "Akash Kumar", img: "", isActive: false, isFollowing: false },
    { id: 3, name: "Divya Singh", img: "", isActive: true, isFollowing: true },
    { id: 4, name: "Sparsh Mehta", img: "", isActive: true, isFollowing: false },
    { id: 5, name: "Vikas Kumar", img: "", isActive: true, isFollowing: false },
    { id: 6, name: "Naman Sharma", img: "", isActive: false, isFollowing: true },
    { id: 7, name: "Aarohi Patel", img: "", isActive: true, isFollowing: false },
    { id: 8, name: "Mayank Agarwal", img: "", isActive: false, isFollowing: true },
    { id: 9, name: "Aashi Gupta", img: "", isActive: true, isFollowing: true },
    { id: 10, name: "Swas Sharma", img: "", isActive: false, isFollowing: false },
    { id: 11, name: "Sashwat Yadav", img: "", isActive: true, isFollowing: true },
    { id: 12, name: "Maya Rao", img: "", isActive: true, isFollowing: false },
    { id: 13, name: "Saima Khan", img: "", isActive: true, isFollowing: true },
    { id: 14, name: "Saina Sharma", img: "", isActive: false, isFollowing: false },
    { id: 15, name: "Noor Ali", img: "", isActive: true, isFollowing: true },
    { id: 16, name: "Abhishek Mishra", img: "", isActive: true, isFollowing: true },
    { id: 17, name: "Divya Sharma", img: "", isActive: false, isFollowing: false },
    { id: 18, name: "Ankit Rawat", img: "", isActive: true, isFollowing: true },
    { id: 19, name: "Thakur Singh", img: "", isActive: true, isFollowing: false },
    { id: 20, name: "Sai Kishore", img: "", isActive: false, isFollowing: true },
];

export default function FriendsTabs() {
    const user = useSelector((state: RootState) => state.user);
    const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers');

    const filteredUsers = activeTab === 'followers'
        ? users
        : users.filter(user => user.isFollowing);

    return (
        <div className="h-screen flex flex-1 flex-col ml-16 bg-white">
            <div className="flex font-bold text-gray-800 text-xl ml-4 mt-2">
                <span>Friends</span>
            </div>
            <div className="flex bg-gray-200 rounded-md mt-4 mx-4">
                <button
                    className={`flex-1 py-2 flex items-center justify-center rounded-md ${activeTab === 'followers' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                    onClick={() => setActiveTab('followers')}
                >
                    <FaUserFriends className="mr-2" />
                    Followers
                </button>
                <button
                    className={`flex-1 py-2 flex items-center justify-center rounded-md ${activeTab === 'following' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                    onClick={() => setActiveTab('following')}
                >
                    <FaUserCheck className="mr-2" />
                    Following
                </button>
            </div>

            <div className="border-t-2 mx-4 my-2" />

            <div className=" h-screen mx-4 bg-teal-400 overflow-y-auto">
                {filteredUsers.map(user => (
                    <div key={user.id} className="flex items-center p-2 border-t justify-between">
                        <div className="flex items-center">
                            <img
                                src={user.img}
                                alt={`${user.name}'s avatar`}
                                className={`w-8 h-8 rounded-full mr-3 ${user.isActive ? 'border-2 border-green-500' : 'border-2 border-gray-400'}`}
                            />
                            <span>{user.name}</span>
                        </div>
                        <div className="flex space-x-2">
                            {activeTab === 'followers' && (
                                <>
                                    <button className="text-white bg-red-500 hover:bg-red-600 p-2 rounded-full">
                                        <FaBan />
                                    </button>
                                    {user.isFollowing ? (
                                        <button className="text-white bg-gray-500 hover:bg-gray-600 p-2 rounded-full">
                                            <FaUserMinus />
                                        </button>
                                    ) : (
                                        <button className="text-white bg-green-500 hover:bg-green-600 p-2 rounded-full">
                                            <FaUserPlus />
                                        </button>
                                    )}
                                </>
                            )}
                            {activeTab === 'following' && (
                                <>
                                    <button className="text-white bg-red-500 hover:bg-red-600 p-2 rounded-full">
                                        <FaBan />
                                    </button>
                                    <button className="text-white bg-gray-500 hover:bg-gray-600 p-2 rounded-full">
                                        <FaUserMinus />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
