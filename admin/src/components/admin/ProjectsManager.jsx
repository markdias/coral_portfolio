import PropTypes from 'prop-types';
import styles from '../../styles/Admin.module.css';
import UploadButton from './UploadButton.jsx';
import PublishButton from './PublishButton.jsx';

const ProjectsManager = ({ projects, collections, onAddProject, onUpdateProject, onRemoveProject, onCreateId }) => {
  const addGalleryImage = (project) =>
    onUpdateProject(project.id, {
      gallery: [...project.gallery, { id: onCreateId('image'), src: '', alt: '' }]
    });

  const addMeta = (project) =>
    onUpdateProject(project.id, {
      metadata: [...project.metadata, { id: onCreateId('meta'), label: '', value: '' }]
    });

  return (
    <div className={styles.panelCard}>
      <div className={`${styles.buttonRow} ${styles.panelToolbar}`}>
        <PublishButton label="Publish projects" />
      </div>
      <h2 className={styles.panelTitle}>Projects</h2>
      <div className={styles.buttonRow}>
        <button type="button" className={styles.secondaryButton} onClick={() => onAddProject({})}>
          <span className={styles.buttonIcon}>➕</span> Add project
        </button>
      </div>
      {projects.map((p) => (
        <div key={p.id} className={styles.fieldGrid}>
          <div className={styles.fieldGroup}>
            <label>Title</label>
            <div className={styles.inlineFields}>
              <input type="text" value={p.title} onChange={(e) => onUpdateProject(p.id, { title: e.target.value })} />
              <button
                type="button"
                className={styles.iconButton}
                aria-label="Clear"
                onClick={() => onUpdateProject(p.id, { title: '' })}
              >
                ×
              </button>
            </div>
          </div>
          <div className={styles.fieldGroup}>
            <label>Tagline</label>
            <div className={styles.inlineFields}>
              <input type="text" value={p.tagline} onChange={(e) => onUpdateProject(p.id, { tagline: e.target.value })} />
              <button
                type="button"
                className={styles.iconButton}
                aria-label="Clear"
                onClick={() => onUpdateProject(p.id, { tagline: '' })}
              >
                ×
              </button>
            </div>
          </div>
          <div className={styles.fieldGroup}>
            <label>Collection</label>
            <select
              value={p.collectionId || ''}
              onChange={(e) => onUpdateProject(p.id, { collectionId: e.target.value || null })}
            >
              <option value="">Unassigned</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.fieldGroupFull}>
            <label>Cover image</label>
            <div className={styles.inlineFields}>
              <input
                type="text"
                value={p.coverImage}
                onChange={(e) => onUpdateProject(p.id, { coverImage: e.target.value })}
                placeholder="/images/projects/... or https://..."
              />
              <UploadButton
                label="Upload"
                scope="projects"
                parentId={p.id}
                onUploaded={(path) => onUpdateProject(p.id, { coverImage: path })}
              />
              <button
                type="button"
                className={styles.iconButton}
                aria-label="Clear"
                onClick={() => onUpdateProject(p.id, { coverImage: '' })}
              >
                ×
              </button>
            </div>
          </div>
          <div className={styles.fieldGroupFull}>
            <label>Description</label>
            <div className={styles.inlineFields}>
              <textarea rows={3} value={p.description} onChange={(e) => onUpdateProject(p.id, { description: e.target.value })} />
              <button
                type="button"
                className={styles.iconButton}
                aria-label="Clear"
                onClick={() => onUpdateProject(p.id, { description: '' })}
              >
                ×
              </button>
            </div>
          </div>

          <div className={styles.fieldGroupFull}>
            <label>Gallery</label>
            {p.gallery.map((img, i) => (
              <div key={img.id} className={styles.inlineFields}>
                <input
                  type="text"
                  placeholder={`Image ${i + 1} URL`}
                  value={img.src}
                  onChange={(e) =>
                    onUpdateProject(p.id, {
                      gallery: p.gallery.map((g) => (g.id === img.id ? { ...g, src: e.target.value } : g))
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Alt text"
                  value={img.alt}
                  onChange={(e) =>
                    onUpdateProject(p.id, {
                      gallery: p.gallery.map((g) => (g.id === img.id ? { ...g, alt: e.target.value } : g))
                    })
                  }
                />
                <UploadButton
                  label="Upload"
                  scope="projects"
                  parentId={p.id}
                  onUploaded={(path) =>
                    onUpdateProject(p.id, {
                      gallery: p.gallery.map((g) => (g.id === img.id ? { ...g, src: path } : g))
                    })
                  }
                />
                <button
                  type="button"
                  className={styles.iconButton}
                  aria-label="Remove"
                  onClick={() =>
                    onUpdateProject(p.id, {
                      gallery: p.gallery.filter((g) => g.id !== img.id)
                    })
                  }
                >
                  ×
                </button>
              </div>
            ))}
              <button
                type="button"
                className={styles.iconButtonSmall}
                aria-label="Add image"
                title="Add image"
                onClick={() => addGalleryImage(p)}
              >
                ➕
              </button>
          </div>

          <div className={styles.fieldGroupFull}>
            <label>Metadata</label>
            {p.metadata.map((m) => (
              <div key={m.id} className={styles.inlineFields}>
                <input
                  type="text"
                  placeholder="Label"
                  value={m.label}
                  onChange={(e) =>
                    onUpdateProject(p.id, {
                      metadata: p.metadata.map((mm) => (mm.id === m.id ? { ...mm, label: e.target.value } : mm))
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={m.value}
                  onChange={(e) =>
                    onUpdateProject(p.id, {
                      metadata: p.metadata.map((mm) => (mm.id === m.id ? { ...mm, value: e.target.value } : mm))
                    })
                  }
                />
                <button
                  type="button"
                  className={styles.iconButton}
                  aria-label="Remove"
                  onClick={() =>
                    onUpdateProject(p.id, {
                      metadata: p.metadata.filter((mm) => mm.id !== m.id)
                    })
                  }
                >
                  ×
                </button>
              </div>
            ))}
            <button type="button" className={styles.secondaryButton} onClick={() => addMeta(p)}>
              <span className={styles.buttonIcon}>➕</span> Add entry
            </button>
          </div>

          <div className={styles.buttonRow}>
            <button type="button" className={styles.dangerButton} onClick={() => onRemoveProject(p.id)}>
              <span className={styles.buttonIcon}>🗑</span> Remove project
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

ProjectsManager.propTypes = {
  projects: PropTypes.array.isRequired,
  collections: PropTypes.array.isRequired,
  onAddProject: PropTypes.func.isRequired,
  onUpdateProject: PropTypes.func.isRequired,
  onRemoveProject: PropTypes.func.isRequired,
  onCreateId: PropTypes.func.isRequired
};

export default ProjectsManager;
