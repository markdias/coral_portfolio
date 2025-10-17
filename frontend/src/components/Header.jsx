import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from '../styles/Layout.module.css';
import { useData } from '../store/DataContext.jsx';
import { asset } from '../utils/asset.js';

const navItems = [
  { to: '/', label: 'Home', section: 'home' },
  { to: '/about', label: 'About', section: 'about' },
  { to: '/portfolio', label: 'Portfolio', section: 'portfolio' },
  { to: '/contact', label: 'Contact', section: 'contact' }
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const { data } = useData();
  const location = useLocation();

  useLayoutEffect(() => {
    const headerNode = headerRef.current;
    if (!headerNode) {
      return;
    }

    const updateHeaderHeight = () => {
      const node = headerRef.current;
      if (!node) return;
      const { height } = node.getBoundingClientRect();
      document.documentElement.style.setProperty('--header-height', `${Math.round(height)}px`);
    };

    updateHeaderHeight();

    let resizeObserver;

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateHeaderHeight);
      resizeObserver.observe(headerNode);
    }

    window.addEventListener('resize', updateHeaderHeight);

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNavClick = (event, item) => {
    const isSamePath = location.pathname === item.to;

    if (isSamePath) {
      event.preventDefault();
      window.requestAnimationFrame(() => scrollToSection(item.section));
    }

    setMenuOpen(false);
  };

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.headerInner}>
        <NavLink to="/" className={styles.brand}>
          {data?.settings?.logo ? (
            <img className={styles.brandLogo} src={asset(data.settings.logo)} alt="Site logo" />
          ) : (
            <span className={styles.brandAccent} aria-hidden="true" />
          )}
          {data?.settings?.siteTitle || 'Coral Dias'}
        </NavLink>
        <button
          className={styles.mobileMenuButton}
          type="button"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
        >
          <span className="visuallyHidden">Toggle navigation</span>
          {menuOpen ? '✕' : '☰'}
        </button>
        <nav>
          <ul
            id="primary-navigation"
            className={`${styles.navList} ${menuOpen ? styles.navVisible : styles.navHidden}`.trim()}
          >
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={(event) => handleNavClick(event, item)}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`.trim()
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
