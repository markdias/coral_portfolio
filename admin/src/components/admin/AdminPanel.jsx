import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

const formatPath = (segments) =>
  segments.reduce((acc, segment) => {
    if (segment === undefined || segment === null || segment === '') return acc;
    const stringSegment = typeof segment === 'string' ? segment : String(segment);
    if (/^\d+$/.test(stringSegment)) {
      return acc ? `${acc}[${stringSegment}]` : `[${stringSegment}]`;
    }
    if (stringSegment.startsWith('[')) {
      return `${acc || ''}${stringSegment}`;
    }
    return acc ? `${acc}.${stringSegment}` : stringSegment;
  }, '');

const labelForPath = (segments, fallback = 'Entire section') => {
  const path = formatPath(segments);
  return path || fallback;
};

const collectFieldChanges = (initialValue, currentValue, path = []) => {
  if (typeof initialValue === 'undefined') {
    return [`${labelForPath(path)} (added)`];
  }
  if (typeof currentValue === 'undefined') {
    return [`${labelForPath(path)} (removed)`];
  }

  const initialIsArray = Array.isArray(initialValue);
  const currentIsArray = Array.isArray(currentValue);
  if (initialIsArray || currentIsArray) {
    if (!initialIsArray || !currentIsArray) {
      return [`${labelForPath(path)} (type changed)`];
    }
    const differences = [];
    if (initialValue.length !== currentValue.length) {
      differences.push(`${labelForPath(path)} (length changed)`);
    }
    const maxLength = Math.max(initialValue.length, currentValue.length);
    for (let index = 0; index < maxLength; index += 1) {
      if (index >= initialValue.length) {
        differences.push(`${labelForPath([...path, index], 'Item')} (added)`);
      } else if (index >= currentValue.length) {
        differences.push(`${labelForPath([...path, index], 'Item')} (removed)`);
      } else {
        differences.push(
          ...collectFieldChanges(initialValue[index], currentValue[index], [...path, index])
        );
      }
    }
    return Array.from(new Set(differences));
  }

  const initialIsObject = initialValue && typeof initialValue === 'object';
  const currentIsObject = currentValue && typeof currentValue === 'object';

  if (!initialIsObject || !currentIsObject) {
    if (!Object.is(initialValue, currentValue)) {
      return [labelForPath(path)];
    }
    return [];
  }

  const differences = [];
  const keys = new Set([
    ...Object.keys(initialValue ?? {}),
    ...Object.keys(currentValue ?? {})
  ]);
  keys.forEach((key) => {
    if (!(key in (initialValue ?? {}))) {
      differences.push(`${labelForPath([...path, key])} (added)`);
    } else if (!(key in (currentValue ?? {}))) {
      differences.push(`${labelForPath([...path, key])} (removed)`);
    } else {
      differences.push(
        ...collectFieldChanges(initialValue[key], currentValue[key], [...path, key])
      );
    }
  });

  return Array.from(new Set(differences));
};

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
    publishToFrontend,
    clone,
    commitAndSync,
    listGitBranches
  } = useData();

  const [importMessage, setImportMessage] = useState('');
  const [publishMessage, setPublishMessage] = useState('');
  const [reloadMessage, setReloadMessage] = useState('');
  const [changedSections, setChangedSections] = useState([]);
  const [gitBranchName, setGitBranchName] = useState('');
  const [gitBranches, setGitBranches] = useState([]);
  const [gitBranchStatus, setGitBranchStatus] = useState('');
  const [isFetchingBranches, setIsFetchingBranches] = useState(false);
  const [gitCommitMessage, setGitCommitMessage] = useState('');
  const [hasManualCommitMessage, setHasManualCommitMessage] = useState(false);
  const [gitResult, setGitResult] = useState(null);
  const [isGitSubmitting, setIsGitSubmitting] = useState(false);
  const sections = useMemo(
    () => [
      {
        id: 'site-settings',
        label: 'Site settings',
        icon: '⚙︎',
        description: 'Configure global branding, metadata, and protection settings.',
        trackKey: 'settings'
      },
      {
        id: 'home',
        label: 'Home',
        icon: '🏠',
        description: 'Curate the hero copy and featured callouts on the landing page.',
        trackKey: 'home'
      },
      {
        id: 'about',
        label: 'About',
        icon: '🖊',
        description: 'Edit biography, capabilities, and recognition details.',
        trackKey: 'about'
      },
      {
        id: 'portfolio',
        label: 'Portfolio',
        icon: '🖼',
        description: 'Adjust gallery filters and supporting copy for the portfolio section.',
        trackKey: 'portfolio'
      },
      {
        id: 'contact',
        label: 'Contact',
        icon: '✉︎',
        description: 'Manage contact methods, quick links, and their presentation order.',
        trackKey: 'contact'
      },
      {
        id: 'collections',
        label: 'Collections',
        icon: '🗂',
        description: 'Organise art collections and link them with featured projects.',
        trackKey: 'collections'
      },
      {
        id: 'projects',
        label: 'Projects',
        icon: '📁',
        description: 'Create and update individual projects, galleries, and metadata.',
        trackKey: 'projects'
      },
      {
        id: 'typography',
        label: 'Typography',
        icon: 'Aa',
        description: 'Apply curated fonts across sections using the typography manager.',
        trackKey: 'typography'
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
      },
      {
        id: 'change-log',
        label: 'Change tracker',
        icon: '📝',
        description: 'Review which sections differ from their initial values during this session.'
      }
    ],
    []
  );
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const fileInputId = 'content-import-file';
  const initialDataRef = useRef(null);

  if (!initialDataRef.current) {
    initialDataRef.current = clone(data);
  }

  const trackedSections = useMemo(
    () => sections.filter((section) => section.trackKey),
    [sections]
  );

  useEffect(() => {
    if (!initialDataRef.current) return;

    const nextChanged = trackedSections
      .filter((section) => {
        const key = section.trackKey;
        const initialValue = initialDataRef.current?.[key];
        const currentValue = data?.[key];
        return JSON.stringify(initialValue) !== JSON.stringify(currentValue);
      })
      .map((section) => section.id);

    setChangedSections((prev) => {
      if (prev.length === nextChanged.length && prev.every((id, index) => id === nextChanged[index])) {
        return prev;
      }
      return nextChanged;
    });
  }, [data, trackedSections]);

  const changedSectionDetails = useMemo(() => {
    if (!initialDataRef.current) return [];
    return sections
      .filter((section) => changedSections.includes(section.id))
      .map((section) => {
        const trackKey = section.trackKey;
        const initialValue = trackKey ? initialDataRef.current?.[trackKey] : undefined;
        const currentValue = trackKey ? data?.[trackKey] : undefined;
        const fields = trackKey
          ? collectFieldChanges(initialValue, currentValue, [])
          : [];
        return {
          ...section,
          fields
        };
      });
  }, [changedSections, data, sections]);

  const autoCommitSummary = useMemo(() => {
    if (!changedSectionDetails.length) return '';
    const parts = changedSectionDetails.map((section) => {
      if (!section.fields?.length) return section.label;
      const maxFields = 3;
      const fieldPreview = section.fields.slice(0, maxFields).join(', ');
      const overflow = section.fields.length > maxFields ? ', …' : '';
      return `${section.label} (${fieldPreview}${overflow})`;
    });
    const summary = `Update ${parts.join('; ')}`;
    if (summary.length <= 200) return summary;
    return `${summary.slice(0, 197)}…`;
  }, [changedSectionDetails]);

  useEffect(() => {
    if (!hasManualCommitMessage) {
      setGitCommitMessage(autoCommitSummary);
    }
  }, [autoCommitSummary, hasManualCommitMessage]);

  useEffect(() => {
    if (hasManualCommitMessage && gitCommitMessage === autoCommitSummary) {
      setHasManualCommitMessage(false);
    }
  }, [autoCommitSummary, gitCommitMessage, hasManualCommitMessage]);

  const fetchGitBranches = useCallback(async () => {
    setGitBranchStatus('');
    setIsFetchingBranches(true);
    try {
      const result = await listGitBranches();
      if (result.success) {
        setGitBranches(result.branches || []);
        if (result.current) {
          setGitBranchName((prev) => prev || result.current);
        }
      } else {
        setGitBranchStatus(result.error || 'Unable to load Git branches.');
      }
    } catch (error) {
      setGitBranchStatus(error?.message || 'Unable to load Git branches.');
    } finally {
      setIsFetchingBranches(false);
    }
  }, [listGitBranches]);

  useEffect(() => {
    fetchGitBranches();
  }, [fetchGitBranches]);

  const handleGitCommit = async (event) => {
    event.preventDefault();
    setGitResult(null);

    const trimmedBranch = gitBranchName.trim();
    const trimmedMessage = gitCommitMessage.trim();
    if (!trimmedBranch || !trimmedMessage) {
      setGitResult({
        success: false,
        message: 'Both a branch name and commit message are required to sync with Git.'
      });
      return;
    }

    setIsGitSubmitting(true);
    const result = await commitAndSync({ branchName: trimmedBranch, commitMessage: trimmedMessage });
    if (result.success) {
      setGitResult({
        success: true,
        message: `Committed and pushed to ${result.branch || trimmedBranch}.`,
        steps: result.steps || []
      });
      setGitBranchName(trimmedBranch);
      setHasManualCommitMessage(false);
      setGitCommitMessage('');
      fetchGitBranches();
    } else {
      setGitBranchName(trimmedBranch);
      setGitResult({
        success: false,
        message: result.error || result.message || 'Git sync failed.',
        steps: result.steps || []
      });
    }
    setIsGitSubmitting(false);
  };

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
      case 'change-log': {
        return (
          <div className={styles.panelCard}>
            <h2 className={styles.panelTitle}>Change tracker</h2>
            <p className={styles.panelDescription}>
              Keep tabs on which editors now differ from the dataset that loaded with this session.
            </p>
            {changedSections.length === 0 ? (
              <p className={styles.note}>No edits detected since this page loaded.</p>
            ) : (
              <ul className={styles.changeList}>
                {changedSectionDetails.map((section) => (
                  <li key={section.id} className={styles.changeListItem}>
                    <div className={styles.changeListHeader}>
                      <span className={styles.changeListIcon} aria-hidden="true">
                        {section.icon}
                      </span>
                      <span className={styles.changeListLabel}>{section.label}</span>
                    </div>
                    {section.fields.length > 0 ? (
                      <ul className={styles.changeFieldList}>
                        {section.fields.map((field) => (
                          <li key={field} className={styles.changeFieldItem}>
                            <span className={styles.changeFieldTag}>{field}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
            <div className={styles.gitSyncCard}>
              <h3 className={styles.gitSyncTitle}>Commit and sync with Git</h3>
              <p className={styles.gitSyncDescription}>
                Create or update a branch, commit your admin edits, and push them to the remote repository.
              </p>
              <form className={styles.gitSyncForm} onSubmit={handleGitCommit}>
                <label className={styles.gitSyncField}>
                  <span className={styles.gitSyncLabel}>Branch name</span>
                  <input
                    type="text"
                    className={styles.gitSyncInput}
                    value={gitBranchName}
                    onChange={(event) => setGitBranchName(event.target.value)}
                    placeholder="feature/change-tracker"
                    autoComplete="off"
                    list="git-branch-options"
                  />
                  <datalist id="git-branch-options">
                    {gitBranches.map((branch) => (
                      <option key={branch} value={branch} />
                    ))}
                  </datalist>
                  {isFetchingBranches ? (
                    <p className={styles.gitSyncMetaInfo}>Loading branches…</p>
                  ) : null}
                  {gitBranchStatus ? (
                    <p className={styles.gitSyncMetaError} role="alert">
                      {gitBranchStatus}{' '}
                      <button type="button" className={styles.gitSyncMetaRetry} onClick={fetchGitBranches}>
                        Retry
                      </button>
                    </p>
                  ) : null}
                </label>
                <label className={styles.gitSyncField}>
                  <span className={styles.gitSyncLabel}>Commit message</span>
                  <textarea
                    className={styles.gitSyncTextarea}
                    rows={3}
                    value={gitCommitMessage}
                    onChange={(event) => {
                      const { value } = event.target;
                      setGitCommitMessage(value);
                      setHasManualCommitMessage(value !== autoCommitSummary);
                    }}
                    placeholder="Summarise the edits you made"
                  />
                </label>
                {autoCommitSummary && hasManualCommitMessage ? (
                  <p className={styles.gitSyncMetaNote}>
                    Suggested summary: <span>{autoCommitSummary}</span>
                  </p>
                ) : null}
                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={isGitSubmitting}
                >
                  {isGitSubmitting ? 'Syncing…' : 'Commit & push changes'}
                </button>
              </form>
              {gitResult ? (
                <div
                  className={
                    gitResult.success ? styles.gitSyncSuccessMessage : styles.gitSyncErrorMessage
                  }
                >
                  <p className={styles.gitSyncStatus}>{gitResult.message}</p>
                  {Array.isArray(gitResult.steps) && gitResult.steps.length > 0 ? (
                    <details className={styles.gitSyncDetails}>
                      <summary className={styles.gitSyncSummary}>View git command log</summary>
                      <ol className={styles.gitSyncStepList}>
                        {gitResult.steps.map((step, index) => (
                          <li key={`${step.command}-${index}`} className={styles.gitSyncStepItem}>
                            <p className={styles.gitSyncStepTitle}>{step.step || step.command}</p>
                            <code className={styles.gitSyncStepCommand}>{step.command}</code>
                            {step.stdout ? (
                              <pre className={styles.gitSyncOutput}>{step.stdout}</pre>
                            ) : null}
                            {step.stderr ? (
                              <pre className={styles.gitSyncOutputError}>{step.stderr}</pre>
                            ) : null}
                            {step.ok === false && step.message ? (
                              <p className={styles.gitSyncOutputError}>{step.message}</p>
                            ) : null}
                          </li>
                        ))}
                      </ol>
                    </details>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        );
      }
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
