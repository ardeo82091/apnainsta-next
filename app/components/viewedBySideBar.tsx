import { FC } from 'react';
import { FaTimes } from 'react-icons/fa';

interface LastViewedBy {
  isOpen: boolean;
  onClose: () => void;
}

const ViewedBySlideBar : FC<LastViewedBy> = ({ isOpen, onClose }) => {
  return (
    isOpen && (
        <div className="h-screen bg-gray-800 w-60 flex flex-col justify-start fixed right-0 p-4 ">
            <div className="w-full flex justify-between items-center text-white text-lg mb-4">
                <span>Last Viewed</span>
                <FaTimes className="cursor-pointer" onClick={onClose} />
            </div>
        </div>
        )
    );
};

export default ViewedBySlideBar;
