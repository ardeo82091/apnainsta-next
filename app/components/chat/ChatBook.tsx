import { FC, useState } from 'react';
import ChatSidebar from './ChatProfileBar';
import { User } from '@/lib/users';

const ChatBook: FC<{user : User | null}> = ({user}) => {
  const [isChatProfileOpen, setIsChatProfileOpen] = useState(false);
  const [chatProfileUserName, setChatProfileUserName] = useState('');

  const viewChatProfile = () => {
    setIsChatProfileOpen(!isChatProfileOpen);
  }

  return (
      <>
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
                  <button className="focus:outline-none" onClick={() => {viewChatProfile(); setChatProfileUserName(chat.person.username);}}>
                    <img
                      src={chat.person.username}
                      alt={`${chat.person.name}'s avatar`}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  </button>
                  <div className="flex-1">
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
      </>
    )
};

export default ChatBook;