import React from 'react';
import './Footer.css';

const Footer = ({ t, onNavigate }) => {
  const go = page => { onNavigate(page); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const items = [
    { key: 'home', label: t.nav.home }, { key: 'gallery', label: t.nav.gallery },
    { key: 'about', label: t.nav.about }, { key: 'contact', label: t.nav.contact },
  ];
  return (
    <footer className="ft" dir={t.dir}>
      <div className="ft__top container">
        <div className="ft__brand">
          <img src="/images/logo.png" alt="Yehudis Jacobs" className="ft__sig" />
          <span className="ft__jacobs">Jacobs</span>
          <p className="ft__tagline">{t.footer.tagline}</p>
        </div>
        <nav className="ft__nav">
          {items.map(item => (
            <button key={item.key} className="ft__link" onClick={() => go(item.key)}>{item.label}</button>
          ))}
        </nav>
        <div className="ft__contact">
          {/* ← Replace with real details */}
          <a href="mailto:studio@yehudis.art" className="ft__c-link">studio@yehudis.art</a>
          <a href="https://instagram.com/yehudis.art" target="_blank" rel="noopener noreferrer" className="ft__c-link">@yehudis.art</a>
          <span className="ft__c-link">Jerusalem, Israel</span>
        </div>
      </div>
      <div className="ft__bottom container">
        <p className="ft__copy">{t.footer.copyright}</p>
      </div>
    </footer>
  );
};
export default Footer;
