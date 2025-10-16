import { useMemo, useState } from 'react';
import ProjectCard from '../components/ProjectCard.jsx';
import { projects } from '../data/projects.js';
import styles from '../styles/Portfolio.module.css';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = useMemo(() => {
    const serviceSet = new Set();
    projects.forEach((project) => {
      project.services.forEach((service) => serviceSet.add(service));
    });
    return ['All', ...serviceSet];
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return projects;
    return projects.filter((project) => project.services.includes(activeFilter));
  }, [activeFilter]);

  return (
    <div className={styles.section}>
      <div className={styles.intro}>
        <h1>Portfolio</h1>
        <p>
          A living archive of coral couture, sensorial installations, and science-led pilgrimages. Filter by discipline to glimpse how we translate briefs into layered textures, moving images, and restorative gatherings.
        </p>
        <div className={styles.filters}>
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`${styles.filterButton} ${activeFilter === filter ? styles.filterActive : ''}`.trim()}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.masonry}>
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
