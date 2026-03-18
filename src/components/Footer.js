// ============================================================
// FOOTER COMPONENT
// ============================================================
import React from 'react';
import './Footer.css';

const Footer = ({ t, onNavigate }) => {
  const navItems = [
    { key: 'home',    label: t.nav.home },
    { key: 'gallery', label: t.nav.gallery },
    { key: 'about',   label: t.nav.about },
    { key: 'contact', label: t.nav.contact },
  ];

  return (
    <footer className="footer" dir={t.dir}>
      <div className="footer-inner container">
        {/* Artist name in footer */}
        <div className="footer-brand">
          <p className="footer-name">
            {t.lang === 'he' ? 'יהודית' : 'Yehudis'}
          </p>
          <p className="footer-tagline">{t.footer.tagline}</p>
        </div>

        {/* Footer nav */}
        <nav className="footer-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className="footer-nav-link"
              onClick={() => {
                onNavigate(item.key);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Location */}
        <div className="footer-location">
          <span className="footer-dot">◦</span>
          <span>{t.footer.madeWith}</span>
          <span className="footer-dot">◦</span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container">
          <p>{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
