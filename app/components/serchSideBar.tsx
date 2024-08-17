import { FC } from 'react';
import { FaTimes } from 'react-icons/fa';

interface SearchSlideProps {
    isOpen: boolean;
    onClose: () => void;
}

const SearchSlideBar: FC<SearchSlideProps> = ({ isOpen, onClose }) => {
    return (
    isOpen && (
        <div className="h-screen bg-gray-800 w-80 flex flex-col justify-start fixed right-0 p-4 ">
            <div className="w-full flex justify-between items-center text-white text-lg mb-4">
                <span>Search</span>
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

export default SearchSlideBar;
