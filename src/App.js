import React, { useState, useEffect } from 'react';
import './index.css';
import { translations } from './translations';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import GalleryPage from './components/GalleryPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';

/* ── Custom cursor — luxury gold ring ── */
const Cursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const move = e => setPos({ x: e.clientX, y: e.clientY });
    const over = e => {
      const isHoverable = e.target.closest('button, a, [role="button"], .gp__img-btn, .hp__work');
      setHover(!!isHoverable);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
    };
  }, []);

  return (
    <div
      className={`cursor ${hover ? 'cursor--hover' : ''}`}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      aria-hidden="true"
    >
      <div className="cursor__dot" />
      <div className="cursor__ring" />
    </div>
  );
};

function App() {
  const [lang, setLang] = useState('en');
  const t = translations[lang];
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect touch device — don't show cursor on mobile
    const checkMobile = () => setIsMobile(window.matchMedia('(pointer: coarse)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', t.dir);
    document.body.setAttribute('dir', t.dir);
    // On mobile: restore default cursor
    if (isMobile) {
      document.body.style.cursor = 'auto';
    }
  }, [lang, t.dir, isMobile]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const toggleLang = () => setLang(p => p === 'en' ? 'he' : 'en');

  const renderPage = () => {
    switch (currentPage) {
      case 'gallery': return <GalleryPage t={t} onNavigate={setCurrentPage} />;
      case 'about':   return <AboutPage t={t} />;
      case 'contact': return <ContactPage t={t} />;
      default:        return <HomePage t={t} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className={`app lang-${lang}`} dir={t.dir}>
      {!isMobile && <Cursor />}
      <Navbar t={t} currentPage={currentPage} onNavigate={setCurrentPage} onToggleLang={toggleLang} />
      <div className="page-content" key={`${currentPage}-${lang}`}>
        {renderPage()}
      </div>
      <Footer t={t} onNavigate={setCurrentPage} />
    </div>
  );
}
export default App;
