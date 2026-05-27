'use client';

import { FC, useEffect, useRef, useState } from 'react';
import { FaHome, FaUser, FaUserFriends, FaVideo, FaRocketchat, FaSignOutAlt, FaEye, FaCog, FaSearch, FaPlus, FaEllipsisH, } from 'react-icons/fa';
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

    const user = useSelector((state: RootState) => state.user);

    const [isExpanded, setIsExpanded] = useState(false);
    const [isSearchSidebarOpen, setIsSearchSidebarOpen] = useState(false);
    const [isViewedByOpen, setIsViewedByOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [error, setError] = useState('');
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (typeof window !== 'undefined') {
                const userName = localStorage.getItem('user')?.replace(/^"|"$/g, '');

                if (userName) {
                    try {
                        const response = await axios.get(`/api/users/${userName}`);

                        if (response.data) {
                            dispatch(setUser(response.data));
                        } else {
                            setError('User not found');
                        }
                    } catch (err) {
                        setError('Failed to fetch user');
                    }
                }
            }
        };

        fetchUserData();
    }, [dispatch]);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme === 'dark') {
            setDarkMode(true);
        }
    }, []);

    const handlePages = (page: string) => {
        page !== 'login'
            ? router.push(`/components/${page}/${user.userName}`)
            : handleLogout();
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/components/login');
    };

    const rightSidebar = (sideBar: string) => {
        if (sideBar === 'search') {
            setIsSearchSidebarOpen(!isSearchSidebarOpen);
        } else if (sideBar === 'viewedBy') {
            setIsViewedByOpen(!isViewedByOpen);
        }
    };

    const toggleTheme = () => {
        setDarkMode((prev) => {
            const newTheme = !prev;

            localStorage.setItem(
                'theme',
                newTheme ? 'dark' : 'light'
            );

            return newTheme;
        });
    };

    return (
        <>
            <div
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => {
                    setIsExpanded(false);
                    setIsMoreOpen(false);
                }}
                className={`min-h-screen relative flex flex-col justify-between transition-all duration-300 ease-in-out border-r px-3
                    ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}
                    ${isExpanded ? 'w-60' : 'w-20'}`
                }
            >
                <div className="mt-4 flex items-center justify-center w-full">
                    <Image
                        src={LiveAndVibe}
                        alt="Logo"
                        className={`transition-all duration-300 object-contain ${isExpanded ? 'w-16 h-16' : 'w-10 h-10'}`}
                    />
                </div>

                <div className="space-y-3 w-full px-1">
                    <SidebarIcon
                        icon={FaHome}
                        label={isExpanded ? 'Home' : ''}
                        darkMode={darkMode}
                        onClick={() =>
                            handlePages('dashboard')
                        }
                    />

                    <SidebarIcon
                        icon={FaUserFriends}
                        label={isExpanded ? 'Friends' : ''}
                        darkMode={darkMode}
                        onClick={() =>
                            handlePages('friendsandreq')
                        }
                    />

                    <SidebarIcon
                        icon={FaSearch}
                        label={isExpanded ? 'Search' : ''}
                        darkMode={darkMode}
                        onClick={() =>
                            rightSidebar('search')
                        }
                    />

                    <SidebarIcon
                        icon={FaRocketchat}
                        label={isExpanded ? 'Chats' : ''}
                        darkMode={darkMode}
                        onClick={() => handlePages('chat')}
                    />

                    <SidebarIcon
                        icon={FaVideo}
                        label={isExpanded ? 'View Feed' : ''}
                        darkMode={darkMode}
                        onClick={() =>
                            handlePages('viewfeed')
                        }
                    />

                    <SidebarIcon
                        icon={FaEye}
                        label={isExpanded ? 'Viewed By' : ''}
                        darkMode={darkMode}
                        onClick={() =>
                            rightSidebar('viewedBy')
                        }
                    />

                    <SidebarIcon
                        icon={FaPlus}
                        label={isExpanded ? 'Create' : ''}
                        darkMode={darkMode}
                        onClick={() =>
                            handlePages('create')
                        }
                    />

                    <SidebarIcon
                        icon={FaUser}
                        label={isExpanded ? 'Profile' : ''}
                        darkMode={darkMode}
                        onClick={() =>
                            handlePages('myprofile')
                        }
                    />
                </div>

                <div className="mb-5 relative w-full">
                    <SidebarIcon
                        icon={FaEllipsisH}
                        label={isExpanded ? 'More' : ''}
                        darkMode={darkMode}
                        onClick={() =>
                            setIsMoreOpen(!isMoreOpen)
                        }
                    />

                    {isMoreOpen && isExpanded && (
                        <div className={`absolute bottom-16 left-0 w-full bg-gray-800 rounded-xl shadow-lg overflow-hidden border
                            ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-xl'}`}
                        >
                            <div className={`flex items-center justify-between px-4 py-3 ${darkMode ? 'text-white' : 'text-black'}`}>
                                <span className="flex items-center gap-3">
                                    🌙 Dark Mode
                                </span>

                                <button
                                    onClick={toggleTheme}
                                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${ darkMode ? 'bg-blue-500' : 'bg-gray-300' }`}
                                >
                                    <div
                                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300
                                            ${darkMode ? 'left-7' : 'left-1'}
                                        `}
                                    />
                                </button>
                            </div>

                            <button
                                onClick={() => {
                                    handlePages('settings');
                                    setIsMoreOpen(false);
                                }}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-3 transition
                                    ${
                                        darkMode
                                            ? 'text-blue-400 hover:bg-gray-700'
                                            : 'text-blue-600 hover:bg-gray-200'
                                    }
                                `}
                            >
                                <FaCog />
                                <span>Settings</span>
                            </button>

                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsMoreOpen(false);
                                }}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-3 transition
                                    ${
                                        darkMode
                                            ? 'text-red-400 hover:bg-gray-700'
                                            : 'text-red-500 hover:bg-gray-200'
                                    }
                                `}
                            >
                                <FaSignOutAlt />
                                <span>Logout</span>
                            </button>

                            
                        </div>
                        
                    )}
                </div>
            </div>

            {isSearchSidebarOpen && (
                <SearchSlideBar
                    isOpen={isSearchSidebarOpen}
                    onClose={() =>
                        rightSidebar('search')
                    }
                />
            )}

            {isViewedByOpen && (
                <ViewedBySlideBar
                    isOpen={isViewedByOpen}
                    onClose={() =>
                        rightSidebar('viewedBy')
                    }
                />
            )}
        </>
    );
};

export default Sidebar;