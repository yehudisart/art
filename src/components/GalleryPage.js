import React, { useEffect, useState, useCallback } from 'react';
import { artworks } from '../translations';
import './GalleryPage.css';

const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (e) => e.forEach(x => { if (x.isIntersecting) { x.target.classList.add('visible'); io.unobserve(x.target); } }),
      { threshold: 0.08 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
};

/* ── Lightbox ── */
const Lightbox = ({ work, isHe, t, onClose, onPrev, onNext }) => {
  useEffect(() => {
    const fn = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') isHe ? onPrev() : onNext();
      if (e.key === 'ArrowLeft')  isHe ? onNext() : onPrev();
    };
    document.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', fn); document.body.style.overflow = ''; };
  }, [onClose, onPrev, onNext, isHe]);
  if (!work) return null;
  return (
    <div className="lb" onClick={onClose} role="dialog" aria-modal="true">
      <button className="lb__close" onClick={onClose} aria-label="Close">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
          <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="20" y1="4" x2="4"  y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
      <button className="lb__nav lb__prev" onClick={e => { e.stopPropagation(); onPrev(); }} aria-label="Previous">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none"><polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <div className="lb__body" onClick={e => e.stopPropagation()}>
        <img src={work.image} alt={isHe ? work.titleHe : work.titleEn} className="lb__img" />
        <div className="lb__cap">
          <p className="lb__title">{isHe ? work.titleHe : work.titleEn}</p>
          <p className="lb__meta">{isHe ? work.mediumHe : work.mediumEn} &nbsp;·&nbsp; {work.dims} &nbsp;·&nbsp; {work.year}</p>
        </div>
      </div>
      <button className="lb__nav lb__next" onClick={e => { e.stopPropagation(); onNext(); }} aria-label="Next">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none"><polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
};

/* ── Page ── */
const GalleryPage = ({ t, onNavigate }) => {
  useReveal();
  const isHe = t.lang === 'he';
  const go = page => { onNavigate(page); window.scrollTo({ top: 0 }); };

  const [lbIdx, setLbIdx] = useState(null);
  const open  = useCallback(i => setLbIdx(i), []);
  const close = useCallback(() => setLbIdx(null), []);
  const prev  = useCallback(() => setLbIdx(i => (i - 1 + artworks.length) % artworks.length), []);
  const next  = useCallback(() => setLbIdx(i => (i + 1) % artworks.length), []);

  return (
    <main className="gp" dir={t.dir}>

      {/* Page header */}
      <section className="gp__head">
        <div className="container">
          <span className="t-label">{t.gallery.pageLabel}</span>
          <h1 className="t-heading t-heading--xl gp__title">{t.gallery.pageTitle}</h1>
          <div className="g-rule g-rule--center" />
          <p className="gp__intro">{t.gallery.intro}</p>
        </div>
      </section>

      {/* Chess grid */}
      <section className="gp__chess">
        {artworks.map((work, i) => {
          const isEven = i % 2 === 0;
          const isDepth = work.id === 1;
          return (
            <article
              key={work.id}
              className={`gp__row ${isEven ? 'even' : 'odd'} ${isDepth ? 'depth' : ''} reveal`}
            >
              {/* Image side */}
              <div className="gp__img-panel">
                <div
                  className={`gp__img-btn ${isDepth ? 'gp__img-btn--depth' : ''}`}
                  onClick={() => open(i)}
                  role="button" tabIndex={0}
                  aria-label={`Enlarge ${isHe ? work.titleHe : work.titleEn}`}
                  onKeyDown={e => e.key === 'Enter' && open(i)}
                >
                  <img
                    src={work.image}
                    alt={isHe ? work.titleHe : work.titleEn}
                    className="gp__img"
                  />
                  <div className="gp__zoom" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.4"/>
                      <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                      <line x1="11" y1="8" x2="11" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                      <line x1="8"  y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>

                {/* Availability */}
                <div className="gp__badge">
                  {work.available
                    ? <span className="gp__badge--avail">{t.gallery.available}</span>
                    : <span className="gp__badge--sold">{t.gallery.soldLabel}</span>
                  }
                </div>
              </div>

              {/* Story side */}
              <div className="gp__story">
                <div className="gp__story-inner">
                  <p className="gp__num">{String(i + 1).padStart(2, '0')}</p>
                  <h2 className="gp__work-title">{isHe ? work.titleHe : work.titleEn}</h2>
                  <p className="gp__work-meta">
                    {isHe ? work.mediumHe : work.mediumEn}&nbsp;·&nbsp;{work.dims}&nbsp;·&nbsp;{work.year}
                  </p>
                  <div className="g-rule" />
                  <p className="gp__work-story">
                    {isHe ? work.storyHe : work.storyEn}
                  </p>
                  {(isHe ? work.titleHe : work.titleEn) && (
                    <button className="btn btn--dark gp__inquire" onClick={() => go('contact')}>
                      {t.gallery.inquireCta}
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Bottom */}
      <section className="gp__foot">
        <div className="container">
          <div className="gp__foot-inner reveal">
            <p className="gp__foot-text">
              {isHe
                ? 'כל יצירה מקורית ויחידה במינה. פניות מאספנים ומגלריות בברכה.'
                : 'Every work is singular and original. Collector and gallery inquiries welcome.'}
            </p>
            <button className="btn btn--dark" onClick={() => go('contact')}>{t.nav.contact}</button>
          </div>
        </div>
      </section>

      {lbIdx !== null && (
        <Lightbox work={artworks[lbIdx]} isHe={isHe} t={t} onClose={close} onPrev={prev} onNext={next} />
      )}
    </main>
  );
};
export default GalleryPage;
