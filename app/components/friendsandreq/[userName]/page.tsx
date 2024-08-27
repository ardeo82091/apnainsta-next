'use client';

import Sidebar from "../../sidebar";
import AllFriends from "../AllFriends";
import FriendRequest from "../FriendReq";

const FriendsAndRequest = () => {


    return (
        <div className="flex flex-col">
            <Sidebar />
            <div className="flex flex-row-reverse">
                <FriendRequest />
                <AllFriends />
            </div>
        </div>
    );
}

export default FriendsAndRequest;