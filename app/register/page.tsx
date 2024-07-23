'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/login.module.css';
import axios from 'axios';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setuserName] = useState('');
  const [dob, setdob] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/register', { email, password, userName, dob, firstName, lastName });

      if (response.data.success) {
        setSuccess('Registration successful');
        setError('');
        router.push('/login');
      } else {
        setError(response.data.message || 'Registration failed');
        setSuccess('');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setError('An unexpected error occurred');
      setSuccess('');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Register</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <label className={styles.label} htmlFor="email">Email</label>
          <input
            className={styles.input}
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        {success && <p className={styles.success}>{success}</p>}
        <button className={styles.button} type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
