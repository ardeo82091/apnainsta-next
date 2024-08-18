import React from 'react';

interface ChatTabProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
    onClose: () => void;
    className?: string;
}

const ChatTab: React.FC<ChatTabProps> = ({ label, isActive, onClick, onClose }) => {
    return (
        <div
            className={`flex items-center p-2 cursor-pointer ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded ml-2`}
            onClick={onClick}
        >
            <span className="flex-1">{label}</span>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                className="ml-2 text-red-500"
            >
                &times;
            </button>
        </div>
    );
}

export default ChatTab;
