import { useState } from 'react';
import { useData } from '../../store/DataContext.jsx';
import styles from '../../styles/Admin.module.css';

const AdminLogin = () => {
  const { login } = useData();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = login(password.trim());
    if (result.success) {
      setPassword('');
      setError('');
    } else if (result.message) {
      setError(result.message);
    }
  };

  return (
    <section className={styles.adminShell}>
      <div className={styles.panelCard}>
        <h1 className={styles.panelTitle}>Studio backend</h1>
        <p className={styles.panelDescription}>
          Enter the admin password to unlock editing tools. Updates stay local unless you publish to the frontend.
        </p>
        <form className={styles.fieldGrid} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label htmlFor="admin-password">Access password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
          </div>
          {error ? <p className={styles.note}>{error}</p> : null}
          <div className={styles.buttonRow}>
            <button type="submit" className={styles.primaryButton}>
              Unlock studio tools
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;

