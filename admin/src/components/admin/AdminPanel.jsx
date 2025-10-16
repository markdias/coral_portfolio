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
    createId,
    replaceData,
    publishToFrontend
  } = useData();

  const [importMessage, setImportMessage] = useState('');
  const [publishMessage, setPublishMessage] = useState('');
  const [reloadMessage, setReloadMessage] = useState('');
  const fileInputId = 'content-import-file';

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const validateImported = (obj) => {
    if (!obj || typeof obj !== 'object') return 'Invalid file contents.';
    const requiredTop = ['home', 'about', 'portfolio', 'collections', 'projects', 'settings'];
    for (const key of requiredTop) {
      if (!(key in obj)) return `Missing top-level key: ${key}`;
    }
    if (!Array.isArray(obj.collections)) return 'collections must be an array';
    if (!Array.isArray(obj.projects)) return 'projects must be an array';
    return null;
  };

  const handleImportJson = async (file) => {
    setImportMessage('');
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const error = validateImported(parsed);
      if (error) {
        setImportMessage(error);
        return;
      }
      replaceData(parsed);
      setImportMessage('Imported content successfully.');
    } catch (err) {
      setImportMessage('Failed to import JSON.');
    }
  };

  const handlePublish = async () => {
    setPublishMessage('');
    const res = await publishToFrontend();
    if (res.success) {
      setPublishMessage('Published to frontend/src/data/defaultData.js');
    } else {
      setPublishMessage(res.message || 'Publish failed');
    }
  };

  const handleReloadFromFrontend = async () => {
    setReloadMessage('');
    try {
      const res = await fetch('/api/current');
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to load current frontend data');
      }
      const payload = await res.json();
      if (payload?.data) {
        replaceData(payload.data);
        setReloadMessage('Loaded current frontend dataset.');
      } else {
        setReloadMessage('Unexpected response from server.');
      }
    } catch (err) {
      setReloadMessage(err.message);
    }
  };

  return (
    <section className={styles.adminShell}>
      <header className={styles.headerRow}>
        <div>
          <p className={styles.inlineBadge}>Admin</p>
          <h1 className={styles.headerTitle}>Coral Dias backend</h1>
        </div>
        <div className={styles.headerActions}>
          <button type="button" className={styles.secondaryButton} onClick={handleExportJson}>
            <span className={styles.buttonIcon}>⬇︎</span> Export JSON
          </button>
          <button type="button" className={styles.secondaryButton} onClick={resetData}>
            <span className={styles.buttonIcon}>↺</span> Reset to defaults
          </button>
          <button type="button" className={styles.primaryButton} onClick={logout}>
            <span className={styles.buttonIcon}>⎋</span> Sign out
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
        <h2 className={styles.panelTitle}>Publish</h2>
        <p className={styles.panelDescription}>
          Write current content into <code>frontend/src/data/defaultData.js</code> on this machine.
        </p>
        {publishMessage ? <p className={styles.note}>{publishMessage}</p> : null}
        <div className={styles.buttonRow}>
          <button type="button" className={styles.primaryButton} onClick={handlePublish}>
            <span className={styles.buttonIcon}>⤴</span> Publish to frontend
          </button>
          <button type="button" className={styles.secondaryButton} onClick={handleReloadFromFrontend}>
            <span className={styles.buttonIcon}>↻</span> Reload from frontend
          </button>
        </div>
        {reloadMessage ? <p className={styles.note}>{reloadMessage}</p> : null}
      </div>

      <div className={styles.panelCard}>
        <h2 className={styles.panelTitle}>Content data</h2>
        <p className={styles.panelDescription}>Backup or import your content JSON.</p>
        {importMessage ? <p className={styles.note}>{importMessage}</p> : null}
        <div className={styles.buttonRow}>
          <input
            id={fileInputId}
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImportJson(f);
              e.currentTarget.value = '';
            }}
          />
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => document.getElementById(fileInputId)?.click()}
          >
            <span className={styles.buttonIcon}>⤴</span> Import JSON
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdminPanel;
