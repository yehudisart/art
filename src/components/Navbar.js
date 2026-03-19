import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Logo = ({ lang, dark }) => (
  <img
    src={dark ? '/images/logo-yehudis.png' : '/images/logo-yehudis-dark.png'}
    alt="Yehudis"
    className="logo-img"
    style={{ height: '44px', width: 'auto', display: 'block', objectFit: 'contain' }}
  />
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
    { key: 'home', label: t.nav.home },
    { key: 'gallery', label: t.nav.gallery },
    { key: 'about', label: t.nav.about },
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
        <button className="logo-btn" onClick={() => go('home')} aria-label="Go to home">
          <Logo lang={t.lang} dark={!scrolled && currentPage === 'home'} />
        </button>
        <nav className="nav-links" aria-label="Main navigation">
          {navItems.map(item => (
            <button
              key={item.key}
              className={`nav-link ${currentPage === item.key ? 'active' : ''}`}
              onClick={() => go(item.key)}
            >{item.label}</button>
          ))}
          <button className="lang-toggle" onClick={onToggleLang}>{t.nav.langToggle}</button>
        </nav>
        <div className="mobile-controls">
          <button className="lang-toggle" onClick={onToggleLang}>{t.nav.langToggle}</button>
          <button className={`burger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navItems.map(item => (
          <button key={item.key} className={`mobile-nav-link ${currentPage === item.key ? 'active' : ''}`} onClick={() => go(item.key)}>
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};

export default Navbar;
