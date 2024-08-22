import { FC, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import ChatSidebar from './ChatProfileBar';

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
const ChatBook = () => {
  const [isChatProfileOpen, setIsChatProfileOpen] = useState(false);

  const viewChatProfile = () => {
    setIsChatProfileOpen(!isChatProfileOpen);
    console.log(isChatProfileOpen);
  }

  return (
      <>
        <div className="h-screen bg-white w-1/3 flex flex-col p-4 ml-1">
          <div className="flex items-center font-bold text-gray-600 text-lg mb-4">
            <span>Messages</span>
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
          />
          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => {
              const lastMessage = chat.messages[chat.messages.length - 1];
              return (
                <div key={chat.chatId} className="border-b border-gray-600 py-2 flex items-center">
                  <button className="focus:outline-none" onClick={viewChatProfile}>
                    <img
                      src={chat.person.username}
                      alt={`${chat.person.name}'s avatar`}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  </button>
                  <div className="flex-1">
                    <div className="flex text-gray-800 text-lg font-semibold">
                      {chat.person.name}
                    </div>
                    <div className={`py-1 ${lastMessage.read ? 'text-gray-500' : 'font-bold'}`}>
                      <div className="flex items-center">
                        {/* <span className="font-semibold">{lastMessage.sender}:</span>z */}
                        <span className="ml-2">{lastMessage.content}</span>
                      </div>
                      <div className="text-gray-500 text-xs">
                        {/* {new Date(lastMessage.timestamp).toLocaleTimeString()} */}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {isChatProfileOpen && (
          <ChatSidebar
          isOpen={isChatProfileOpen}
          onClose={viewChatProfile}
          />
        )}
      </>
    )
};

export default ChatBook;