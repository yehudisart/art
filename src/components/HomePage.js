// ============================================================
// HOME PAGE
// ============================================================
import React, { useEffect } from 'react';
import './shared.css';
import './HomePage.css';

// Hook: trigger reveal animation on scroll
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
      { threshold: 0.15 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

// Decorative brushstroke SVG divider
const BrushDivider = () => (
  <svg className="brush-divider" viewBox="0 0 120 8" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2 4 C20 1, 40 7, 60 4 C80 1, 100 7, 118 4"
      stroke="#B8963E"
      strokeWidth="1"
      fill="none"
      opacity="0.55"
      strokeLinecap="round"
    />
  </svg>
);

const HomePage = ({ t, onNavigate }) => {
  useReveal();

  return (
    <main className="home-page" dir={t.dir}>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="hero">
        {/* Texture overlay */}
        <div className="hero-texture" />

        <div className="hero-content container">
          <p className="hero-tagline reveal">{t.home.heroTagline}</p>

          <h1 className="hero-title reveal">
            {t.home.heroTitle}
          </h1>

          <p className="hero-subtitle reveal">{t.home.heroSubtitle}</p>

          <BrushDivider />

          <p className="hero-intro reveal">{t.home.heroIntro}</p>

          <div className="hero-ctas reveal">
            <button
              className="btn-primary"
              onClick={() => { onNavigate('gallery'); window.scrollTo({ top: 0 }); }}
            >
              {t.home.ctaGallery}
            </button>
            <button
              className="btn-outline"
              onClick={() => { onNavigate('about'); window.scrollTo({ top: 0 }); }}
            >
              {t.home.ctaAbout}
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── SECTION 1: Where Painting Meets Presence ──────── */}
      <section className="section-presence">
        <div className="container">
          <div className="presence-grid">
            {/* Left: large placeholder artwork */}
            <div className="presence-image reveal">
              <div className="art-placeholder large">
                {/* ← REPLACE: add real artwork image here */}
                {/* <img src="/images/featured-1.jpg" alt="Featured work" /> */}
                <div className="placeholder-inner">
                  <span className="placeholder-glyph">◈</span>
                </div>
              </div>
            </div>

            {/* Right: text */}
            <div className="presence-text reveal">
              <span className="section-label">
                {t.lang === 'he' ? 'על האמנות' : 'The Work'}
              </span>
              <h2 className="section-heading">{t.home.section1Title}</h2>
              <hr className="divider" style={{ margin: '20px 0' }} />
              <p className="section-body">{t.home.section1Text}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE ─────────────────────────────────────────── */}
      <section className="section-quote">
        <div className="container">
          <blockquote className="artist-quote reveal">
            <p className="quote-text">"{t.home.quoteText}"</p>
            <cite className="quote-author">{t.home.quoteAuthor}</cite>
          </blockquote>
        </div>
      </section>

      {/* ── SECTION 2: Color as Healing ───────────────────── */}
      <section className="section-healing">
        <div className="container">
          <div className="healing-grid">
            {/* Text first (reversed) */}
            <div className="healing-text reveal">
              <span className="section-label">
                {t.lang === 'he' ? 'צבע וריפוי' : 'Art & Healing'}
              </span>
              <h2 className="section-heading">{t.home.section2Title}</h2>
              <hr className="divider" style={{ margin: '20px 0' }} />
              <p className="section-body">{t.home.section2Text}</p>
              <p className="section-body statement-teaser">{t.home.statementTeaser}</p>
            </div>

            {/* Right: placeholder artwork */}
            <div className="healing-image reveal">
              <div className="art-placeholder large">
                {/* ← REPLACE: add real artwork image here */}
                <div className="placeholder-inner">
                  <span className="placeholder-glyph">◈</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED WORKS PREVIEW ────────────────────────── */}
      <section className="section-featured">
        <div className="container">
          <div className="featured-header reveal">
            <h2 className="section-heading centered">{t.home.featuredTitle}</h2>
            <p className="featured-sub">{t.home.featuredSubtitle}</p>
          </div>

          {/* 3 preview cards */}
          <div className="featured-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="featured-card reveal">
                <div className="featured-img-wrap">
                  {/* ← REPLACE: add real artwork image */}
                  {/* <img src={`/images/work-${i}.jpg`} alt="..." /> */}
                  <div className="placeholder-inner small">
                    <span className="placeholder-glyph">◈</span>
                  </div>
                </div>
                <div className="featured-card-meta">
                  {/* ← REPLACE: add real title */}
                  <p className="work-title">
                    {t.gallery.artworkTitle} {i}
                  </p>
                  <p className="work-medium">{t.gallery.artworkMedium}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="featured-cta reveal">
            <button
              className="btn-outline"
              onClick={() => { onNavigate('gallery'); window.scrollTo({ top: 0 }); }}
            >
              {t.nav.gallery}
            </button>
          </div>
        </div>
      </section>

    </main>
  );
};

export default HomePage;
