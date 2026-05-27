'use client';

import Sidebar from "../../sidebar";
import AllFriends from "../AllFriends";
import FriendRequest from "../FriendReq";

// const FriendsAndRequest = () => {


//     return (
//         <div className="flex flex-col">
//             <Sidebar />
//             <div className="flex flex-row-reverse">
//                 <FriendRequest />
//                 <AllFriends />
//             </div>
//         </div>
//     );
// }
const FriendsAndRequest = () => {
    return (
        <div className="flex h-screen bg-gray-50">
            
            {/* Sidebar */}
            <Sidebar />
            <div className="flex flex-1">
                
                {/* All Friends */}
                <div className="flex-1 overflow-y-auto">
                    <AllFriends />
                </div>

                {/* Friend Request */}
                <div className="w-[320px] border-l border-gray-200 bg-white overflow-y-auto">
                    <FriendRequest />
                </div>
            </div>
        </div>
    );
};

export default FriendsAndRequest;