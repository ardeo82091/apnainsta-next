'use client';

import Sidebar from '../../sidebar';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Setting from '../Setting';

const Settings = () => {

    const user = useSelector((state: RootState) => state.user);

    return (
        <>
            <div className="flex flex-col">
                <Sidebar />
                <div className="flex-1 ml-40 bg-white">
                  <Setting />
                </div>
            </div>
        </>
    );
};

export default Settings;
