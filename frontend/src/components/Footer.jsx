import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/Layout.module.css';

const Footer = () => {
  const year = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNavClick = (event, link) => {
    event.preventDefault();
    const runScroll = () => window.requestAnimationFrame(() => scrollToSection(link.section));

    if (location.pathname !== link.to) {
      navigate(link.to);
      setTimeout(runScroll, 80);
    } else {
      runScroll();
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerLinks}>
        <NavLink to="/about" onClick={(event) => handleNavClick(event, { to: '/about', section: 'about' })}>
          About
        </NavLink>
        <NavLink to="/portfolio" onClick={(event) => handleNavClick(event, { to: '/portfolio', section: 'portfolio' })}>
          Portfolio
        </NavLink>
        <a href="mailto:hello@coralstudio.org">Contact</a>
      </div>
      <p className={styles.footerSmall}>
        © {year} Coral Portfolio Studio. Crafted with tides, textiles, and community guardians to amplify coral futures.
      </p>
    </footer>
  );
};

export default Footer;
