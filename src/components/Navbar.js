import React, { useState, useEffect } from 'react';
import './Navbar.css';

// ── Logo: real signature image + "Jacobs" subtitle ─────────
const Logo = ({ lang, scrolled }) => (
  <div className="logo-wrap">
    {/* Actual artist signature */}
    <img
      src="/images/signature.png"
      alt="Yehudis Jacobs"
      className={`logo-sig ${scrolled ? 'logo-sig--dark' : 'logo-sig--light'}`}
    />
    {/* Jacobs — small spaced caps below */}
    <span className={`logo-jacobs ${scrolled ? 'logo-jacobs--dark' : 'logo-jacobs--light'}`}>
      Jacobs
    </span>
  </div>
);

const Navbar = ({ t, currentPage, onNavigate, onToggleLang }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navItems = [
    { key: 'home',    label: t.nav.home },
    { key: 'gallery', label: t.nav.gallery },
    { key: 'about',   label: t.nav.about },
    { key: 'contact', label: t.nav.contact },
  ];

  const go = (page) => {
    onNavigate(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`} dir={t.dir}>
      <div className="navbar-inner container">

        {/* Logo */}
        <button className="logo-btn" onClick={() => go('home')} aria-label="Yehudis Jacobs — Home">
          <Logo lang={t.lang} scrolled={scrolled} />
        </button>

        {/* Desktop nav */}
        <nav className="nav-links" aria-label="Main navigation">
          {navItems.map(item => (
            <button
              key={item.key}
              className={`nav-link ${currentPage === item.key ? 'active' : ''}`}
              onClick={() => go(item.key)}
            >
              {item.label}
            </button>
          ))}
          <button className="lang-toggle" onClick={onToggleLang}>
            {t.nav.langToggle}
          </button>
        </nav>

        {/* Mobile controls */}
        <div className="mobile-controls">
          <button className="lang-toggle" onClick={onToggleLang}>
            {t.nav.langToggle}
          </button>
          <button
            className={`burger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navItems.map(item => (
          <button
            key={item.key}
            className={`mobile-nav-link ${currentPage === item.key ? 'active' : ''}`}
            onClick={() => go(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};

export default Navbar;
