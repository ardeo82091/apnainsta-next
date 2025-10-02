"use client";

import { useState, useEffect, useRef } from "react";
import ChatTab from "../chat";
import Sidebar from "../../sidebar";
import ChatSidebar from "../ChatProfileBar";
import { useParams } from "next/navigation";
import axios from "axios";
import { ChatPerson, Messages, User } from "@/lib/users";
import { io, Socket } from "socket.io-client";

let socket: Socket;

const ChatWithPerson: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [multipleActiveTab, setMultipleActiveTab] = useState<ChatPerson[]>([]);
  const [formattedMessages, setFormattedMessages] = useState<Messages[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [isChatProfileOpen, setIsChatProfileOpen] = useState(false);
  const [chatProfileUserName, setChatProfileUserName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { userName } = useParams();

  const myUserName = Array.isArray(userName) ? userName[0] : userName;

  const viewChatProfile = () => {
    setIsChatProfileOpen(!isChatProfileOpen);
  };

  // Fetch user data (old messages + contacts)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/${myUserName}`);
        if (response.data) {
          setUser(response.data);
        } else {
          setError("User not found");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Error fetching user");
      }
    };

    if (myUserName) {
      fetchUserData();
    }
  }, [myUserName]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [formattedMessages]);

  // Socket.IO connection
  useEffect(() => {
    if (!myUserName) return;

    socket = io("http://localhost:4000");

    socket.emit("registerUser", myUserName);

    const handleReceiveMessage = (message: Messages) => {
      console.log("📩 New message:", message);

      setMultipleActiveTab((prevTabs) => {
        const updatedTabs = [...prevTabs];
        const index = updatedTabs.findIndex(
          (tab) => tab.person.username === message.sender
        );
        if (index !== -1) {
          updatedTabs[index].messages.push(message);
        }
        return updatedTabs;
      });

      setFormattedMessages((prev) => [...prev, message]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    // Clean up on unmount
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.disconnect();
    };
  }, [myUserName]);


  const openChatTab = (chat: ChatPerson) => {
    const isPersonTabOpen = multipleActiveTab.findIndex(
      (tabOpen) => tabOpen.person.username === chat.person.username
    );
    if (isPersonTabOpen === -1) {
      if (multipleActiveTab.length < 5) {
        setMultipleActiveTab([...multipleActiveTab, chat]);
        setFormattedMessages(chat.messages);
        setActiveTab(multipleActiveTab.length);
      } else {
        alert("You can only open up to 5 chat tabs.");
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
        setFormattedMessages(
          updatedTabs[index === 0 ? 0 : index - 1].messages
        );
      } else {
        setActiveTab(0);
        setFormattedMessages([]);
      }
    }
  };

  const sendMessage = (recipient: string, content: string) => {
    if (!myUserName) return;

    const message: Messages = {
      sender: myUserName,
      recipient,
      content,
      read: false,
    };

    // Send to server
    socket.emit("sendMessage", message);

    // Optimistic UI update
    // setMultipleActiveTab((prevTabs) => {
    //   const updatedTabs = [...prevTabs];
    //   const index = updatedTabs.findIndex(
    //     (tab) => tab.person.username === recipient
    //   );
    //   if (index !== -1) {
    //     updatedTabs[index].messages.push(message);
    //   }
    //   return updatedTabs;
    // });

    // setFormattedMessages((prev) => [...prev, message]);
    setMessageInput("");
  };

  return (
    <div className="flex flex-col h-screen">
      <Sidebar />
      <div className="flex flex-row-reverse">
        {/* Right sidebar with chat list */}
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
                <div
                  key={chat.person.username}
                  className="border-b border-gray-600 py-2 flex items-center"
                >
                  <button
                    className="focus:outline-none"
                    onClick={() => {
                      viewChatProfile();
                      setChatProfileUserName(chat.person.username);
                    }}
                  >
                    <img
                      src={chat.person.img}
                      alt={`${chat.person.name}'s avatar`}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  </button>
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => {
                      openChatTab(chat);
                    }}
                  >
                    <div className="flex text-gray-800 text-sm font-semibold">
                      {chat.person.name}
                    </div>
                    <div
                      className={`py-1 ${
                        lastMessage?.read ? "text-gray-500" : "font-bold"
                      }`}
                    >
                      <span className="ml-2 text-xs">
                        {lastMessage?.content}
                      </span>
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

        {/* Main chat area */}
        <div className="flex-1 flex flex-col ml-16">
          <div className="flex flex-col h-screen bg-gray-100 shadow-md">
            {/* Tabs */}
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

            {/* Messages */}
            <div className="flex-1 p-4 border-t border-gray-300 overflow-y-auto">
              {formattedMessages.length > 0 ? (
                formattedMessages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`mb-2 flex ${
                      message.sender === myUserName
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex flex-col ${
                        message.sender === myUserName
                          ? "items-end"
                          : "items-start"
                      }`}
                    >
                      <div
                        className={`${
                          message.sender === myUserName
                            ? "bg-blue-500"
                            : "bg-gray-700"
                        } text-sm text-white p-2 rounded-lg`}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No messages yet</div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
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
                    const recipient = multipleActiveTab[activeTab]?.person
                      .username;
                    if (recipient) sendMessage(recipient, messageInput);
                  }
                }}
                className="bg-blue-500 text-white p-2 rounded-r-lg"
              >
                Send
              </button>
              <button className="ml-2 p-2 text-gray-500 hover:text-lg">📷</button>
              <button className="ml-2 p-2 text-gray-500 hover:text-lg">📁</button>
              <button className="ml-2 p-2 text-gray-500 hover:text-lg">🎤</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWithPerson;
