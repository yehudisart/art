import React, { useEffect } from 'react';
import { artworks } from '../translations';
import './HomePage.css';

const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
      { threshold: 0.10 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
};

const HomePage = ({ t, onNavigate }) => {
  useReveal();
  const isHe = t.lang === 'he';
  const go = (page) => { onNavigate(page); window.scrollTo({ top: 0 }); };

  // First 3 paintings for homepage preview
  const preview = artworks.slice(0, 3);

  return (
    <main className="hp" dir={t.dir}>

      {/* ══════════════════════════════════════════════════
          1. HERO — full-bleed first painting + title
         ══════════════════════════════════════════════════ */}
      <section className="hp__hero">
        {/* First painting fills the entire hero */}
        <div className="hp__hero-img">
          <img src={artworks[0].image} alt="" aria-hidden="true" />
          <div className="hp__hero-veil" />
        </div>

        <div className="hp__hero-content">
          {/* Artist name */}
          <div className="hp__hero-name">
            <img src="/images/logo.png" alt="Yehudis Jacobs" className="hp__hero-sig" />
            <span className="hp__hero-jacobs">Jacobs</span>
          </div>

          {/* Location line */}
          <p className="hp__hero-sub">{t.home.heroSubtitle}</p>

          {/* Tagline */}
          <p className="hp__hero-tag">{t.home.videoTagline}</p>

          {/* CTAs */}
          <div className="hp__hero-ctas">
            <button className="btn btn--white" onClick={() => go('gallery')}>{t.home.heroCta}</button>
            <button className="btn btn--white" style={{ background: 'transparent' }} onClick={() => go('about')}>{t.home.heroCtaAbout}</button>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="hp__scroll-cue" aria-hidden="true">
          <div className="hp__scroll-line" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          2. ARTIST STATEMENT — full-width quote
         ══════════════════════════════════════════════════ */}
      <section className="hp__statement">
        <div className="container">
          <blockquote className="hp__quote reveal reveal--slow">
            <p className="hp__quote-text">"{t.home.quoteText}"</p>
            <cite className="hp__quote-cite">{t.home.quoteAuthor}</cite>
          </blockquote>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          3. THREE PAINTINGS — staggered large preview
         ══════════════════════════════════════════════════ */}
      <section className="hp__works">
        <div className="container">
          <div className="hp__works-header reveal">
            <span className="t-label">{t.home.featuredLabel}</span>
            <h2 className="t-heading">{t.home.featuredTitle}</h2>
          </div>

          <div className="hp__works-grid">
            {preview.map((work, i) => (
              <div
                key={work.id}
                className={`hp__work reveal`}
                style={{ transitionDelay: `${i * 120}ms` }}
                onClick={() => go('gallery')}
              >
                <div className="hp__work-img">
                  <img src={work.image} alt={isHe ? work.titleHe : work.titleEn} />
                  <div className="hp__work-overlay">
                    <span className="hp__work-cta">{isHe ? 'לצפייה' : 'View'}</span>
                  </div>
                </div>
                <div className="hp__work-meta">
                  <p className="hp__work-title">{isHe ? work.titleHe : work.titleEn}</p>
                  <p className="hp__work-detail">{isHe ? work.mediumHe : work.mediumEn} · {work.dims}</p>
                  {(isHe ? work.storyHe : work.storyEn) && (
                    <p className="hp__work-teaser">
                      {(isHe ? work.storyHe : work.storyEn).substring(0, 80)}…
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="hp__works-cta reveal">
            <button className="btn btn--ghost" onClick={() => go('gallery')}>{t.home.featuredCta}</button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          4. ABOUT — painting + text, dark bg
         ══════════════════════════════════════════════════ */}
      <section className="hp__about">
        <div className="hp__about-painting">
          <img src={artworks[4].image} alt="" aria-hidden="true" />
        </div>
        <div className="hp__about-text">
          <span className="t-label" style={{ color: 'rgba(255,255,255,0.35)' }}>{t.home.storyLabel}</span>
          <h2 className="t-heading t-heading--light hp__about-heading">{t.home.storyTitle}</h2>
          <div className="g-rule" />
          <p className="hp__about-body">{t.home.storyText}</p>
          <p className="hp__about-body" style={{ marginTop: 0 }}>{t.home.storyText2}</p>
          <button className="btn btn--white" onClick={() => go('about')} style={{ marginTop: '8px' }}>{t.home.heroCtaAbout}</button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          5. HEALING / ART THERAPY — light section
         ══════════════════════════════════════════════════ */}
      <section className="hp__healing">
        <div className="container">
          <div className="hp__healing-grid">
            <div className="hp__healing-text reveal">
              <span className="t-label">{t.home.healingLabel}</span>
              <h2 className="t-heading">{t.home.healingTitle}</h2>
              <div className="g-rule" />
              <p className="t-body">{t.home.healingText}</p>
              <button className="btn btn--dark" onClick={() => go('contact')} style={{ marginTop: '28px' }}>
                {t.home.healingCta}
              </button>
            </div>
            <div className="hp__healing-img reveal" style={{ transitionDelay: '150ms' }}>
              <img src={artworks[1].image} alt="" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          6. COLLECT — full dark CTA
         ══════════════════════════════════════════════════ */}
      <section className="hp__collect">
        {/* Third painting as background */}
        <div className="hp__collect-bg">
          <img src={artworks[2].image} alt="" aria-hidden="true" />
          <div className="hp__collect-veil" />
        </div>
        <div className="hp__collect-content reveal">
          <span className="t-label" style={{ color: 'rgba(255,255,255,0.35)' }}>{t.home.collectLabel}</span>
          <h2 className="t-heading t-heading--light t-heading--xl hp__collect-heading">{t.home.collectTitle}</h2>
          <div className="g-rule g-rule--center" />
          <p className="hp__collect-text">{t.home.collectText}</p>
          <button className="btn btn--gold" onClick={() => go('contact')}>{t.home.collectCta}</button>
        </div>
      </section>

    </main>
  );
};
export default HomePage;
