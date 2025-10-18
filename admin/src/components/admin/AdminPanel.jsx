import { useMemo, useState } from 'react';
import styles from '../../styles/Admin.module.css';
import { useData } from '../../store/DataContext.jsx';
import HomeEditor from './HomeEditor.jsx';
import AboutEditor from './AboutEditor.jsx';
import PortfolioEditor from './PortfolioEditor.jsx';
import ContactEditor from './ContactEditor.jsx';
import CollectionsManager from './CollectionsManager.jsx';
import ProjectsManager from './ProjectsManager.jsx';
import SiteSettings from './SiteSettings.jsx';
import FontManager from './FontManager.jsx';

const AdminPanel = () => {
  const {
    data,
    updateHome,
    updateAbout,
    updatePortfolio,
    updateContact,
    updateSettings,
    updateTypography,
    addCollection,
    updateCollection,
    removeCollection,
    addProject,
    updateProject,
    removeProject,
    addContactMethod,
    updateContactMethod,
    removeContactMethod,
    moveContactMethod,
    logout,
    resetData,
    createId,
    replaceData,
    publishToFrontend
  } = useData();

  const [importMessage, setImportMessage] = useState('');
  const [publishMessage, setPublishMessage] = useState('');
  const [reloadMessage, setReloadMessage] = useState('');
  const sections = useMemo(
    () => [
      {
        id: 'site-settings',
        label: 'Site settings',
        icon: '⚙︎',
        description: 'Configure global branding, metadata, and protection settings.'
      },
      {
        id: 'home',
        label: 'Home',
        icon: '🏠',
        description: 'Curate the hero copy and featured callouts on the landing page.'
      },
      {
        id: 'about',
        label: 'About',
        icon: '🖊',
        description: 'Edit biography, capabilities, and recognition details.'
      },
      {
        id: 'portfolio',
        label: 'Portfolio',
        icon: '🖼',
        description: 'Adjust gallery filters and supporting copy for the portfolio section.'
      },
      {
        id: 'contact',
        label: 'Contact',
        icon: '✉︎',
        description: 'Manage contact methods, quick links, and their presentation order.'
      },
      {
        id: 'collections',
        label: 'Collections',
        icon: '🗂',
        description: 'Organise art collections and link them with featured projects.'
      },
      {
        id: 'projects',
        label: 'Projects',
        icon: '📁',
        description: 'Create and update individual projects, galleries, and metadata.'
      },
      {
        id: 'typography',
        label: 'Typography',
        icon: 'Aa',
        description: 'Apply curated fonts across sections using the typography manager.'
      },
      {
        id: 'publish',
        label: 'Publish',
        icon: '🚀',
        description: 'Publish the current dataset to the frontend or reload from disk.'
      },
      {
        id: 'content-data',
        label: 'Content data',
        icon: '💾',
        description: 'Back up or import your entire content dataset as JSON.'
      }
    ],
    []
  );
  const [activeSection, setActiveSection] = useState(sections[0].id);
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
    const requiredTop = ['home', 'about', 'portfolio', 'contact', 'collections', 'projects', 'settings'];
    for (const key of requiredTop) {
      if (!(key in obj)) return `Missing top-level key: ${key}`;
    }
    if (!Array.isArray(obj.collections)) return 'collections must be an array';
    if (!Array.isArray(obj.projects)) return 'projects must be an array';
    if (!Array.isArray(obj.contact?.entries)) return 'contact.entries must be an array';
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

  const activeSectionConfig = useMemo(
    () => sections.find((section) => section.id === activeSection) ?? sections[0],
    [activeSection, sections]
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'site-settings':
        return <SiteSettings settings={data.settings} onSave={updateSettings} />;
      case 'home':
        return <HomeEditor home={data.home} onSave={updateHome} />;
      case 'about':
        return <AboutEditor about={data.about} onSave={updateAbout} onCreateId={createId} />;
      case 'portfolio':
        return <PortfolioEditor portfolio={data.portfolio} onSave={updatePortfolio} />;
      case 'contact':
        return (
          <ContactEditor
            contact={data.contact}
            onSave={updateContact}
            onAddEntry={addContactMethod}
            onUpdateEntry={updateContactMethod}
            onRemoveEntry={removeContactMethod}
            onMoveEntry={moveContactMethod}
          />
        );
      case 'collections':
        return (
          <CollectionsManager
            collections={data.collections}
            projects={data.projects}
            onAddCollection={() => addCollection({})}
            onUpdateCollection={updateCollection}
            onRemoveCollection={removeCollection}
          />
        );
      case 'projects':
        return (
          <ProjectsManager
            projects={data.projects}
            collections={data.collections}
            onAddProject={addProject}
            onUpdateProject={updateProject}
            onRemoveProject={removeProject}
            onCreateId={createId}
          />
        );
      case 'typography':
        return <FontManager data={data} typography={data.typography} onApply={updateTypography} />;
      case 'publish':
        return (
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
        );
      case 'content-data':
        return (
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
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) handleImportJson(file);
                  event.currentTarget.value = '';
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
        );
      default:
        return null;
    }
  };

  return (
    <section className={styles.adminShell}>
      <header className={styles.headerRow}>
        <div className={styles.headerIntro}>
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

      <div className={styles.workspace}>
        <aside className={styles.sidebar} aria-label="Admin sections">
          <div className={styles.sidebarBrand}>
            <span className={styles.sidebarBrandLabel}>Studio dashboard</span>
            <p className={styles.sidebarBrandSub}>Navigate through each content area.</p>
          </div>
          <nav className={styles.sidebarNav}>
            {sections.map((section) => {
              const isActive = section.id === activeSectionConfig.id;
              const className = isActive
                ? `${styles.sidebarNavButton} ${styles.sidebarNavButtonActive}`
                : styles.sidebarNavButton;
              return (
                <button
                  key={section.id}
                  type="button"
                  className={className}
                  onClick={() => setActiveSection(section.id)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className={styles.sidebarNavIcon} aria-hidden="true">
                    {section.icon}
                  </span>
                  <span className={styles.sidebarNavLabel}>{section.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className={styles.contentArea}>
          <div className={styles.contentHeader}>
            <p className={styles.inlineBadge}>{activeSectionConfig.label}</p>
            {activeSectionConfig.description ? (
              <p className={styles.contentDescription}>{activeSectionConfig.description}</p>
            ) : null}
          </div>
          <div className={styles.contentBody}>{renderActiveSection()}</div>
        </main>
      </div>
    </section>
  );
};

export default AdminPanel;
