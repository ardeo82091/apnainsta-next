'use client';

import { RootState } from "@/redux/store";
import { useState } from "react";
import { FaCheck, FaInbox, FaPaperPlane, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";

const FriendRequest = () => {

    const user = useSelector((state: RootState) => state.user);

    const [selectedTab, setSelectedTab] = useState<'received' | 'sent'>('received');
    const requests = user.friendAndRequests?.requests || [];

    const filteredUsers = selectedTab === 'received' ? requests.filter(requests => !requests.isSent)
    : requests.filter(requests => requests.isSent);

    console.log(filteredUsers);

    const OnTabClick = (tab: 'received' | 'sent') => {
        setSelectedTab(tab);
    };

    return (
        <>
            <div className="h-screen bg-white w-1/3 flex flex-col p-4 ml-1">
                <div className="flex items-center font-bold text-gray-600 text-md mb-2">
                    <span>Friend Requests</span>
                </div>
                <div className="border-t-2 mb-2"></div>
                <div className="flex justify-between bg-gray-200 rounded-md">
                    <button
                        className={`flex items-center justify-center flex-1 py-2 rounded-md ${selectedTab === 'received' ? 'bg-blue-500 text-white' : 'text-gray-600'
                            }`}
                        onClick={() => OnTabClick('received')}
                    >
                        <FaInbox className="mr-2" />
                        Received
                    </button>
                    <button
                        className={`flex items-center justify-center flex-1 py-2 rounded-md ${selectedTab === 'sent' ? 'bg-blue-500 text-white' : 'text-gray-600'
                            }`}
                        onClick={() => OnTabClick('sent')}
                    >
                        <FaPaperPlane className="mr-2" />
                        Sent
                    </button>
                </div>
                <div className="border-t-2 mt-2"></div>
                <div className="h-screen mt-4 bg-gradient-to-r from-gray-500 to-teal-500 overflow-y-auto">
                    {filteredUsers.map((user => (
                        <div key={user.id} className="flex justify-between items-center p-2 border-b text-white text-sm">
                            <img src={user.person.img} alt={`${user.person.name}'s avatar`} className="w-8 h-8 rounded-full mr-3" />
                            <span>{user.person.name}</span>
                            {selectedTab === 'received' ? (
                                <div>
                                    <button className="bg-green-500 p-1 rounded mr-2">
                                        <FaCheck className="text-white" />
                                    </button>
                                    <button className="bg-red-500 p-1 rounded">
                                        <FaTimes className="text-white" />
                                    </button>
                                </div>
                            ) : (
                                <span className="text-gray-800">Sent</span>
                            )}
                        </div>
                    )))}
                </div>
            </div>
        </>
    );
}

export default FriendRequest;