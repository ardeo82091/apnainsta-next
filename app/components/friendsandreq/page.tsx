'use client';

import Sidebar from "../sidebar";
import FriendRequest from "./FriendReq";


const FriendsAndRequest = () => {


    return (
        <div className="flex flex-col">
            <Sidebar />
                <div className="flex justify-end">
                    <FriendRequest />
                </div>
            </div>
    );
}

export default FriendsAndRequest;