import PropTypes from 'prop-types';
import styles from '../../styles/Admin.module.css';
import UploadButton from './UploadButton.jsx';

import PublishButton from './PublishButton.jsx';

const CollectionsManager = ({ collections, projects, onAddCollection, onUpdateCollection, onRemoveCollection }) => (
  <div className={styles.panelCard}>
    <h2 className={styles.panelTitle}>Collections</h2>
    <div className={styles.buttonRow}>
      <PublishButton label="Publish collections" />
    </div>
    <div className={styles.buttonRow}>
      <button type="button" className={styles.secondaryButton} onClick={() => onAddCollection({})}>
        <span className={styles.buttonIcon}>➕</span> Add collection
      </button>
    </div>
    {collections.map((c) => (
      <div key={c.id} className={styles.fieldGrid}>
        <div className={styles.fieldGroup}>
          <label>Name</label>
          <div className={styles.inlineFields}>
            <input type="text" value={c.name} onChange={(e) => onUpdateCollection(c.id, { name: e.target.value })} />
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Clear"
              onClick={() => onUpdateCollection(c.id, { name: '' })}
            >
              ×
            </button>
          </div>
        </div>
        <div className={styles.fieldGroupFull}>
          <label>Description</label>
          <div className={styles.inlineFields}>
            <textarea
              rows={3}
              value={c.description}
              onChange={(e) => onUpdateCollection(c.id, { description: e.target.value })}
            />
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Clear"
              onClick={() => onUpdateCollection(c.id, { description: '' })}
            >
              ×
            </button>
          </div>
        </div>
        <div className={styles.fieldGroupFull}>
          <label>Mood</label>
          <div className={styles.inlineFields}>
            <input type="text" value={c.mood} onChange={(e) => onUpdateCollection(c.id, { mood: e.target.value })} />
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Clear"
              onClick={() => onUpdateCollection(c.id, { mood: '' })}
            >
              ×
            </button>
          </div>
        </div>
        <div className={styles.fieldGroupFull}>
          <label>Hero image</label>
          <div className={styles.inlineFields}>
            <input
              type="text"
              value={c.heroImage}
              onChange={(e) => onUpdateCollection(c.id, { heroImage: e.target.value })}
              placeholder="/images/collections/... or https://..."
            />
            <UploadButton
              label="Upload"
              scope="collections"
              parentId={c.id}
              onUploaded={(path) => onUpdateCollection(c.id, { heroImage: path })}
            />
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Clear"
              onClick={() => onUpdateCollection(c.id, { heroImage: '' })}
            >
              ×
            </button>
          </div>
        </div>
        <div className={styles.buttonRow}>
          <button type="button" className={styles.dangerButton} onClick={() => onRemoveCollection(c.id)}>
            <span className={styles.buttonIcon}>🗑</span> Remove
          </button>
        </div>
      </div>
    ))}
  </div>
);

CollectionsManager.propTypes = {
  collections: PropTypes.array.isRequired,
  projects: PropTypes.array,
  onAddCollection: PropTypes.func.isRequired,
  onUpdateCollection: PropTypes.func.isRequired,
  onRemoveCollection: PropTypes.func.isRequired
};

export default CollectionsManager;
