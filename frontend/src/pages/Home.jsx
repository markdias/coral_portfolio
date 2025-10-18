import { Link } from 'react-router-dom';
import pageStyles from '../styles/PageSections.module.css';
import portfolioStyles from '../styles/Portfolio.module.css';
import { useData } from '../store/DataContext.jsx';
import { asset } from '../utils/asset.js';
import WatermarkedImage from '../components/WatermarkedImage.jsx';
import Reveal from '../components/Reveal.jsx';

const Home = () => {
  const { data } = useData();
  const heroImage = data.home.heroImage || data.projects[0]?.coverImage;

  return (
    <div className={pageStyles.hero}>
      <Reveal as="div" className={pageStyles.heroContent}>
        {data.home.eyebrow ? (
          <Reveal as="span" className={pageStyles.heroEyebrow} delay={0.05}>
            {data.home.eyebrow}
          </Reveal>
        ) : null}
        <Reveal as="h1" className={pageStyles.heroTitle} delay={0.1}>
          {data.home.title}
        </Reveal>
        <Reveal as="p" className={pageStyles.heroDescription} delay={0.18}>
          {data.home.description}
        </Reveal>
        <Reveal as="div" className={portfolioStyles.heroActions} delay={0.26}>
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
        </Reveal>
      </Reveal>
      <Reveal as="div" className={pageStyles.heroMedia} delay={0.15}>
        {heroImage ? (
          <WatermarkedImage src={asset(heroImage)} alt={data.home.title} loading="lazy" />
        ) : null}
        <Reveal as="span" className={pageStyles.heroRibbon} delay={0.3}>
          {data.home.ribbonText || 'Limited print editions'}
        </Reveal>
      </Reveal>
    </div>
  );
};

export default Home;
