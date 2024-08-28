"use client";

import { useState, useEffect, useRef } from "react";
import ChatTab from "../chat";
import Sidebar from "../../sidebar";
import ChatSidebar from '../ChatProfileBar';
import { useParams } from "next/navigation";
import axios from "axios";
import { ChatPerson, Messages, User } from "@/lib/users";


const ChatWithPerson: React.FC = () => {
    const [activeTab, setActiveTab] = useState<number>(0);
    const [multipleActiveTab, setMultipleActiveTab] = useState<ChatPerson[]>([]);
    const [formattedMessages, setFormattedMessages] = useState<Messages[]>([]);
    const [messageInput, setMessageInput] = useState<string>("");
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState('');
    const [isChatProfileOpen, setIsChatProfileOpen] = useState(false);
    const [chatProfileUserName, setChatProfileUserName] = useState('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const { userName } = useParams();

    const viewChatProfile = () => {
        setIsChatProfileOpen(!isChatProfileOpen);
    }

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

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
        
    }, [formattedMessages]);

    const openChatTab = (chat: ChatPerson) => {
        const isPersonTabOpen = multipleActiveTab.findIndex(tabOpen => tabOpen.person.username === chat.person.username);
        if (isPersonTabOpen === -1) {
            if (multipleActiveTab.length < 5) {
                setMultipleActiveTab([...multipleActiveTab, chat]);
                setFormattedMessages(chat.messages);
                setActiveTab(multipleActiveTab.length);
            } else {
                alert('You can only open up to 5 chat tabs.');
            }
        } else {
            setActiveTab(isPersonTabOpen);
            setFormattedMessages(multipleActiveTab[isPersonTabOpen].messages);
        }
    };

    const closeChatTab = (index: number) => {
        const updatedTabs = multipleActiveTab.filter((_, i) => i !== index);
        setMultipleActiveTab(updatedTabs);

        if (index === activeTab) {
            if (updatedTabs.length > 0) {
                setActiveTab(index === 0 ? 0 : index - 1);
            } else {
                setActiveTab(0);
            }
        } else if (updatedTabs.length === 0) {
            setActiveTab(0);
        }
        const tabChange = index>0 ? (multipleActiveTab[index - 1].messages) : [];
        setFormattedMessages(tabChange);
    };

    const sendMessage = async (myUserName: string, message: string) => {
        const response = await axios.post(`/api/chat/${userName}`,{"userName":myUserName, message})
        console.log(response);
    }

    return (
        <div className="flex flex-col h-screen">
            <Sidebar />
            <div className="flex flex-row-reverse">
                <div className="h-screen bg-white w-1/3 flex flex-col p-4 ml-1">
                    <div className="flex items-center font-bold text-gray-600 text-md mb-4">
                        <span>Messages</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
                    />
                    <div className="flex-1 overflow-y-auto">
                        {user?.chatPerson.map((chat) => {
                            const lastMessage = chat.messages[chat.messages.length - 1];
                            return (
                                <div key={chat.person.username} className="border-b border-gray-600 py-2 flex items-center">
                                    <button className="focus:outline-none" onClick={() => { viewChatProfile(); setChatProfileUserName(chat.person.username); }}>
                                        <img
                                            src={chat.person.username}
                                            alt={`${chat.person.name}'s avatar`}
                                            className="w-10 h-10 rounded-full mr-3"
                                        />
                                    </button>
                                    <div className="flex-1 cursor-pointer" onClick={() => { openChatTab(chat); console.log(chat); }}>
                                        <div className="flex text-gray-800 text-sm font-semibold">
                                            {chat.person.name}
                                        </div>
                                        <div className={`py-1 ${lastMessage.read ? 'text-gray-500' : 'font-bold'}`}>
                                            <div className="flex items-center">
                                                {/* <span className="font-semibold">{lastMessage.sender}:</span>z */}
                                                <span className="ml-2 text-xs">{lastMessage.content}</span>
                                            </div>
                                            {/* <div className="text-gray-500 text-xs">
                                                        {new Date(lastMessage.timestamp).toLocaleTimeString()}
                                                    </div> */}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {isChatProfileOpen && (
                    <ChatSidebar
                        userName={chatProfileUserName}
                        isOpen={isChatProfileOpen}
                        onClose={viewChatProfile}
                    />
                )}

                <div className="flex-1 flex flex-col ml-16">
                    <div className="flex flex-col h-screen bg-gray-100 shadow-md">
                        <div className="flex border-b border-gray-300 text-sm">
                            {multipleActiveTab.map((chat, index) => (
                                <ChatTab
                                    key={chat.person.username}
                                    label={chat.person.name}
                                    isActive={activeTab === index}
                                    onClick={() => {
                                        setActiveTab(index);
                                        setFormattedMessages(chat.messages);
                                    }}
                                    onClose={() => closeChatTab(index)}
                                    className="flex-1 rounded"
                                />
                            ))}
                        </div>
                        <div className="flex-1 p-4 border-t border-gray-300 overflow-y-auto">
                            {formattedMessages && formattedMessages.length > 0 ? (
                                formattedMessages.map((message) => (
                                    <div
                                        key={message.sender + message.content}
                                        className={`mb-2 flex ${message.sender === userName ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex flex-col ${message.sender === userName ? 'items-end' : 'items-start'}`}>
                                            <div className={`bg-${message.sender === userName ? 'blue-500' : 'gray-700'} text-sm text-white p-2 rounded-lg`}>
                                                {message.content}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500"></div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="border-t border-gray-300 p-4 flex items-center">
                            <input
                                type="text"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 p-2 border rounded-l-lg focus:outline-none"
                            />
                            <button
                                onClick={() => {
                                    if (messageInput.trim()) {
                                      const updatedTabs = [...multipleActiveTab];
                                      sendMessage(updatedTabs[activeTab].person.username,messageInput);
                                      const message = {
                                        sender: Array.isArray(userName) ? userName[0] : userName,
                                        content: messageInput,
                                        read: false
                                    };
                                      
                                      updatedTabs[activeTab].messages.push(message);
                                      console.log(updatedTabs[activeTab]);
                            
                                      setMultipleActiveTab(updatedTabs);
                                      setFormattedMessages(updatedTabs[activeTab].messages);
                            
                                      setMessageInput("");
                                    }
                                    <div ref={messagesEndRef} />
                                  }}
                                  className="bg-blue-500 text-white p-2 rounded-r-lg"
                            >
                                Send
                            </button>
                            <button className="ml-2 p-2 text-gray-500 hover:text-lg">
                                📷
                            </button>
                            <button className="ml-2 p-2 text-gray-500 hover:text-lg">
                                📁
                            </button>
                            <button className="ml-2 p-2 text-gray-500 hover:text-lg">
                                🎤
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatWithPerson;
