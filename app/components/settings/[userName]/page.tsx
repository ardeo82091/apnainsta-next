'use client';

import Sidebar from '../../sidebar';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Setting from '../Setting';

const Settings = () => {

    const darkMode = useSelector((state: RootState) => state.theme.darkMode);

    return (
        <>
            <div className={`flex h-screen overflow-hidden transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
                <Sidebar />
                <div className="flex-1 transition-all duration-300 ">
                  <Setting />
                </div>
            </div>
        </>
    );
};

export default Settings;
