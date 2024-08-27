import { RootState } from '@/redux/store';
import { useState } from 'react';
import { FaUserMinus, FaUserPlus, FaBan, FaUserFriends, FaUserCheck, FaMinus } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export default function FriendsTabs() {
    const users = useSelector((state: RootState) => state.user);
    const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers');

    const followers = users.friendAndRequests?.followers || [];

    const filteredFollowers = activeTab === 'followers'
    ? followers.filter(follower => follower.isFollowed
      )
    : followers.filter(follower => follower.isFollowing
      );

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
                {filteredFollowers.map((user => (
                    <div key={user.id} className="flex items-center p-2 border-t justify-between">
                        <div className="flex items-center">
                            <img
                                src={user.person.img}
                                alt={`${user.person.name}'s avatar`}
                                className={`w-8 h-8 rounded-full mr-3 ${user.isOnline ? 'border-2 border-green-500' : 'border-2 border-gray-400'}`}
                            />
                            <span>{user.person.name}</span>
                        </div>
                        <div className="flex space-x-2">
                            {activeTab === 'followers' && (
                                <>
                                    <button className="text-white bg-red-500 hover:bg-red-600 p-2 rounded-full">
                                        <FaMinus />
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
                                    <button className="text-white bg-gray-500 hover:bg-gray-600 p-2 rounded-full">
                                        <FaUserMinus />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )))}
            </div>
        </div>
    );
}
