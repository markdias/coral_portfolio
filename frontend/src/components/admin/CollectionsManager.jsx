import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/Admin.module.css';

const CollectionEditor = ({ collection, projectCount, onSave, onRemove }) => {
  const [formState, setFormState] = useState(collection);

  useEffect(() => {
    setFormState(collection);
  }, [collection]);

  const handleChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(collection.id, {
      ...formState,
      name: formState.name.trim(),
      description: formState.description.trim(),
      mood: formState.mood.trim(),
      heroImage: formState.heroImage.trim()
    });
  };

  return (
    <form className={styles.collectionItem} onSubmit={handleSubmit}>
      <div className={styles.collectionHeader}>
        <h4>{collection.name || 'New collection'}</h4>
        <span className={styles.collectionMeta}>{projectCount} project{projectCount === 1 ? '' : 's'}</span>
      </div>
      <div className={styles.fieldGrid}>
        <div className={styles.fieldGroup}>
          <label htmlFor={`collection-name-${collection.id}`}>Name</label>
          <input
            id={`collection-name-${collection.id}`}
            value={formState.name}
            onChange={(event) => handleChange('name', event.target.value)}
            placeholder="Collection name"
            required
          />
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor={`collection-description-${collection.id}`}>Description</label>
          <textarea
            id={`collection-description-${collection.id}`}
            rows={3}
            value={formState.description}
            onChange={(event) => handleChange('description', event.target.value)}
            placeholder="Describe the collection focus"
          />
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor={`collection-mood-${collection.id}`}>Mood / Palette</label>
          <input
            id={`collection-mood-${collection.id}`}
            value={formState.mood}
            onChange={(event) => handleChange('mood', event.target.value)}
            placeholder="Color notes, textures, feelings"
          />
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor={`collection-hero-${collection.id}`}>Hero image URL</label>
          <input
            id={`collection-hero-${collection.id}`}
            value={formState.heroImage}
            onChange={(event) => handleChange('heroImage', event.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>
      <div className={styles.buttonRow}>
        <button type="submit" className={styles.secondaryButton}>
          Save collection
        </button>
        <button
          type="button"
          className={styles.dangerButton}
          onClick={() => onRemove(collection.id)}
        >
          Remove
        </button>
      </div>
    </form>
  );
};

CollectionEditor.propTypes = {
  collection: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
    mood: PropTypes.string,
    heroImage: PropTypes.string
  }).isRequired,
  projectCount: PropTypes.number.isRequired,
  onSave: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

const CollectionsManager = ({ collections, projects, onAddCollection, onUpdateCollection, onRemoveCollection }) => {
  const handleAdd = () => {
    const id = onAddCollection();
    window.requestAnimationFrame(() => {
      const element = document.getElementById(`collection-name-${id}`);
      if (element) {
        element.focus();
      }
    });
  };

  const getProjectCount = (collectionId) =>
    projects.filter((project) => project.collectionId === collectionId).length;

  const safeRemove = (collectionId) => {
    const confirmRemoval = window.confirm(
      'Remove this collection? Existing projects will stay in the portfolio but lose this grouping.'
    );
    if (confirmRemoval) {
      onRemoveCollection(collectionId);
    }
  };

  return (
    <div className={styles.panelCard}>
      <div className={styles.headerRow}>
        <h2 className={styles.panelTitle} style={{ marginBottom: 0 }}>
          Collections
        </h2>
        <button type="button" className={styles.secondaryButton} onClick={handleAdd}>
          Add collection
        </button>
      </div>
      <p className={styles.panelDescription}>
        Collections help group projects into cohesive galleries—perfect for campaigns, seasons, or limited editions.
      </p>
      <div className={styles.collectionGrid}>
        {collections.map((collection) => (
          <CollectionEditor
            key={collection.id}
            collection={collection}
            projectCount={getProjectCount(collection.id)}
            onSave={onUpdateCollection}
            onRemove={safeRemove}
          />
        ))}
        {collections.length === 0 ? <p className={styles.note}>No collections yet. Add your first to begin grouping work.</p> : null}
      </div>
    </div>
  );
};

CollectionsManager.propTypes = {
  collections: PropTypes.arrayOf(CollectionEditor.propTypes.collection).isRequired,
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      collectionId: PropTypes.string
    })
  ).isRequired,
  onAddCollection: PropTypes.func.isRequired,
  onUpdateCollection: PropTypes.func.isRequired,
  onRemoveCollection: PropTypes.func.isRequired
};

export default CollectionsManager;
