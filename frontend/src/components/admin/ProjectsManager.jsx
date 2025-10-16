import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/Admin.module.css';

const cloneProject = (project) => JSON.parse(JSON.stringify(project));

const ProjectsManager = ({
  projects,
  collections,
  onAddProject,
  onUpdateProject,
  onRemoveProject,
  onCreateId
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id ?? null);
  const [formState, setFormState] = useState(() =>
    projects[0]
      ? {
          ...cloneProject(projects[0]),
          gallery: projects[0].gallery ?? [],
          metadata: projects[0].metadata ?? []
        }
      : null
  );

  useEffect(() => {
    if (!projects.find((project) => project.id === selectedProjectId)) {
      setSelectedProjectId(projects[0]?.id ?? null);
    }
  }, [projects, selectedProjectId]);

  useEffect(() => {
    const nextProject = projects.find((project) => project.id === selectedProjectId);
    if (nextProject) {
      const cloned = cloneProject(nextProject);
      setFormState({
        ...cloned,
        gallery: cloned.gallery ?? [],
        metadata: cloned.metadata ?? []
      });
    } else {
      setFormState(null);
    }
  }, [projects, selectedProjectId]);

  const activeCollectionOptions = useMemo(
    () => [{ id: '', name: 'Unassigned' }, ...collections],
    [collections]
  );

  const handleFieldChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGalleryChange = (imageId, field, value) => {
    setFormState((prev) => ({
      ...prev,
      gallery: prev.gallery.map((image) =>
        image.id === imageId
          ? {
              ...image,
              [field]: value
            }
          : image
      )
    }));
  };

  const handleMetadataChange = (metaId, field, value) => {
    setFormState((prev) => ({
      ...prev,
      metadata: prev.metadata.map((item) =>
        item.id === metaId
          ? {
              ...item,
              [field]: value
            }
          : item
      )
    }));
  };

  const handleAddGalleryImage = () => {
    setFormState((prev) => ({
      ...prev,
      gallery: [
        ...prev.gallery,
        {
          id: onCreateId('image'),
          src: '',
          alt: ''
        }
      ]
    }));
  };

  const handleRemoveGalleryImage = (imageId) => {
    setFormState((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((image) => image.id !== imageId)
    }));
  };

  const handleAddMetadata = () => {
    setFormState((prev) => ({
      ...prev,
      metadata: [
        ...prev.metadata,
        {
          id: onCreateId('meta'),
          label: '',
          value: ''
        }
      ]
    }));
  };

  const handleRemoveMetadata = (metaId) => {
    setFormState((prev) => ({
      ...prev,
      metadata: prev.metadata.filter((item) => item.id !== metaId)
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    if (!formState) return;

    const sanitized = {
      ...formState,
      title: formState.title.trim(),
      tagline: formState.tagline.trim(),
      coverImage: formState.coverImage.trim(),
      description: formState.description.trim(),
      collectionId: formState.collectionId ? formState.collectionId : null,
      gallery: formState.gallery
        .map((image) => ({
          ...image,
          src: (image.src ?? '').trim(),
          alt: (image.alt ?? '').trim()
        }))
        .filter((image) => image.src),
      metadata: formState.metadata
        .map((item) => ({
          ...item,
          label: (item.label ?? '').trim(),
          value: (item.value ?? '').trim()
        }))
        .filter((item) => item.label && item.value)
    };

    onUpdateProject(formState.id, sanitized);
    setFormState(sanitized);
  };

  const handleAddProject = () => {
    const id = onAddProject({
      title: 'Untitled project',
      tagline: '',
      collectionId: collections[0]?.id ?? null,
      coverImage: '',
      description: '',
      gallery: [
        {
          id: onCreateId('image'),
          src: '',
          alt: ''
        }
      ],
      metadata: [
        {
          id: onCreateId('meta'),
          label: 'Year',
          value: new Date().getFullYear().toString()
        }
      ]
    });
    setSelectedProjectId(id);
  };

  const handleRemoveProject = (projectId) => {
    const confirmation = window.confirm('Remove this project from the portfolio?');
    if (confirmation) {
      onRemoveProject(projectId);
    }
  };

  return (
    <div className={styles.panelCard}>
      <div className={styles.headerRow}>
        <h2 className={styles.panelTitle} style={{ marginBottom: 0 }}>
          Projects
        </h2>
        <button type="button" className={styles.secondaryButton} onClick={handleAddProject}>
          Add project
        </button>
      </div>
      <p className={styles.panelDescription}>
        Manage individual projects including descriptions, metadata, and gallery imagery. Assign each project to a collection
        to keep the public portfolio organised.
      </p>
      <div className={styles.projectsLayout}>
        <div className={styles.projectList}>
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => setSelectedProjectId(project.id)}
              className={selectedProjectId === project.id ? 'active' : ''}
            >
              <strong>{project.title || 'Untitled project'}</strong>
              <br />
              <span style={{ fontSize: '0.8rem', color: '#55576b' }}>{project.tagline}</span>
            </button>
          ))}
          {projects.length === 0 ? <p className={styles.note}>No projects yet. Add one to begin.</p> : null}
        </div>
        {formState ? (
          <form className={styles.projectEditor} onSubmit={handleSave}>
            <div className={styles.buttonRow}>
              <button type="submit" className={styles.primaryButton}>
                Save project
              </button>
              <button
                type="button"
                className={styles.dangerButton}
                onClick={() => handleRemoveProject(formState.id)}
              >
                Delete project
              </button>
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="project-title">Title</label>
              <input
                id="project-title"
                value={formState.title}
                onChange={(event) => handleFieldChange('title', event.target.value)}
                placeholder="Project title"
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="project-tagline">Tagline</label>
              <input
                id="project-tagline"
                value={formState.tagline}
                onChange={(event) => handleFieldChange('tagline', event.target.value)}
                placeholder="Short descriptor"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="project-collection">Collection</label>
              <select
                id="project-collection"
                value={formState.collectionId ?? ''}
                onChange={(event) => handleFieldChange('collectionId', event.target.value)}
              >
                {activeCollectionOptions.map((option) => (
                  <option key={option.id || 'unassigned'} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="project-cover">Cover image URL</label>
              <input
                id="project-cover"
                value={formState.coverImage}
                onChange={(event) => handleFieldChange('coverImage', event.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="project-description">Description</label>
              <textarea
                id="project-description"
                rows={4}
                value={formState.description}
                onChange={(event) => handleFieldChange('description', event.target.value)}
                placeholder="Narrative about the project"
              />
            </div>

            <section className={styles.sectionGroup}>
              <div className={styles.buttonRow}>
                <h3 className={styles.panelTitle} style={{ marginBottom: 0, fontSize: '1.1rem' }}>
                  Metadata
                </h3>
                <button type="button" className={styles.secondaryButton} onClick={handleAddMetadata}>
                  Add metadata
                </button>
              </div>
              <div className={styles.metadataGrid}>
                {formState.metadata.map((item) => (
                  <div key={item.id} className={styles.metadataRow}>
                    <div className={styles.metadataRowFields}>
                      <div className={styles.fieldGroup}>
                        <label>Label</label>
                        <input
                          value={item.label}
                          onChange={(event) => handleMetadataChange(item.id, 'label', event.target.value)}
                          placeholder="Client"
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label>Value</label>
                        <input
                          value={item.value}
                          onChange={(event) => handleMetadataChange(item.id, 'value', event.target.value)}
                          placeholder="Client name"
                        />
                      </div>
                    </div>
                    <div className={styles.metadataRowActions}>
                      <button
                        type="button"
                        className={styles.dangerButton}
                        onClick={() => handleRemoveMetadata(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                {formState.metadata.length === 0 ? <p className={styles.note}>Add metadata to capture client, year, and techniques.</p> : null}
              </div>
            </section>

            <section className={styles.sectionGroup}>
              <div className={styles.buttonRow}>
                <h3 className={styles.panelTitle} style={{ marginBottom: 0, fontSize: '1.1rem' }}>
                  Gallery images
                </h3>
                <button type="button" className={styles.secondaryButton} onClick={handleAddGalleryImage}>
                  Add image
                </button>
              </div>
              <div className={styles.galleryGrid}>
                {formState.gallery.map((image) => (
                  <div key={image.id} className={styles.galleryRow}>
                    <div className={styles.galleryRowFields}>
                      <div className={styles.fieldGroup}>
                        <label>Image URL</label>
                        <input
                          value={image.src}
                          onChange={(event) => handleGalleryChange(image.id, 'src', event.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label>Alt text</label>
                        <input
                          value={image.alt}
                          onChange={(event) => handleGalleryChange(image.id, 'alt', event.target.value)}
                          placeholder="Describe the image"
                        />
                      </div>
                    </div>
                    <div className={styles.galleryRowActions}>
                      <button
                        type="button"
                        className={styles.dangerButton}
                        onClick={() => handleRemoveGalleryImage(image.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                {formState.gallery.length === 0 ? <p className={styles.note}>Add imagery to tell the visual story.</p> : null}
              </div>
            </section>
          </form>
        ) : (
          <div className={styles.projectEditor}>
            <p className={styles.note}>Select a project to start editing or add a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
};

ProjectsManager.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string,
      tagline: PropTypes.string,
      collectionId: PropTypes.string,
      coverImage: PropTypes.string,
      description: PropTypes.string,
      gallery: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          src: PropTypes.string,
          alt: PropTypes.string
        })
      ),
      metadata: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          label: PropTypes.string,
          value: PropTypes.string
        })
      )
    })
  ).isRequired,
  collections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string
    })
  ).isRequired,
  onAddProject: PropTypes.func.isRequired,
  onUpdateProject: PropTypes.func.isRequired,
  onRemoveProject: PropTypes.func.isRequired,
  onCreateId: PropTypes.func.isRequired
};

export default ProjectsManager;
