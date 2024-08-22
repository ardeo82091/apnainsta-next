"use client";

import { useState, useEffect, useRef } from "react";
import ChatTab from "../chat";
import Header from "../header";
import Sidebar from "../sidebar";
import ChatBook from "./ChatBook";

interface Message {
    messageId: string;
    timestamp: string;
    sender: string;
    content: string;
    read: boolean;
    formattedTimestamp?: string;
}

interface Chat {
    chatId: string;
    person: {
        username: string;
        name: string;
    };
    messages: Message[];
}

const ChatWithPerson: React.FC = () => {
    const [activeTab, setActiveTab] = useState<number>(0);
    const [formattedMessages, setFormattedMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [chats, setChats] = useState<Chat[]>([
        {
            chatId: 'chat1',
            person: {
                username: '@naman123',
                name: 'Naman',
            },
            messages: [
                {
                    messageId: 'msg1',
                    timestamp: '2024-08-17T10:00:00Z',
                    sender: 'Naman',
                    content: 'Hello, Ankit! How are you?',
                    read: false,
                },
                {
                    messageId: 'msg2',
                    timestamp: '2024-08-17T10:05:00Z',
                    sender: 'Ankit Raj',
                    content: "Hey Naman! I'm good, just busy with some coding.",
                    read: true,
                },
            ],
        },
        {
            chatId: 'chat2',
            person: {
                username: '@shivay456',
                name: 'Shivay',
            },
            messages: [
                {
                    messageId: 'msg3',
                    timestamp: '2024-08-17T11:00:00Z',
                    sender: 'Shivay',
                    content: 'Are you coming to the meeting today?',
                    read: true,
                },
                {
                    messageId: 'msg4',
                    timestamp: '2024-08-17T11:05:00Z',
                    sender: 'Ankit Raj',
                    content: "Yes, I'll be there in 10 minutes.",
                    read: true,
                },
                {
                    messageId: 'msg7',
                    timestamp: '2024-08-17T13:00:00Z',
                    sender: 'Divya',
                    content: 'So gya',
                    read: true,
                },
                {
                    messageId: 'msg7',
                    timestamp: '2024-08-17T13:00:00Z',
                    sender: 'Divya',
                    content: 'Bol',
                    read: true,
                },
                {
                    messageId: 'msg7',
                    timestamp: '2024-08-17T13:00:00Z',
                    sender: 'Divya',
                    content: 'Bol bhi yaar',
                    read: true,
                },
                {
                    messageId: 'msg8',
                    timestamp: '2024-08-17T13:15:00Z',
                    sender: 'Ankit Raj',
                    content: "hn! are kuch nhi kaam krra tha",
                    read: true,
                },
                {
                    messageId: 'msg7',
                    timestamp: '2024-08-17T13:00:00Z',
                    sender: 'Divya',
                    content: 'Proj bn gya tera',
                    read: true,
                },
                {
                    messageId: 'msg8',
                    timestamp: '2024-08-17T13:15:00Z',
                    sender: 'Ankit Raj',
                    content: "wahi bna rha",
                    read: true,
                },
                {
                    messageId: 'msg7',
                    timestamp: '2024-08-17T13:00:00Z',
                    sender: 'Divya',
                    content: 'kitta bna ?',
                    read: true,
                },
            ],
        },
        {
            chatId: 'chat3',
            person: {
                username: '@aarohi789',
                name: 'Aarohi',
            },
            messages: [
                {
                    messageId: 'msg5',
                    timestamp: '2024-08-17T12:00:00Z',
                    sender: 'Aarohi',
                    content: "Don't forget to submit the report.",
                    read: false,
                },
            ],
        },
        {
            chatId: 'chat4',
            person: {
                username: '@divya321',
                name: 'Divya',
            },
            messages: [
                {
                    messageId: 'msg7',
                    timestamp: '2024-08-17T13:00:00Z',
                    sender: 'Divya',
                    content: 'Hi',
                    read: true,
                },
            ],
        },
    ])

    const activeChat = chats[activeTab];

    useEffect(() => {
        const formatMessages = activeChat.messages.map((message) => ({
            ...message,
            formattedTimestamp: new Date(message.timestamp).toLocaleString(),
        }));
        setFormattedMessages(formatMessages);
    }, [activeTab]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [formattedMessages]);

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            setMessageInput("");
        }
    };

    const handleTabClose = (index: number) => {
        setChats((prevChats) => prevChats.filter((_, i) => i !== index));
        setActiveTab((prevActiveTab) => (prevActiveTab > 0 ? prevActiveTab - 1 : 0));
    };

    return (
        <div className="flex flex-col h-screen">
            <Sidebar />
            <div className="flex flex-row-reverse">
                <ChatBook />
                <div className="flex-1 flex flex-col ml-16">
                <div className="flex flex-col h-screen bg-gray-100 shadow-md">
                    <div className="flex border-b border-gray-300 text-sm">
                        {chats.map((chat, index) => (
                            <ChatTab
                                key={chat.chatId}
                                label={chat.person.name}
                                isActive={activeTab === index}
                                onClick={() => setActiveTab(index)}
                                onClose={() => handleTabClose(index)}
                                className="flex-1 rounded"
                            />
                        ))}
                    </div>
                    <div className="flex-1 p-4 border-t border-gray-300 overflow-y-auto">
                        {formattedMessages.map((message) => (
                            <div
                                key={message.messageId}
                                className={`mb-2 flex ${message.sender === 'Ankit Raj' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex flex-col ${message.sender === 'Ankit Raj' ? 'items-end' : 'items-start'}`}>
                                    <div className={`bg-${message.sender === 'Ankit Raj' ? 'blue-500' : 'gray-700'} text-sm text-white p-2 rounded-lg`}>
                                        {message.content}
                                    </div>
                                </div>
                            </div>
                        ))}
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
                            onClick={() => handleSendMessage()}
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
