import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultData, getDefaultData } from '../data/defaultData.js';
import { createId } from '../utils/id.js';

const STORAGE_KEY = 'coral-portfolio-admin-data';
const AUTH_KEY = 'coral-portfolio-admin-auth';

const DataContext = createContext(null);

const clone = (value) => JSON.parse(JSON.stringify(value));

const loadStoredData = () => {
  if (typeof window === 'undefined') {
    return getDefaultData();
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultData, ...parsed };
    }
  } catch (error) {
    console.warn('Unable to read stored admin data', error);
  }

  return getDefaultData();
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(loadStoredData);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(AUTH_KEY) === 'true';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Unable to persist admin data', error);
    }
  }, [data]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isAuthenticated) {
      window.localStorage.setItem(AUTH_KEY, 'true');
    } else {
      window.localStorage.removeItem(AUTH_KEY);
    }
  }, [isAuthenticated]);

  // Helper for calling the local API with auth header
  const apiFetch = async (url, options = {}) => {
    const headers = {
      ...(options.headers || {}),
      'x-admin-password': import.meta.env.VITE_ADMIN_PASSWORD || ''
    };
    const res = await fetch(url, { ...options, headers });
    return res;
  };

  const updateTypography = (updates) =>
    setData((prev) => ({
      ...prev,
      typography: {
        ...(prev.typography || {}),
        ...updates
      }
    }));

  const updateSettings = (updates) =>
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...updates
      }
    }));

  const updateHome = (updates) =>
    setData((prev) => ({
      ...prev,
      home: {
        ...prev.home,
        ...updates
      }
    }));

  const updateAbout = (updates) =>
    setData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        ...updates
      }
    }));

  const updatePortfolio = (updates) =>
    setData((prev) => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        ...updates
      }
    }));

  const updateContact = (updates) =>
    setData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        ...updates
      }
    }));

  const addContactMethod = (entry = {}) => {
    const newEntry = {
      id: createId('contact'),
      label: '',
      value: '',
      displayValue: '',
      note: '',
      ...entry
    };

    setData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        entries: [...(prev.contact?.entries || []), newEntry]
      }
    }));

    return newEntry.id;
  };

  const updateContactMethod = (entryId, updates) =>
    setData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        entries: (prev.contact?.entries || []).map((entry) =>
          entry.id === entryId
            ? {
                ...entry,
                ...updates
              }
            : entry
        )
      }
    }));

  const removeContactMethod = (entryId) =>
    setData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        entries: (prev.contact?.entries || []).filter((entry) => entry.id !== entryId)
      }
    }));

  const moveContactMethod = (entryId, direction) => {
    const delta = direction === 'up' ? -1 : 1;
    setData((prev) => {
      const entries = [...(prev.contact?.entries || [])];
      const currentIndex = entries.findIndex((entry) => entry.id === entryId);
      if (currentIndex < 0) return prev;
      const nextIndex = currentIndex + delta;
      if (nextIndex < 0 || nextIndex >= entries.length) return prev;
      [entries[currentIndex], entries[nextIndex]] = [entries[nextIndex], entries[currentIndex]];
      return {
        ...prev,
        contact: {
          ...prev.contact,
          entries
        }
      };
    });
  };

  const addCollection = (collection) => {
    const newCollection = {
      id: createId('collection'),
      name: 'New Collection',
      description: '',
      mood: '',
      heroImage: '',
      ...collection
    };

    setData((prev) => ({
      ...prev,
      collections: [...prev.collections, newCollection]
    }));

    // Try to create a media folder for this collection (best-effort)
    apiFetch(`/api/media/collection/${newCollection.id}`, { method: 'POST' }).catch(() => {});

    return newCollection.id;
  };

  const updateCollection = (collectionId, updates) =>
    setData((prev) => ({
      ...prev,
      collections: prev.collections.map((collection) =>
        collection.id === collectionId
          ? {
              ...collection,
              ...updates
            }
          : collection
      )
    }));

  const removeCollection = (collectionId) =>
    setData((prev) => ({
      ...prev,
      collections: prev.collections.filter((collection) => collection.id !== collectionId),
      projects: prev.projects.map((project) =>
        project.collectionId === collectionId
          ? {
              ...project,
              collectionId: null
            }
          : project
      )
    }));

  useEffect(() => {
    // When a collection is removed, attempt to remove its media folder
    // This effect is a no-op by itself; removal is best handled inline when invoked.
  }, []);

  const removeCollectionMedia = (collectionId) => {
    apiFetch(`/api/media/collection/${collectionId}`, { method: 'DELETE' }).catch(() => {});
  };

  const addProject = (project) => {
    const newProject = {
      id: createId('project'),
      title: 'Untitled project',
      tagline: '',
      collectionId: null,
      coverImage: '',
      description: '',
      gallery: [],
      metadata: [],
      ...project
    };

    setData((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects]
    }));

    // Create a media folder for the project (best-effort)
    apiFetch(`/api/media/project/${newProject.id}`, { method: 'POST' }).catch(() => {});

    return newProject.id;
  };

  const updateProject = (projectId, updates) =>
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              ...updates
            }
          : project
      )
    }));

  const removeProject = (projectId) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((project) => project.id !== projectId)
    }));
    // Remove the media folder for this project (best-effort)
    apiFetch(`/api/media/project/${projectId}`, { method: 'DELETE' }).catch(() => {});
  };

  const login = (password) => {
    const expected = import.meta.env.VITE_ADMIN_PASSWORD || '';
    if (expected && password === expected) {
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, message: 'Incorrect password. Please try again.' };
  };

  const logout = () => setIsAuthenticated(false);

  const resetData = () => setData(getDefaultData());

  const replaceData = (next) => {
    setData(() => ({ ...getDefaultData(), ...next }));
  };

  // On first load (no local edits), try to hydrate from the frontend dataset via local API
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return; // respect existing local edits
    (async () => {
      try {
        const res = await fetch('/api/current');
        if (!res.ok) return; // no-op on failure
        const payload = await res.json();
        if (payload && payload.data) {
          replaceData(payload.data);
        }
      } catch (_) {}
    })();
  }, []);

  // Ensure base images folders exist once per session
  useEffect(() => {
    apiFetch('/api/media/init', { method: 'POST' }).catch(() => {});
  }, []);

  const publishToFrontend = async () => {
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': import.meta.env.VITE_ADMIN_PASSWORD || ''
        },
        body: JSON.stringify({ data })
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to publish');
      }
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const commitAndSync = async ({ branchName, commitMessage }) => {
    try {
      const res = await apiFetch('/api/git/commit-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ branchName, commitMessage })
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        return {
          success: false,
          ...(payload && typeof payload === 'object' ? payload : {}),
          status: res.status
        };
      }
      return { success: true, ...(payload && typeof payload === 'object' ? payload : {}) };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = useMemo(
    () => ({
      data,
      updateTypography,
      updateSettings,
      updateHome,
      updateAbout,
      updateContact,
      updatePortfolio,
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
      login,
      logout,
      isAuthenticated,
      resetData,
      replaceData,
      createId,
      clone,
      publishToFrontend,
      commitAndSync
    }),
    [data, isAuthenticated]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

DataProvider.propTypes = {
  children: PropTypes.node
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
