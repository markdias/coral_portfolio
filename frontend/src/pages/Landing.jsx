import { useEffect, useMemo, useRef, useState } from 'react';
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
  const [scrollRoot, setScrollRoot] = useState(null);
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

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    setScrollRoot(scrollContainerRef.current);
  }, []);

  const viewportSettings = useMemo(() => {
    if (shouldReduceMotion || !scrollRoot) return undefined;

    return {
      root: scrollRoot,
      once: true,
      amount: 0.5,
      margin: '0px 0px -18% 0px'
    };
  }, [shouldReduceMotion, scrollRoot]);

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
        <motion.section
          key={id}
          id={id}
          className={`${styles.snapSection} ${toneClass}`.trim()}
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 120 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={viewportSettings}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <Component />
        </motion.section>
      ))}
    </div>
  );
};

export default Landing;
