import React, { useEffect } from 'react';
import { artworks } from '../translations';
import './HomePage.css';

const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      }),
      { threshold: 0.08 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
};

const HomePage = ({ t, onNavigate }) => {
  useReveal();
  const isHe = t.lang === 'he';
  const featured = artworks.slice(0, 3);
  const go = (page) => { onNavigate(page); window.scrollTo({ top: 0 }); };

  return (
    <main className="home-page" dir={t.dir}>

      {/* 1. HERO */}
      <section className="hero">
        <img src="/images/har-sinai-hero.jpg" alt="Har Sinai" className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-center">
          <img src="/images/logo-yehudis.png" alt="Yehudis" className="hero-logo" />
          <p className="hero-jacobs">{isHe ? 'יעקובס' : 'JACOBS'}</p>
          <p className="hero-tagline">{isHe ? 'אמנות כשפת הנשמה' : 'Art as a Language of the Soul'}</p>
          <div className="hero-btns">
            <button className="hero-btn" onClick={() => go('gallery')}>
              {isHe ? 'כניסה לגלריה' : 'ENTER THE GALLERY'}
            </button>
            <div className="hero-divider" />
            <button className="hero-btn" onClick={() => go('about')}>
              {isHe ? 'אודות האמנית' : 'ABOUT THE ARTIST'}
            </button>
          </div>
        </div>
        <div className="scroll-cue"><div className="scroll-cue-line" /></div>
      </section>

      {/* 2. QUOTE */}
      <section className="quote-band reveal">
        <div className="quote-inner">
          <blockquote className="quote-text">
            {isHe
              ? '״אני מציירת כדי לתת צורה למה שחי בפנים — להנכיח את האור והצל שמילים לבדן אינן יכולות לשאת.״'
              : '"I paint to give form to what lives inside — to make visible the light and shadow that words alone cannot carry."'
            }
          </blockquote>
          <button className="quote-link" onClick={() => go('about')}>
            {isHe ? 'יהודית יעקובס · ירושלים' : 'Yehudis Jacobs · Jerusalem'}
          </button>
        </div>
      </section>

      {/* 3. RECENT PAINTINGS */}
      <section className="recent-section">
        <div className="recent-inner">
          <p className="recent-label">{isHe ? 'יצירות נבחרות' : 'SELECTED WORKS'}</p>
          <h2 className="recent-title">{isHe ? 'ציורים אחרונים' : 'Recent Paintings'}</h2>
          <div className="recent-grid">
            {featured.map((work, i) => (
              <div key={work.id} className="recent-card reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
                onClick={() => go('gallery')} role="button" tabIndex={0}>
                <div className="recent-img-wrap">
                  <img src={work.image} alt={isHe ? work.titleHe : work.titleEn} className="recent-img" />
                </div>
                <div className="recent-meta">
                  <p className="recent-card-title">{isHe ? work.titleHe : work.titleEn}</p>
                  <p className="recent-card-sub">{isHe ? work.mediumHe : work.mediumEn} · {work.dims}</p>
                  <p className="recent-card-story">
                    {(isHe ? work.storyHe : work.storyEn).substring(0, 80)}{(isHe ? work.storyHe : work.storyEn).length > 80 ? '…' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="recent-cta-wrap reveal">
            <button className="btn-gallery" onClick={() => go('gallery')}>
              {isHe ? 'לגלריה המלאה' : 'VIEW FULL GALLERY'}
            </button>
          </div>
        </div>
      </section>

      {/* 4. WHERE COLOR BECOMES FEELING — image left, dark text right */}
      <section className="split-section split-dark">
        <div className="split-image reveal">
          <img src="/images/hasidim.jpg" alt="Hasidim" className="split-img" />
        </div>
        <div className="split-text split-text-dark reveal">
          <span className="split-label">{isHe ? 'על האמנית' : 'THE ARTIST'}</span>
          <h2 className="split-heading">{t.home.storyTitle}</h2>
          <div className="gold-bar" />
          <p className="split-body">{t.home.storyText}</p>
          <p className="split-body">{t.home.storyText2}</p>
          <button className="btn-light" onClick={() => go('about')}>
            {isHe ? 'קראו עוד' : 'READ MORE'}
          </button>
        </div>
      </section>

      {/* 5. PAINTING AS A PATH — text left, image right, light bg */}
      <section className="split-section split-light">
        <div className="split-text split-text-light reveal">
          <span className="split-label split-label-light">{isHe ? 'ציור וריפוי' : 'SOUL PAINTING'}</span>
          <h2 className="split-heading split-heading-light">{t.home.healingTitle}</h2>
          <div className="gold-bar" />
          <p className="split-body split-body-light">{t.home.healingText}</p>
          <button className="btn-dark" onClick={() => go('contact')}>
            {isHe ? 'הזמינו יצירה' : 'COMMISSION A WORK'}
          </button>
        </div>
        <div className="split-image reveal">
          <img src="/images/torah.jpg" alt="Torah" className="split-img split-img-contain" />
        </div>
      </section>

      {/* 6. ACQUIRE — full bleed image bg, centered text */}
      <section className="acquire-section">
        <img src="/images/angel.jpg" alt="" className="acquire-bg" aria-hidden="true" />
        <div className="acquire-overlay" />
        <div className="acquire-content reveal">
          <span className="acquire-label">{isHe ? 'לאספנים' : 'FOR COLLECTORS'}</span>
          <h2 className="acquire-title">{isHe ? 'רכישת יצירה מקורית' : 'Acquire an Original Work'}</h2>
          <div className="gold-bar center" />
          <p className="acquire-body">{t.home.collectText}</p>
          <button className="btn-gold" onClick={() => go('contact')}>
            {isHe ? 'צרו קשר' : 'GET IN TOUCH'}
          </button>
        </div>
      </section>

    </main>
  );
};

export default HomePage;
