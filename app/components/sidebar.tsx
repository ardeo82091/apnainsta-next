'use client';

import { FC, useEffect, useState } from 'react';
import { FaHome, FaUser, FaUserFriends, FaVideo, FaRocketchat, FaSignOutAlt, FaEye, FaCog, FaSearch, FaTimes } from 'react-icons/fa';
import { SidebarIcon } from '@/lib/props/SidebarIconProps';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LiveAndVibe from '@/public/images/positive-vibes1.png';
import ViewedBySlideBar from './viewedBySideBar';
import SearchSlideBar from './serchSideBar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setUser } from '@/redux/userSlice';
import axios from 'axios';

const Sidebar: FC = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [isSearchSidebarOpen, setIsSearchSidebarOpen] = useState(false);
    const [isViewedByOpen, setIsViewedByOpen] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            if (typeof window !== 'undefined') {
                const userName= localStorage.getItem('user')?.replace(/^"|"$/g, '');
                console.log(userName);
                if (userName) {
                    const response = await axios.get(`/api/users/${userName}`);
                    if (response.data) {
                        dispatch(setUser(response.data))
                        setUser(response.data);
                    } else {
                        setError("User not found");
                    }
                }
            }
        }
        fetchUserData();
    }, []);

    const user = useSelector((state: RootState) => state.user);

    const handlePages = (page: string) => {
        page !== 'login' ?
        router.push(`/components/${page}/${user.userName}`) :
        handleLogout();
    };

    const handleLogout = () => {
        router.push(`/components/login`);
        localStorage.removeItem('user');
    }

    const rightSidebar = (sideBar : string) => {
        if(sideBar === 'search') {
            setIsSearchSidebarOpen(!isSearchSidebarOpen);
        }
        else if(sideBar === 'viewedBy') {
            setIsViewedByOpen(!isViewedByOpen);
        }
        
    };

    return (
        <>
            <div className="h-screen bg-gray-900 w-40 flex flex-col items-center justify-between fixed">
                <div className="mt-1">
                    <Image src={LiveAndVibe} alt="My Icon" className="w-16 h-16 mb-4" />
                </div>
                    <div className="space-y-6 mb-12">
                        <SidebarIcon icon={FaHome} label="Home" onClick={() => handlePages('dashboard')} />
                        <SidebarIcon icon={FaUser} label="Profile" onClick={() => handlePages('myprofile')} />
                        <SidebarIcon icon={FaUserFriends} label="Friends" onClick={() => handlePages('friendsandreq')} />
                        <SidebarIcon icon={FaSearch} label="Search" onClick={() => rightSidebar('search')} />
                        <SidebarIcon icon={FaRocketchat} label="Chat" onClick={() => handlePages('chat')} />
                        <SidebarIcon icon={FaVideo} label="View Feed" onClick={() => handlePages('viewfeed')} />
                        <SidebarIcon icon={FaEye} label="Viewed By" onClick={() => rightSidebar('viewedBy')} />
                        <SidebarIcon icon={FaCog} label="Settings" onClick={() => handlePages('settings')} />
                    </div>
                <div className="mb-4">
                    <SidebarIcon icon={FaSignOutAlt} label="Logout" onClick={() => handlePages('login')} />
                </div>
            </div>

            {isSearchSidebarOpen && (
                <SearchSlideBar
                isOpen={isSearchSidebarOpen}
                onClose={() => rightSidebar('search')}
                />
            )}

            {isViewedByOpen && (
                <ViewedBySlideBar
                isOpen={isViewedByOpen}
                onClose={() => rightSidebar('viewedBy')}
                />
            )}
        </>
    );
};

export default Sidebar;
