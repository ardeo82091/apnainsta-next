'use client';

import Sidebar from "../../sidebar";
import AllFriends from "../AllFriends";
import FriendRequest from "../FriendReq";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const FriendsAndRequest = () => {

    const darkMode = useSelector((state: RootState) => state.theme.darkMode);

    return (
        <div className={`flex h-screen overflow-hidden transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <Sidebar/>
            <div className="flex flex-1">
                
                {/* All Friends */}
                <div className="flex-1 overflow-y-auto">
                    <AllFriends/>
                </div>

                {/* Friend Request */}
                <div className={`w-[320px] border-l overflow-y-auto ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                    <FriendRequest/>
                </div>
            </div>
        </div>
    );
};

export default FriendsAndRequest;