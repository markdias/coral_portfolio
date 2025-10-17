import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Home from './Home.jsx';
import About from './About.jsx';
import Portfolio from './Portfolio.jsx';
import Contact from './Contact.jsx';
import styles from '../styles/ScrollSections.module.css';

const sections = [
  { id: 'home', Component: Home, toneClass: styles.homeTone },
  { id: 'about', Component: About, toneClass: styles.aboutTone },
  { id: 'portfolio', Component: Portfolio, toneClass: styles.portfolioTone },
  { id: 'contact', Component: Contact, toneClass: styles.contactTone }
];

const pathToSectionMap = {
  '/': 'home',
  '/about': 'about',
  '/portfolio': 'portfolio',
  '/contact': 'contact'
};

const Landing = () => {
  const location = useLocation();
  const targetSection = useMemo(
    () => pathToSectionMap[location.pathname] ?? 'home',
    [location.pathname]
  );

  useEffect(() => {
    const node = document.getElementById(targetSection);
    if (!node) return;

    const handle = window.requestAnimationFrame(() => {
      node.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    return () => window.cancelAnimationFrame(handle);
  }, [targetSection]);

  return (
    <div className={styles.snapWrapper}>
      {sections.map(({ id, Component, toneClass }) => (
        <section key={id} id={id} className={`${styles.snapSection} ${toneClass}`.trim()}>
          <Component />
        </section>
      ))}
    </div>
  );
};

export default Landing;
