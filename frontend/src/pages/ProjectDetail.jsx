import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import GalleryModal from '../components/GalleryModal.jsx';
import { projects } from '../data/projects.js';
import styles from '../styles/ProjectDetail.module.css';
import pageStyles from '../styles/PageSections.module.css';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const project = useMemo(() => projects.find((item) => item.id === projectId), [projectId]);
  const [selectedImage, setSelectedImage] = useState(null);

  if (!project) {
    return (
      <div className={styles.notFound}>
        <h2>Project not found</h2>
        <p>The story you are looking for has drifted away.</p>
        <Link to="/portfolio">Return to portfolio</Link>
      </div>
    );
  }

  return (
    <article className={styles.detailArticle}>
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          <Link to="/portfolio">Portfolio</Link>
          <span aria-hidden="true">/</span>
          <span>{project.title}</span>
        </div>
        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.subtitle}>{project.subtitle}</p>
        <div className={styles.metaGrid}>
          <div className={styles.metaBlock}>
            <p className={styles.metaLabel}>Year</p>
            <p className={styles.metaValue}>{project.year}</p>
          </div>
          <div className={styles.metaBlock}>
            <p className={styles.metaLabel}>Location</p>
            <p className={styles.metaValue}>{project.location}</p>
          </div>
          <div className={styles.metaBlock}>
            <p className={styles.metaLabel}>Services</p>
            <p className={styles.metaValue}>{project.services.join(', ')}</p>
          </div>
        </div>
      </div>

      <div className={styles.heroImage}>
        <img src={project.heroImage} alt={project.title} />
      </div>

      <div className={styles.bodyContent}>
        <section className={pageStyles.textBlock}>
          <h2>Project narrative</h2>
          <p>{project.description}</p>
          <p>
            Developed with local stewards, marine scientists, and textile artisans, the project fuses archival research with sensory design. Visitors move through gradients of light, fabric, and sound that translate reef recovery data into gestures the body can feel, leaving with tangible actions to sustain coral futures.
          </p>
        </section>

        <section>
          <h2>Gallery</h2>
          <p>Dive deeper into the making-of moments. Select any frame to open the full gallery experience.</p>
          <div className={styles.galleryGrid}>
            {project.gallery.map((image) => (
              <button type="button" key={image.src} onClick={() => setSelectedImage(image)}>
                <img src={image.src} alt={image.alt} loading="lazy" />
              </button>
            ))}
          </div>
        </section>
      </div>

      <GalleryModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </article>
  );
};

export default ProjectDetail;
