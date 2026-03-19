import React, { useState, useEffect } from 'react';
import './index.css';
import { translations } from './translations';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import GalleryPage from './components/GalleryPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';

function App() {
  const [lang, setLang] = useState('en');
  const t = translations[lang];
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', t.dir);
    document.body.setAttribute('dir', t.dir);
  }, [lang, t.dir]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'he' : 'en');

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
      <Navbar t={t} currentPage={currentPage} onNavigate={setCurrentPage} onToggleLang={toggleLang} />
      <div className="page-content" key={`${currentPage}-${lang}`}>
        {renderPage()}
      </div>
      <Footer t={t} onNavigate={setCurrentPage} />
    </div>
  );
}
export default App;
