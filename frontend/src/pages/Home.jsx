import { Link } from 'react-router-dom';
import pageStyles from '../styles/PageSections.module.css';
import portfolioStyles from '../styles/Portfolio.module.css';
import { useData } from '../store/DataContext.jsx';

const Home = () => {
  const { data } = useData();
  const heroImage = data.home.heroImage || data.projects[0]?.coverImage;

  return (
    <div className={pageStyles.hero}>
      <div className={pageStyles.heroContent}>
        {data.home.eyebrow ? <span className={pageStyles.heroEyebrow}>{data.home.eyebrow}</span> : null}
        <h1 className={pageStyles.heroTitle}>{data.home.title}</h1>
        <p className={pageStyles.heroDescription}>{data.home.description}</p>
        <div className={portfolioStyles.heroActions}>
          {data.home.primaryCta?.href ? (
            <Link to={data.home.primaryCta.href} className={portfolioStyles.primaryButton}>
              {data.home.primaryCta.label || 'Explore portfolio'}
            </Link>
          ) : null}
          {data.home.secondaryCta?.href ? (
            <Link to={data.home.secondaryCta.href} className={portfolioStyles.secondaryLink}>
              {data.home.secondaryCta.label || 'About'}
            </Link>
          ) : null}
        </div>
      </div>
      <div className={pageStyles.heroMedia}>
        {heroImage ? <img src={heroImage} alt={data.home.title} loading="lazy" /> : null}
        <span className={pageStyles.heroRibbon}>Limited print editions</span>
      </div>
    </div>
  );
};

export default Home;
