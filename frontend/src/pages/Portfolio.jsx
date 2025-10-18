import { useMemo, useState } from 'react';
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard.jsx';
import styles from '../styles/Portfolio.module.css';
import { useData } from '../store/DataContext.jsx';
import Reveal from '../components/Reveal.jsx';
import { resolveFontFamily } from '../utils/typography.js';

const Portfolio = () => {
  const { data } = useData();
  const shouldReduceMotion = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState('all');
  const typography = data.typography || {};
  const titleFont = resolveFontFamily(typography, 'portfolio.introTitle');
  const descriptionFont = resolveFontFamily(typography, 'portfolio.introDescription', 'sans');
  const filtersFont = resolveFontFamily(typography, 'portfolio.filtersLabel', 'sans');

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
      <Reveal as="div" className={styles.intro}>
        <Reveal as="h1" delay={0.05} style={{ fontFamily: titleFont }}>
          {data.portfolio.introTitle}
        </Reveal>
        <Reveal as="p" delay={0.12} style={{ fontFamily: descriptionFont }}>
          {data.portfolio.introDescription}
        </Reveal>
        <LayoutGroup>
          <div className={styles.filters}>
            <Reveal as="span" className={styles.filtersLabel} delay={0.16} style={{ fontFamily: filtersFont }}>
              {data.portfolio.filtersLabel}
            </Reveal>
            <div className={styles.filtersChips}>
              {filterOptions.map((option) => {
                const isActive = activeFilter === option.id;

                return (
                  <motion.button
                    key={option.id}
                    type="button"
                    className={`${styles.filterButton} ${isActive ? styles.filterActive : ''}`.trim()}
                    onClick={() => setActiveFilter(option.id)}
                    style={{ fontFamily: filtersFont }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  >
                    {!shouldReduceMotion && isActive ? (
                      <motion.span
                        layoutId="filterHighlight"
                        className={styles.filterHighlight}
                        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                      />
                    ) : null}
                    <span className={styles.filterLabel}>{option.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </LayoutGroup>
        {activeCollection ? (
          <Reveal as="div" className={styles.collectionSummary} delay={0.24} style={{ fontFamily: descriptionFont }}>
            <p>{activeCollection.description}</p>
            {activeCollection.mood ? <span>{activeCollection.mood}</span> : null}
          </Reveal>
        ) : null}
      </Reveal>
      <div className={styles.cardsGrid}>
        {filteredProjects.map((project, index) => (
          <Reveal key={project.id} delay={0.08 * (index % 4)}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
