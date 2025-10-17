import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from '../styles/ProjectCard.module.css';
import WatermarkedImage from './WatermarkedImage.jsx';

const getMetaValue = (project, label) =>
  project.metadata?.find((item) => item.label.toLowerCase() === label.toLowerCase())?.value;

const ProjectCard = ({ project, variant = 'default' }) => {
  const client = getMetaValue(project, 'Client');
  const year = getMetaValue(project, 'Year');

  const coverImage = project.coverImage;

  return (
    <article className={`${styles.card} ${variant === 'compact' ? styles.compact : ''}`.trim()}>
      <Link
        to={`/portfolio/${project.id}`}
        className={`${styles.imageWrap} ${coverImage ? '' : styles.imagePlaceholder}`.trim()}
      >
        {coverImage ? (
          <WatermarkedImage src={coverImage} alt={project.title} loading="lazy" />
        ) : (
          <span className={styles.placeholderLabel}>Cover image coming soon</span>
        )}
      </Link>
      <div className={styles.content}>
        {project.tagline ? <p className={styles.subtitle}>{project.tagline}</p> : null}
        <h3 className={styles.title}>{project.title}</h3>
        <div className={styles.meta}>
          {client ? <span>{client}</span> : null}
          {year ? <span>{year}</span> : null}
        </div>
        <Link to={`/portfolio/${project.id}`} className={styles.cta}>
          View project <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    tagline: PropTypes.string,
    coverImage: PropTypes.string.isRequired,
    metadata: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string,
        value: PropTypes.string
      })
    )
  }).isRequired,
  variant: PropTypes.oneOf(['default', 'compact'])
};

export default ProjectCard;
