import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/Layout.module.css';
import { useData } from '../store/DataContext.jsx';
import { formatDisplayValue, resolveContactHref } from '../utils/contact.jsx';

const Footer = () => {
  const year = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = useData();
  const contactEntries = Array.isArray(data?.contact?.entries) ? data.contact.entries : [];
  const primaryContact =
    contactEntries.find((entry) => (entry.value || '').includes('@')) || contactEntries[0] || null;
  const contactHref = primaryContact ? resolveContactHref(primaryContact.value || '') : null;
  const contactDisplay = primaryContact ? formatDisplayValue(primaryContact) : null;

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
        <NavLink to="/contact" onClick={(event) => handleNavClick(event, { to: '/contact', section: 'contact' })}>
          Contact
        </NavLink>
      </div>
      {contactHref ? (
        <p className={styles.footerSmall}>
          <a href={contactHref}>{contactDisplay}</a>
        </p>
      ) : null}
      <p className={styles.footerSmall}>
        © {year} Coral Dias. Fashion print stories composed with coastal botanicals and luminous color.
      </p>
    </footer>
  );
};

export default Footer;
