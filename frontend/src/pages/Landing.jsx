import { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
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
  const scrollContainerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ container: scrollContainerRef });
  const progressSpring = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 32,
    restDelta: 0.001
  });
  const auraOpacity = useTransform(progressSpring, [0, 1], [0.08, 0.32]);
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
    <div ref={scrollContainerRef} className={styles.snapWrapper}>
      {shouldReduceMotion ? null : (
        <>
          <motion.span
            aria-hidden="true"
            className={styles.progressIndicator}
            style={{ scaleX: progressSpring }}
          />
          <motion.span
            aria-hidden="true"
            className={styles.scrollAura}
            style={{ opacity: auraOpacity }}
          />
        </>
      )}
      {sections.map(({ id, Component, toneClass }) => (
        <section key={id} id={id} className={`${styles.snapSection} ${toneClass}`.trim()}>
          <Component />
        </section>
      ))}
    </div>
  );
};

export default Landing;
