import { FC } from 'react';
import { FaTimes } from 'react-icons/fa';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatSlidebar: FC<ChatSidebarProps> = ({ isOpen, onClose }) => {
  return (
    isOpen && (
      <div className="h-screen bg-gray-800 w-2/5 flex flex-col justify-start fixed right-0 p-4 ">
        <div className="w-full flex justify-between items-center text-white text-lg mb-4">
          <span>Messages</span>
          <FaTimes className="cursor-pointer" onClick={onClose} />
        </div>
        <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        />
      </div>
    )
  );
};

export default ChatSlidebar;
