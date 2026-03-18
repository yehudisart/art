// ============================================================
// GALLERY PAGE
// 10 artwork slots — replace placeholders with real works
// ============================================================
import React, { useEffect } from 'react';
import './shared.css';
import './GalleryPage.css';

// ── ARTWORK DATA ────────────────────────────────────────────
// Replace each entry with real artwork details.
// For 'image', use: import work1 from '../images/work-1.jpg'
// then set image: work1
const artworks = [
  // ← REPLACE: slot 1
  { id: 1,  image: null, titleEn: 'Untitled I',   titleHe: 'יצירה א׳',  medium: 'Oil on canvas', mediumHe: 'שמן על בד', dims: '80 × 100 cm', year: '2024' },
  // ← REPLACE: slot 2
  { id: 2,  image: null, titleEn: 'Untitled II',  titleHe: 'יצירה ב׳',  medium: 'Oil on canvas', mediumHe: 'שמן על בד', dims: '60 × 80 cm',  year: '2024' },
  // ← REPLACE: slot 3
  { id: 3,  image: null, titleEn: 'Untitled III', titleHe: 'יצירה ג׳',  medium: 'Mixed media',   mediumHe: 'מדיה מעורבת', dims: '70 × 90 cm',  year: '2023' },
  // ← REPLACE: slot 4
  { id: 4,  image: null, titleEn: 'Untitled IV',  titleHe: 'יצירה ד׳',  medium: 'Oil on canvas', mediumHe: 'שמן על בד', dims: '100 × 120 cm', year: '2023' },
  // ← REPLACE: slot 5
  { id: 5,  image: null, titleEn: 'Untitled V',   titleHe: 'יצירה ה׳',  medium: 'Acrylic',       mediumHe: 'אקריל',     dims: '50 × 70 cm',  year: '2023' },
  // ← REPLACE: slot 6
  { id: 6,  image: null, titleEn: 'Untitled VI',  titleHe: 'יצירה ו׳',  medium: 'Oil on canvas', mediumHe: 'שמן על בד', dims: '80 × 100 cm', year: '2022' },
  // ← REPLACE: slot 7
  { id: 7,  image: null, titleEn: 'Untitled VII', titleHe: 'יצירה ז׳',  medium: 'Mixed media',   mediumHe: 'מדיה מעורבת', dims: '60 × 80 cm',  year: '2022' },
  // ← REPLACE: slot 8
  { id: 8,  image: null, titleEn: 'Untitled VIII',titleHe: 'יצירה ח׳',  medium: 'Oil on canvas', mediumHe: 'שמן על בד', dims: '90 × 110 cm', year: '2022' },
  // ← REPLACE: slot 9
  { id: 9,  image: null, titleEn: 'Untitled IX',  titleHe: 'יצירה ט׳',  medium: 'Oil on canvas', mediumHe: 'שמן על בד', dims: '60 × 80 cm',  year: '2021' },
  // ← REPLACE: slot 10
  { id: 10, image: null, titleEn: 'Untitled X',   titleHe: 'יצירה י׳',  medium: 'Mixed media',   mediumHe: 'מדיה מעורבת', dims: '70 × 90 cm',  year: '2021' },
];

const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

const GalleryPage = ({ t, onNavigate }) => {
  useReveal();
  const isHe = t.lang === 'he';

  return (
    <main className="gallery-page" dir={t.dir}>

      {/* Page header */}
      <section className="page-hero">
        <div className="container">
          <div className="page-hero-inner">
            <h1 className="page-title">{t.gallery.pageTitle}</h1>
            <div className="page-title-rule" />
            <p className="page-intro">{t.gallery.intro}</p>
          </div>
        </div>
      </section>

      {/* Gallery grid */}
      <section className="gallery-grid-section">
        <div className="container">
          <div className="gallery-grid">
            {artworks.map((work, i) => (
              <article
                key={work.id}
                className={`artwork-card reveal`}
                style={{ transitionDelay: `${(i % 3) * 80}ms` }}
              >
                {/* Image area */}
                <div className="artwork-img-wrap">
                  {work.image ? (
                    // ← Real image renders here when added
                    <img src={work.image} alt={isHe ? work.titleHe : work.titleEn} />
                  ) : (
                    // Placeholder
                    <div className="artwork-placeholder">
                      <span className="placeholder-glyph-lg">◈</span>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="artwork-overlay">
                    <button
                      className="overlay-inquire"
                      onClick={() => { onNavigate('contact'); window.scrollTo({ top: 0 }); }}
                    >
                      {t.gallery.inquire}
                    </button>
                  </div>
                </div>

                {/* Metadata */}
                <div className="artwork-meta">
                  <h3 className="artwork-title">
                    {/* ← Replace: real artwork title */}
                    {isHe ? work.titleHe : work.titleEn}
                  </h3>
                  <p className="artwork-detail">
                    {/* ← Replace: real medium */}
                    {isHe ? work.mediumHe : work.medium}
                  </p>
                  <p className="artwork-detail muted">
                    {/* ← Replace: real dimensions */}
                    {work.dims}
                  </p>
                  <p className="artwork-year">
                    {/* ← Replace: real year */}
                    {work.year}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="gallery-bottom">
        <div className="container">
          <div className="gallery-bottom-inner reveal">
            <p className="gallery-cta-text">
              {isHe
                ? 'מעוניינים ביצירה? אשמח לשמוע מכם.'
                : 'Interested in a work? I would be glad to hear from you.'}
            </p>
            <button
              className="btn-primary"
              onClick={() => { onNavigate('contact'); window.scrollTo({ top: 0 }); }}
            >
              {t.nav.contact}
            </button>
          </div>
        </div>
      </section>

    </main>
  );
};

export default GalleryPage;
