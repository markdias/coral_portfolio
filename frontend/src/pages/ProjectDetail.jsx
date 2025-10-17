import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import GalleryModal from '../components/GalleryModal.jsx';
import WatermarkedImage from '../components/WatermarkedImage.jsx';
import styles from '../styles/ProjectDetail.module.css';
import pageStyles from '../styles/PageSections.module.css';
import { useData } from '../store/DataContext.jsx';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const { data } = useData();
  const project = useMemo(
    () => data.projects.find((item) => item.id === projectId),
    [data.projects, projectId]
  );
  const collection = useMemo(
    () => data.collections.find((item) => item.id === project?.collectionId),
    [data.collections, project?.collectionId]
  );
  const [selectedImage, setSelectedImage] = useState(null);

  // Ensure we land at top when navigating from a portfolio card
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, []);

  if (!project) {
    return (
      <div className={styles.notFound}>
        <h2>Project not found</h2>
        <p>The pattern you are looking for has been archived.</p>
        <Link to="/portfolio">Return to portfolio</Link>
      </div>
    );
  }

  return (
    <article className={styles.detailArticle}>
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          <Link to="/portfolio">Portfolio</Link>
          {collection ? (
            <>
              <span aria-hidden="true">/</span>
              <span>{collection.name}</span>
            </>
          ) : null}
          <span aria-hidden="true">/</span>
          <span>{project.title}</span>
        </div>
        <h1 className={styles.title}>{project.title}</h1>
        {project.tagline ? <p className={styles.subtitle}>{project.tagline}</p> : null}
        <div className={styles.metaGrid}>
          {collection ? (
            <div className={styles.metaBlock}>
              <p className={styles.metaLabel}>Collection</p>
              <p className={styles.metaValue}>{collection.name}</p>
            </div>
          ) : null}
          {project.metadata?.map((meta) => (
            <div key={meta.id} className={styles.metaBlock}>
              <p className={styles.metaLabel}>{meta.label}</p>
              <p className={styles.metaValue}>{meta.value}</p>
            </div>
          ))}
        </div>
      </div>

      {project.coverImage ? (
        <div className={styles.heroImage}>
          <WatermarkedImage src={project.coverImage} alt={project.title} />
        </div>
      ) : null}

      <div>
        <a href="#gallery" className={styles.jumpLink}>
          View gallery ↓
        </a>
      </div>

      <div className={styles.bodyContent}>
        <section className={pageStyles.textBlock}>
          <h2>Project narrative</h2>
          <p>{project.description}</p>
          <p>
            Each layer moves from sketchbook to silk through pigment trials, botanical studies, and digital refinement. Isla
            collaborates closely with fabric mills and stylists to align texture, drape, and color, delivering bespoke surfaces
            ready for fittings, editorials, and immersive showcases.
          </p>
        </section>

        <section id="gallery">
          <h2>Gallery</h2>
          <p>Explore close-up textures and runway captures. Select any frame to open the full gallery experience.</p>
          <div className={styles.galleryGrid}>
            {project.gallery?.map((image) => (
              <button type="button" key={image.id} onClick={() => setSelectedImage(image)}>
                <WatermarkedImage src={image.src} alt={image.alt} loading="lazy" />
              </button>
            ))}
            {project.gallery?.length === 0 ? <p className={pageStyles.heroDescription}>No gallery images yet.</p> : null}
          </div>
        </section>
      </div>

      <GalleryModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </article>
  );
};

export default ProjectDetail;
