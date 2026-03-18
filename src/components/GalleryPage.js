import React, { useEffect, useState, useCallback } from 'react';
import { artworks } from '../translations';
import './GalleryPage.css';

// ── Scroll reveal ────────────────────────────────────────────
const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
};

// ── Lightbox component ───────────────────────────────────────
const Lightbox = ({ work, isHe, t, onClose, onPrev, onNext }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') isHe ? onPrev() : onNext();
      if (e.key === 'ArrowLeft')  isHe ? onNext() : onPrev();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext, isHe]);

  if (!work) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Artwork viewer">

      {/* Close */}
      <button className="lb-close" onClick={onClose} aria-label="Close">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="20" y1="4" x2="4"  y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Prev */}
      <button className="lb-nav lb-prev" onClick={(e) => { e.stopPropagation(); onPrev(); }} aria-label="Previous">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
          <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Main content — stop propagation so clicking image/caption doesn't close */}
      <div className="lb-content" onClick={e => e.stopPropagation()}>
        <div className="lb-image-wrap">
          <img
            src={work.image}
            alt={isHe ? work.titleHe : work.titleEn}
            className="lb-image"
          />
        </div>
        <div className="lb-caption">
          <p className="lb-title">{isHe ? work.titleHe : work.titleEn}</p>
          <p className="lb-meta">
            {isHe ? work.mediumHe : work.mediumEn} &nbsp;·&nbsp; {work.dims} &nbsp;·&nbsp; {work.year}
          </p>
          {work.available
            ? <span className="lb-badge avail">{t.gallery.available}</span>
            : <span className="lb-badge sold">{t.gallery.soldLabel}</span>
          }
        </div>
      </div>

      {/* Next */}
      <button className="lb-nav lb-next" onClick={(e) => { e.stopPropagation(); onNext(); }} aria-label="Next">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
          <polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

    </div>
  );
};

// ── Gallery Page ─────────────────────────────────────────────
const GalleryPage = ({ t, onNavigate }) => {
  useReveal();
  const isHe = t.lang === 'he';
  const go = (page) => { onNavigate(page); window.scrollTo({ top: 0 }); };

  const [lightboxIndex, setLightboxIndex] = useState(null);
  const openLightbox  = useCallback((i) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(() => setLightboxIndex(i => (i - 1 + artworks.length) % artworks.length), []);
  const nextImage = useCallback(() => setLightboxIndex(i => (i + 1) % artworks.length), []);

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

      {/* ══ CHESS GRID ══════════════════════════════════════ */}
      <section className="chess-section">
        {artworks.map((work, i) => {
          const isEven = i % 2 === 0;
          return (
            <article key={work.id} className={`chess-row ${isEven ? 'even' : 'odd'} reveal`}>

              {/* ── IMAGE PANEL ── */}
              <div className="chess-image">
                {/* Clickable image wrapper — opens lightbox */}
                <div
                  className="chess-img-btn"
                  onClick={() => openLightbox(i)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Enlarge: ${isHe ? work.titleHe : work.titleEn}`}
                  onKeyDown={e => e.key === 'Enter' && openLightbox(i)}
                >
                  {/*
                    ← REPLACE: swap src with your real image.
                    e.g. import img1 from '../images/work-1.jpg'
                    then: src={img1}
                  */}
                  <img
                    src={work.image}
                    alt={isHe ? work.titleHe : work.titleEn}
                    className="chess-img"
                  />
                  {/* Zoom hint on hover */}
                  <div className="chess-zoom-hint" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/>
                      <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="11" y1="8"  x2="11" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="8"  y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span>{isHe ? 'להגדלה' : 'Enlarge'}</span>
                  </div>
                </div>

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
                  <p className="chess-number">{String(i + 1).padStart(2, '0')}</p>
                  <h2 className="chess-title">{isHe ? work.titleHe : work.titleEn}</h2>
                  <p className="chess-meta">
                    {isHe ? work.mediumHe : work.mediumEn} · {work.dims} · {work.year}
                  </p>
                  <div className="gold-rule" />
                  <p className="chess-story-text">{isHe ? work.storyHe : work.storyEn}</p>
                  <button className="btn-primary chess-cta" onClick={() => go('contact')}>
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

      {/* ══ LIGHTBOX ══════════════════════════════════════ */}
      {lightboxIndex !== null && (
        <Lightbox
          work={artworks[lightboxIndex]}
          isHe={isHe}
          t={t}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}

    </main>
  );
};

export default GalleryPage;
