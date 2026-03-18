import React, { useEffect } from 'react';
import { artworks } from '../translations';
import './GalleryPage.css';

const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
};

const GalleryPage = ({ t, onNavigate }) => {
  useReveal();
  const isHe = t.lang === 'he';

  const go = (page) => { onNavigate(page); window.scrollTo({ top: 0 }); };

  return (
    <main className="gallery-page" dir={t.dir}>

      {/* Page header */}
      <section className="gallery-hero">
        <div className="container">
          <span className="label-tag gallery-label">{t.gallery.pageLabel}</span>
          <h1 className="gallery-title">{t.gallery.pageTitle}</h1>
          <div className="gold-rule center" />
          <p className="gallery-intro">{t.gallery.intro}</p>
        </div>
      </section>

      {/* ══ CHESS GRID — alternating image / story ══════════ */}
      <section className="chess-section">
        {artworks.map((work, i) => {
          /*
            Even index (0,2,4…): image LEFT  / text RIGHT
            Odd index  (1,3,5…): image RIGHT / text LEFT
            In RTL, this naturally mirrors. We use CSS order.
          */
          const isEven = i % 2 === 0;

          return (
            <article key={work.id} className={`chess-row ${isEven ? 'even' : 'odd'} reveal`}>

              {/* ── IMAGE PANEL ── */}
              <div className="chess-image">
                {/*
                  ← REPLACE: swap src with real image.
                  import work1 from '../images/work-1.jpg'
                  then: src={work1}
                */}
                <img
                  src={work.image}
                  alt={isHe ? work.titleHe : work.titleEn}
                  className="chess-img"
                />
                {/* Availability badge */}
                <div className="chess-badge">
                  {work.available
                    ? <span className="badge-avail">{t.gallery.available}</span>
                    : <span className="badge-sold">{t.gallery.soldLabel}</span>
                  }
                </div>
              </div>

              {/* ── STORY PANEL ── */}
              <div className="chess-story">
                <div className="chess-story-inner">
                  <p className="chess-number">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h2 className="chess-title">
                    {isHe ? work.titleHe : work.titleEn}
                  </h2>
                  <p className="chess-meta">
                    {/* ← Replace with real medium and dimensions */}
                    {isHe ? work.mediumHe : work.mediumEn} · {work.dims} · {work.year}
                  </p>
                  <div className="gold-rule" />
                  <p className="chess-story-text">
                    {/* ← Replace with real story */}
                    {isHe ? work.storyHe : work.storyEn}
                  </p>
                  <button
                    className="btn-primary chess-cta"
                    onClick={() => go('contact')}
                  >
                    {t.gallery.inquireCta}
                  </button>
                </div>
              </div>

            </article>
          );
        })}
      </section>

      {/* Bottom CTA */}
      <section className="gallery-bottom">
        <div className="container">
          <div className="gallery-bottom-inner reveal">
            <p className="gallery-bottom-text">
              {isHe
                ? 'מעוניינים ביצירה? כל ציור ייחודי ומקורי. אשמח לשמוע מכם.'
                : 'Every work is singular and original. Inquiries from collectors and galleries are welcome.'}
            </p>
            <button className="btn-primary" onClick={() => go('contact')}>{t.nav.contact}</button>
          </div>
        </div>
      </section>

    </main>
  );
};

export default GalleryPage;
