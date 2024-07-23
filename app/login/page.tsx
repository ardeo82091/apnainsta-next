'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/login.module.css';
import axios from 'axios';

const LoginPage = () => {
  const [emailorUserNAme, setEmailorUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post('/api/login', { emailorUserNAme, password });

      if (response.data.success) {
        router.push('/dashboard');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <label className={styles.label} htmlFor="email">Email</label>
          <input
            className={styles.input}
            type="text"
            id="emailorUserNAme"
            value={emailorUserNAme}
            onChange={(e) => setEmailorUserName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={styles.label} htmlFor="password">Password</label>
          <input
            className={styles.input}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.button} type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
