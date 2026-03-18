// ============================================================
// NAVBAR COMPONENT
// ============================================================
import React, { useState, useEffect } from 'react';
import './Navbar.css';

// SVG Logo — text-based elegant monogram + full name
const Logo = ({ lang }) => (
  <svg
    className="logo-svg"
    viewBox="0 0 220 54"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Yehudis"
  >
    {/* Decorative thin rule above */}
    <line x1="0" y1="6" x2="220" y2="6" stroke="#B8963E" strokeWidth="0.5" opacity="0.6" />
    {/* Artist name */}
    {lang === 'he' ? (
      <text
        x="110"
        y="38"
        textAnchor="middle"
        fill="#2C2416"
        fontFamily="'Frank Ruhl Libre', serif"
        fontWeight="400"
        fontSize="26"
        letterSpacing="2"
      >
        יהודית
      </text>
    ) : (
      <text
        x="110"
        y="38"
        textAnchor="middle"
        fill="#2C2416"
        fontFamily="'Cormorant Garamond', serif"
        fontWeight="400"
        fontSize="28"
        letterSpacing="5"
        fontStyle="italic"
      >
        Yehudis
      </text>
    )}
    {/* Decorative thin rule below */}
    <line x1="0" y1="48" x2="220" y2="48" stroke="#B8963E" strokeWidth="0.5" opacity="0.6" />
  </svg>
);

const Navbar = ({ t, currentPage, onNavigate, onToggleLang }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'home',    label: t.nav.home },
    { key: 'gallery', label: t.nav.gallery },
    { key: 'about',   label: t.nav.about },
    { key: 'contact', label: t.nav.contact },
  ];

  const handleNav = (page) => {
    onNavigate(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`} dir={t.dir}>
      <div className="navbar-inner container">
        {/* Logo */}
        <button
          className="logo-btn"
          onClick={() => handleNav('home')}
          aria-label="Go to home"
        >
          <Logo lang={t.lang} />
        </button>

        {/* Desktop navigation */}
        <nav className="nav-links" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`nav-link ${currentPage === item.key ? 'active' : ''}`}
              onClick={() => handleNav(item.key)}
            >
              {item.label}
            </button>
          ))}
          <button className="lang-toggle" onClick={onToggleLang}>
            {t.nav.langToggle}
          </button>
        </nav>

        {/* Mobile: lang + burger */}
        <div className="mobile-controls">
          <button className="lang-toggle" onClick={onToggleLang}>
            {t.nav.langToggle}
          </button>
          <button
            className={`burger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`mobile-nav-link ${currentPage === item.key ? 'active' : ''}`}
            onClick={() => handleNav(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};

export default Navbar;
