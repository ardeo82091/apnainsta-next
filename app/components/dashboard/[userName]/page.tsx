'use client';

import { useParams } from 'next/navigation';
import Sidebar from '../../sidebar';
import Header from '../../header';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const DashboardPage = () => {
    // const { userName } = useParams();
    // const [user, setUser] = useState(null);
    // const [error, setError] = useState('');

    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         const response = await axios.get(`/api/users/${userName}`);
    //         if (response.data) {
    //             setUser(response.data);
    //         } else {
    //             setError("User not found");
    //         }
    //     };

    //     if (userName) {
    //         fetchUserData();
    //     }
    // }, [userName]);

    const user = useSelector((state: RootState) => state.user);

    return (
        <>
            <div className="flex flex-col">
                <Sidebar />
                <div className="flex flex-row-reverse">
                    <Header />
                    <div className="h-screen p-4">
                            <h1>`Welcome to the Dashboard {user.fullName}`</h1>
                            <p>You are logged in!</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;
