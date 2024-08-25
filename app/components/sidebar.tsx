'use client';

import { FC, useState } from 'react';
import { FaHome, FaUser, FaUserFriends, FaVideo, FaRocketchat, FaSignOutAlt, FaEye, FaCog, FaSearch, FaTimes } from 'react-icons/fa';
import { SidebarIcon } from '@/lib/hoc/SidebarIconProps';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LiveAndVibe from '@/public/images/positive-vibes1.png';
import ViewedBySlideBar from './viewedBySideBar';
import SearchSlideBar from './serchSideBar';

const Sidebar: FC = () => {
    const router = useRouter();
    const [isSearchSidebarOpen, setIsSearchSidebarOpen] = useState(false);
    const [isViewedByOpen, setIsViewedByOpen] = useState(false);

    const handlePages = (page: string) => {
        router.push(`/components/${page}`);
    };

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
            <div className="h-screen bg-gray-900 w-16 flex flex-col items-center justify-between fixed">
                <div className="mt-1">
                    <Image src={LiveAndVibe} alt="My Icon" className="w-16 h-16 mb-4" />
                </div>
                <div className="space-y-6 mb-12">
                    <SidebarIcon icon={FaHome} onClick={() => handlePages('dashboard')} />
                    <SidebarIcon icon={FaUser} onClick={() => handlePages('myprofile')} />
                    <SidebarIcon icon={FaUserFriends} onClick={() => handlePages('friendsandreq')} />
                    <SidebarIcon icon={FaSearch} onClick={() => rightSidebar('search')} />
                    <SidebarIcon icon={FaRocketchat} onClick={() => handlePages('chat')} />
                    <SidebarIcon icon={FaVideo} onClick={() => handlePages('viewfeed')} />
                    <SidebarIcon icon={FaEye} onClick={() => rightSidebar('viewedBy')} />
                    <SidebarIcon icon={FaCog} onClick={() => handlePages('settings')} />
                </div>
                <div className="mb-4">
                    <SidebarIcon icon={FaSignOutAlt} onClick={() => handlePages('login')} />
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
