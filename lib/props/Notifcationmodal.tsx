import React, { FC } from 'react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationModal: FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 fixed">
      <div className="bg-white p-10 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>
        <p className="mb-6">Are you sure you want to Notification this user?</p>
        <div className="flex justify-end space-x-2">
          <button
            className="bg-gray-300 text-gray-800 p-2 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
