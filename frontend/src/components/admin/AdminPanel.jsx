import { useState } from 'react';
import styles from '../../styles/Admin.module.css';
import { useData } from '../../store/DataContext.jsx';
import HomeEditor from './HomeEditor.jsx';
import AboutEditor from './AboutEditor.jsx';
import PortfolioEditor from './PortfolioEditor.jsx';
import CollectionsManager from './CollectionsManager.jsx';
import ProjectsManager from './ProjectsManager.jsx';

const AdminPanel = () => {
  const {
    data,
    updateHome,
    updateAbout,
    updatePortfolio,
    addCollection,
    updateCollection,
    removeCollection,
    addProject,
    updateProject,
    removeProject,
    logout,
    resetData,
    setPassword,
    createId
  } = useData();

  const [password, setPasswordInput] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    if (!password.trim()) return;
    setPassword(password.trim());
    setPasswordInput('');
    setPasswordSaved(true);
    window.setTimeout(() => setPasswordSaved(false), 2500);
  };

  const handleReset = () => {
    const confirmReset = window.confirm(
      'Reset all content back to the original sample data? This will clear any edits you have made.'
    );
    if (confirmReset) {
      resetData();
    }
  };

  return (
    <section className={styles.adminShell}>
      <header className={styles.headerRow}>
        <div>
          <p className={styles.inlineBadge}>Admin</p>
          <h1 className={styles.headerTitle}>Coral Atelier backend</h1>
        </div>
        <div className={styles.headerActions}>
          <button type="button" className={styles.secondaryButton} onClick={handleReset}>
            Reset to defaults
          </button>
          <button type="button" className={styles.primaryButton} onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      <HomeEditor home={data.home} onSave={updateHome} />

      <AboutEditor about={data.about} onSave={updateAbout} onCreateId={createId} />

      <PortfolioEditor portfolio={data.portfolio} onSave={updatePortfolio} />

      <CollectionsManager
        collections={data.collections}
        projects={data.projects}
        onAddCollection={() => addCollection({})}
        onUpdateCollection={updateCollection}
        onRemoveCollection={removeCollection}
      />

      <ProjectsManager
        projects={data.projects}
        collections={data.collections}
        onAddProject={addProject}
        onUpdateProject={updateProject}
        onRemoveProject={removeProject}
        onCreateId={createId}
      />

      <div className={styles.panelCard}>
        <h2 className={styles.panelTitle}>Account</h2>
        <p className={styles.panelDescription}>
          Update the admin password stored locally in your browser. Anyone with this password can access the backend on this
          device.
        </p>
        <form className={styles.fieldGrid} onSubmit={handlePasswordSubmit}>
          <div className={styles.fieldGroup}>
            <label htmlFor="admin-new-password">New password</label>
            <input
              id="admin-new-password"
              type="password"
              value={password}
              onChange={(event) => setPasswordInput(event.target.value)}
              placeholder="Choose a new password"
              required
            />
          </div>
          {passwordSaved ? <p className={styles.note}>Password updated. Remember to save it somewhere safe.</p> : null}
          <div className={styles.buttonRow}>
            <button type="submit" className={styles.secondaryButton}>
              Update password
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AdminPanel;
