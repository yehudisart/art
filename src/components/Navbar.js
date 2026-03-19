import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Logo = ({ lang }) => (
  <svg className="logo-svg" viewBox="0 0 200 44" xmlns="http://www.w3.org/2000/svg" aria-label="Yehudis">
    <line x1="0" y1="4" x2="200" y2="4" stroke="#C9A84C" strokeWidth="0.5" opacity="0.7"/>
    {lang === 'he'
      ? <text x="100" y="32" textAnchor="middle" fill="#0A0A0A" fontFamily="'Frank Ruhl Libre',serif" fontWeight="400" fontSize="24" letterSpacing="1">יהודית</text>
      : <text x="100" y="32" textAnchor="middle" fill="#0A0A0A" fontFamily="'Cormorant Garamond',serif" fontWeight="400" fontSize="26" letterSpacing="6" fontStyle="italic">Yehudis</text>
    }
    <line x1="0" y1="40" x2="200" y2="40" stroke="#C9A84C" strokeWidth="0.5" opacity="0.7"/>
  </svg>
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
          <Logo lang={t.lang} />
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
