import { useMemo, useState } from 'react';
import ProjectCard from '../components/ProjectCard.jsx';
import styles from '../styles/Portfolio.module.css';
import { useData } from '../store/DataContext.jsx';

const Portfolio = () => {
  const { data } = useData();
  const [activeFilter, setActiveFilter] = useState('all');

  const filterOptions = useMemo(
    () => [{ id: 'all', name: 'All' }, ...data.collections],
    [data.collections]
  );

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return data.projects;
    return data.projects.filter((project) => project.collectionId === activeFilter);
  }, [activeFilter, data.projects]);

  const activeCollection =
    activeFilter === 'all' ? null : data.collections.find((collection) => collection.id === activeFilter);

  return (
    <div className={styles.section}>
      <div className={styles.intro}>
        <h1>{data.portfolio.introTitle}</h1>
        <p>{data.portfolio.introDescription}</p>
        <div className={styles.filters}>
          <span className={styles.filtersLabel}>{data.portfolio.filtersLabel}</span>
          <div className={styles.filtersChips}>
            {filterOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`${styles.filterButton} ${activeFilter === option.id ? styles.filterActive : ''}`.trim()}
                onClick={() => setActiveFilter(option.id)}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
        {activeCollection ? (
          <div className={styles.collectionSummary}>
            <p>{activeCollection.description}</p>
            {activeCollection.mood ? <span>{activeCollection.mood}</span> : null}
          </div>
        ) : null}
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
