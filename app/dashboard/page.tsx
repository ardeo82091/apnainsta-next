'use client';

import { useRouter } from 'next/navigation';
import styles from '../../styles/dashboard.module.css';

const DashboardPage = () => {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div className={styles.container}>
      <h1>Welcome to the Dashboard</h1>
      <p>You are logged in!</p>
      <button className={styles.button} onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DashboardPage;
