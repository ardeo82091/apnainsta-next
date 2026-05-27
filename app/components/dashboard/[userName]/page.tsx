'use client';

import { useParams } from 'next/navigation';
import Sidebar from '../../sidebar';
import Header from '../../header';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import StoriesAndWork from '../storiesWork';

const DashboardPage = () => {
    const user = useSelector(
        (state: RootState) => state.user
    );

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            
            {/* Sidebar */}
            <Sidebar />

            <div className="flex flex-1">
                
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="bg-white rounded-2xl shadow-sm min-h-full">
                        <StoriesAndWork />
                    </div>
                </div>

                <div className="w-[320px] bg-white border-l border-gray-200 sticky top-0 h-screen">
                    <Header />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
