
import { RootState } from '@/redux/store';
import { FC, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import UserInSearch from '../../lib/users.json'

interface SearchSlideProps {
    isOpen: boolean;
    onClose: () => void;
}

const SearchSlideBar: FC<SearchSlideProps> = ({ isOpen, onClose }) => {
    const [searchUser, setSearchUser] = useState("");

    const handleSearch = () =>{  
        const result = UserInSearch.filter(u =>
            u.userName.toLowerCase().includes(searchUser.toLowerCase())
        );
        console.log(result) ;
    }

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
                value={searchUser}
                onChange={(e) => {
                     setSearchUser(e.target.value);
                    e.target.value.length > 3 ? handleSearch() : '';
                }}
            />
            <button
                onClick={handleSearch}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            > Search </button>
        </div>
    )
  );
};

export default SearchSlideBar;
