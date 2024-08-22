'use client';

import { useParams, useRouter } from 'next/navigation';
import styles from '@/styles/dashboard.module.css';
import Sidebar from '../../sidebar';
import Header from '../../header';
import { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardPage = () => {
    const router = useRouter();
    const { userName } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log(userName);
                const response = await axios.get(`/api/users/${userName}`);
                console.log(response.data);
                setUser(response.data);
            } catch (error) {
                console.error(error);
                setError("User not found");
            }
        };

        if (userName) {
            fetchUserData();
        }
    }, [userName]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleLogout = () => {
        router.push('/login');
    };

    return (
        <>
            <div className="flex flex-col">
                <Sidebar />
                <div className="flex flex-row-reverse">
                    <Header user= {user}/>
                    <div className="h-screen p-4">
                            <h1>Welcome to the Dashboard</h1>
                            <p>You are logged in!</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;
