
'use client';

import { useRouter } from 'next/navigation';
import styles from '@/styles/dashboard.module.css';
import Sidebar from '../sidebar';
import Header from '../header';

const DashboardPage = () => {
    const router = useRouter();

    const handleLogout = () => {
        router.push('/login');
    };

    return (
        <div className="flex flex-col">
            <Sidebar />
            <div className="flex flex-row-reverse">
                <Header />
                <div className="h-screen p-4">
                    <div className={styles.container}>
                        <h1>Welcome to the Dashboard</h1>
                        <p>You are logged in!</p>
                        <button className={styles.button} onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>
            </div>
    );
};

export default DashboardPage;
