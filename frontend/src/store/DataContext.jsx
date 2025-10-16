import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultData, getDefaultData } from '../data/defaultData.js';
import { createId } from '../utils/id.js';

const STORAGE_KEY = 'coral-portfolio-data';
const AUTH_KEY = 'coral-portfolio-admin';

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
      // If content version changed (from a publish), ignore old local edits
      const storedVersion = parsed?.settings?.__contentVersion;
      const defaultVersion = defaultData?.settings?.__contentVersion;
      if (defaultVersion && storedVersion !== defaultVersion) {
        return getDefaultData();
      }
      return { ...defaultData, ...parsed };
    }
  } catch (error) {
    console.warn('Unable to read stored portfolio data', error);
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
      console.warn('Unable to persist portfolio data', error);
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

  const removeProject = (projectId) =>
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((project) => project.id !== projectId)
    }));

  const login = (password) => {
    if (password === data.settings.adminPassword) {
      setIsAuthenticated(true);
      return { success: true };
    }

    return { success: false, message: 'Incorrect password. Please try again.' };
  };

  const logout = () => setIsAuthenticated(false);

  const setPassword = (newPassword) =>
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        adminPassword: newPassword
      }
    }));

  const resetData = () => setData(getDefaultData());

  // Replace all content with a provided dataset (trusted from import)
  const replaceData = (next) => {
    setData(() => ({ ...getDefaultData(), ...next }));
  };

  const value = useMemo(
    () => ({
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
      login,
      logout,
      isAuthenticated,
      setPassword,
      resetData,
      replaceData,
      createId,
      clone
    }),
    [
      data,
      isAuthenticated
    ]
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
