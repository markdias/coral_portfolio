import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from '../styles/ProjectCard.module.css';

const ProjectCard = ({ project, variant = 'default' }) => {
  return (
    <article className={`${styles.card} ${variant === 'compact' ? styles.compact : ''}`.trim()}>
      <Link to={`/portfolio/${project.id}`} className={styles.imageWrap}>
        <img src={project.heroImage} alt={project.title} loading="lazy" />
      </Link>
      <div className={styles.content}>
        <p className={styles.subtitle}>{project.subtitle}</p>
        <h3 className={styles.title}>{project.title}</h3>
        <div className={styles.meta}>
          <span>{project.year}</span>
          <span>{project.location}</span>
        </div>
        <Link to={`/portfolio/${project.id}`} className={styles.cta}>
          View Story <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    heroImage: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired
  }).isRequired,
  variant: PropTypes.oneOf(['default', 'compact'])
};

export default ProjectCard;
