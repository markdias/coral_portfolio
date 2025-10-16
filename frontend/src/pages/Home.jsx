import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard.jsx';
import { projects } from '../data/projects.js';
import pageStyles from '../styles/PageSections.module.css';
import portfolioStyles from '../styles/Portfolio.module.css';

const Home = () => {
  const featuredProjects = projects.slice(0, 3);

  return (
    <div className={pageStyles.hero}>
      <div className={pageStyles.heroContent}>
        <span className={pageStyles.heroEyebrow}>Ocean atelier</span>
        <h1 className={pageStyles.heroTitle}>
          Tailored textiles and image worlds for living reefs
        </h1>
        <p className={pageStyles.heroDescription}>
          Coral Portfolio Studio shapes tactile narratives that slip between couture, conservation, and culture. We drape coral science in sumptuous palettes, choreographing installations, lookbooks, and rituals that feel as intimate as a fitting and as expansive as the tide.
        </p>
        <div className={portfolioStyles.heroActions}>
          <Link to="/portfolio" className={portfolioStyles.primaryButton}>
            View portfolio
          </Link>
          <Link to="/about" className={portfolioStyles.secondaryLink}>
            Studio ethos
          </Link>
        </div>
      </div>
      <div className={pageStyles.heroMedia}>
        <img src={projects[0].heroImage} alt={projects[0].title} loading="lazy" />
        <span className={pageStyles.heroRibbon}>Limited tide edition</span>
      </div>
      <div className={portfolioStyles.featuredCarousel}>
        {featuredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} variant="compact" />
        ))}
      </div>
    </div>
  );
};

export default Home;
