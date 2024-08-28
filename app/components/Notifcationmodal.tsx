import { RootState } from '@/redux/store';
import React, { FC } from 'react';
import { FaComment, FaHeart, FaTimes, FaUserPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationModal: FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const user = useSelector((state: RootState) => state.user);

  return (
    <div className="inset-0 bg-black bg-opacity-50 flex justify-center z-50 fixed">
      <div className="bg-white p-10 rounded-md shadow-md w-full max-w-md">

        <div className='flex justify-between'>
          <div className="text-lg font-semibold mb-4">Notifications</div>
          <div className='flex'>
            <button
              className="text-gray-800 p-2 rounded-md"
              onClick={onClose}
            >
              <FaTimes />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto h-64">
          {user?.notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex flex-col bg-gradient-to-r ${notification.type === "like" ? 'from-rose-100 to-rose-400' :
                  notification.type === "comment" ? 'from-sky-100 to-sky-500' :
                    notification.type === "follow" ? 'from-teal-50 to-teal-500' : ''
                } text-gray-900 shadow-md rounded-lg p-2 mb-2 cursor-pointer`}
            >
              <div className="flex items-center">
                <div className="flex items-center">
                  {notification.type === "like" && <FaHeart className="text-red-600 mr-2" />}
                  {notification.type === "comment" && <FaComment className="text-sky-700 mr-2" />}
                  {notification.type === "follow" && <FaUserPlus className="text-teal-600 mr-2" />}
                  <span className="ml-2 text-xs">{notification.message}</span>
                </div>
              </div>
              <div className="mt-1 text-xs text-gray-500 text-right">
                {new Date(notification.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
