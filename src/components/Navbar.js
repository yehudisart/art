import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = ({ t, currentPage, onNavigate, onToggleLang }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const items = [
    { key: 'home',    label: t.nav.home },
    { key: 'gallery', label: t.nav.gallery },
    { key: 'about',   label: t.nav.about },
    { key: 'contact', label: t.nav.contact },
  ];

  const go = (page) => { onNavigate(page); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <header className={`nb ${scrolled ? 'nb--scrolled' : ''}`} dir={t.dir}>
      <div className="nb__inner container">

        <button className="nb__logo" onClick={() => go('home')} aria-label="Yehudis Jacobs">
          <img
            src="/images/logo.png"
            alt="Yehudis"
            className={`nb__sig ${scrolled ? 'nb__sig--dark' : 'nb__sig--light'}`}
          />
          <span className="nb__jacobs">Jacobs</span>
        </button>

        <nav className="nb__links" aria-label="Main navigation">
          {items.map(item => (
            <button key={item.key} className={`nb__link ${currentPage === item.key ? 'nb__link--active' : ''}`} onClick={() => go(item.key)}>
              {item.label}
            </button>
          ))}
          <button className="nb__lang" onClick={onToggleLang}>{t.nav.langToggle}</button>
        </nav>

        <div className="nb__mobile">
          <button className="nb__lang" onClick={onToggleLang}>{t.nav.langToggle}</button>
          <button className={`nb__burger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className={`nb__drawer ${menuOpen ? 'open' : ''}`}>
        {items.map(item => (
          <button key={item.key} className={`nb__drawer-link ${currentPage === item.key ? 'active' : ''}`} onClick={() => go(item.key)}>
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
export default Navbar;
