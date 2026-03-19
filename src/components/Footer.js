import React from 'react';
import './Footer.css';

const Footer = ({ t, onNavigate }) => {
  const go = page => { onNavigate(page); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const items = [
    { key: 'home',    label: t.nav.home },
    { key: 'gallery', label: t.nav.gallery },
    { key: 'about',   label: t.nav.about },
    { key: 'contact', label: t.nav.contact },
  ];
  return (
    <footer className="footer" dir={t.dir}>
      <div className="footer-top container">
        <div className="footer-brand">
          {/* ← logo.png = white letters on transparent bg */}
          <img src="/images/logo.png" alt="Yehudis Jacobs" className="footer-logo" />
          <span className="footer-jacobs">Jacobs</span>
          <p className="footer-tagline">{t.footer.tagline}</p>
        </div>
        <nav className="footer-nav">
          {items.map(item => (
            <button key={item.key} className="footer-link" onClick={() => go(item.key)}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="footer-contact">
          {/* ← Replace with real contact details */}
          <a href="mailto:studio@yehudis.art" className="footer-email">studio@yehudis.art</a>
          <a href="https://instagram.com/yehudis.art" target="_blank" rel="noopener noreferrer" className="footer-insta">@yehudis.art</a>
          <span className="footer-email" style={{ cursor: 'default' }}>Jerusalem, Israel</span>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="footer-copy">{t.footer.copyright}</p>
        <p className="footer-loc">Jerusalem</p>
      </div>
    </footer>
  );
};
export default Footer;
