'use client'

import Sidebar from '../sidebar';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ChatProfileBar from '../chat/ChatProfileBar';

const MyProfile = () => {

    const user = useSelector((state: RootState) => state.user);

    return (
        <div className="flex flex-col">
            <Sidebar />
            <div className="flex flex-row-reverse">
                <ChatProfileBar
                    userName={user.userName}
                    isOpen={true}
                />

            </div>
        </div>
    );
};

export default MyProfile;
