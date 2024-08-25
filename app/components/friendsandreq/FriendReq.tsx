'use client';

import { useState } from "react";
import { FaCheck, FaInbox, FaPaperPlane, FaTimes } from "react-icons/fa";

const users = [
    { id: 1, name: 'Abhishek Sharma', requestType: 'received', img: '/images/profile.jpg' },
    { id: 2, name: 'Divya Singh', requestType: 'sent', img: '/images/bkg.jpg' },
    { id: 3, name: 'Ankit Raj', requestType: 'received', img: '/images/positive-vibes.png' },
    { id: 4, name: 'Thakur Singh', requestType: 'sent', img: '/images/positive-vibes.png' },
    { id: 5, name: 'Sai Kishore', requestType: 'received', img: '/images/positive-vibes.png' },
    { id: 6, name: 'Aarohi Mehta', requestType: 'sent', img: '/images/positive-vibes.png' },
    { id: 7, name: 'Shubanshu Agarwal', requestType: 'received', img: '/images/positive-vibes.png' },
    { id: 8, name: 'Abhishek Sharma', requestType: 'sent', img: '/images/positive-vibes.png' },
    { id: 9, name: 'Divya Singh', requestType: 'received', img: '/images/positive-vibes.png' },
    { id: 10, name: 'Ankit Raj', requestType: 'sent', img: '/images/positive-vibes.png' },
    { id: 11, name: 'Thakur Singh', requestType: 'received', img: '/images/positive-vibes.png' },
    { id: 12, name: 'Sai Kishore', requestType: 'sent', img: '/images/positive-vibes.png' },
    { id: 13, name: 'Aarohi Mehta', requestType: 'received', img: '/images/positive-vibes.png' },
    { id: 14, name: 'Shubanshu Agarwal', requestType: 'sent', img: '/images/positive-vibes.png' },
    { id: 15, name: 'Abhishek Sharma', requestType: 'received', img: '/images/positive-vibes.png' },
    { id: 16, name: 'Divya Singh', requestType: 'sent', img: '/images/positive-vibes.png' },
    { id: 17, name: 'Ankit Raj', requestType: 'received', img: '/images/positive-vibes.png' },
    { id: 18, name: 'Thakur Singh', requestType: 'sent', img: '/images/positive-vibes.png' },
    { id: 19, name: 'Sai Kishore', requestType: 'received', img: '/images/positive-vibes.png' },
    { id: 20, name: 'Aarohi Mehta', requestType: 'sent', img: '' },
  ];


const FriendRequest = () => {

    const [selectedTab, setSelectedTab] = useState<'received' | 'sent'>('received');

    const filteredUsers = users.filter(user => user.requestType === selectedTab);

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
                <div className="mt-4 bg-gradient-to-r from-gray-500 to-teal-500 overflow-y-auto">
                    {filteredUsers.map(user => (
                        <div key={user.id} className="flex justify-between items-center p-2 border-b text-white text-sm">
                            <img src={user.img} alt={`${user.name}'s avatar`} className="w-8 h-8 rounded-full mr-3" />
                            <span>{user.name}</span>
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
                    ))}
                </div>
            </div>
        </>
    );
}

export default FriendRequest;