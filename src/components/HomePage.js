import React, { useEffect } from 'react';
import { artworks } from '../translations';
import './HomePage.css';

// Scroll reveal hook
const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
      { threshold: 0.12 }
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

      {/* ══ 1. IMAGE HERO ═══════════════════════════════════ */}
      <section className="video-hero">
        {/* Background image with zoom animation */}
        <img
          src="/images/har-sinai-hero.jpg"
          alt="Har Sinai artwork by Yehudis"
          className="hero-bg-image"
        />
        <div className="video-overlay" />

        {/* Hero content — centered logo layout */}
        <div className="video-content">
          <div className="hero-logo-wrap">
            <img
              src="/images/logo-yehudis.png"
              alt="Yehudis"
              className="hero-logo-img"
            />
            <p className="hero-jacobs">{isHe ? 'יעקובס' : 'JACOBS'}</p>
          </div>
          <p className="hero-subtitle hero-soul">{t.home.heroSubtitle}</p>
          <div className="hero-ctas">
            <button className="btn-outline hero-outline" onClick={() => go('gallery')}>{t.home.heroCta}</button>
            <button className="btn-outline hero-outline" onClick={() => go('about')}>{t.home.heroCtaAbout}</button>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="scroll-cue">
          <div className="scroll-cue-line" />
        </div>
      </section>

      {/* ══ 2. ARTIST STORY ═════════════════════════════════ */}
      <section className="story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-image reveal">
              {/*
                ← REPLACE with real portrait image:
                <img src="/images/portrait.jpg" alt="Yehudis in her studio" />
              */}
              <img
                src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80"
                alt="Artist in studio"
                className="story-img"
              />
              <div className="story-img-caption">
                {isHe ? 'יהודית בסטודיו, ירושלים' : 'Yehudis in her Jerusalem studio'}
              </div>
            </div>
            <div className="story-text reveal">
              <span className="label-tag">{t.home.storyLabel}</span>
              <h2 className="section-heading story-heading">{t.home.storyTitle}</h2>
              <div className="gold-rule" />
              <p className="body-para">{t.home.storyText}</p>
              <p className="body-para">{t.home.storyText2}</p>
              <button className="btn-outline" onClick={() => go('about')}>{t.home.heroCtaAbout}</button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 3. QUOTE BREAK ══════════════════════════════════ */}
      <section className="quote-section">
        <div className="container">
          <blockquote className="artist-quote reveal">
            <p className="quote-mark">"</p>
            <p className="quote-text">{t.home.quoteText}</p>
            <cite className="quote-author">{t.home.quoteAuthor}</cite>
          </blockquote>
        </div>
      </section>

      {/* ══ 4. FEATURED WORKS (3 cards) ═════════════════════ */}
      <section className="featured-section">
        <div className="container">
          <div className="featured-header reveal">
            <span className="label-tag" style={{ textAlign: 'center', display: 'block' }}>{t.home.featuredLabel}</span>
            <h2 className="section-heading" style={{ textAlign: 'center' }}>{t.home.featuredTitle}</h2>
            <p className="featured-sub">{t.home.featuredSub}</p>
          </div>

          <div className="featured-grid">
            {featured.map((work, i) => (
              <div key={work.id} className="featured-card reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="featured-img-wrap" onClick={() => go('gallery')}>
                  <img src={work.image} alt={isHe ? work.titleHe : work.titleEn} />
                  <div className="featured-img-overlay">
                    <span>{isHe ? 'לפרטים' : 'View Work'}</span>
                  </div>
                </div>
                <div className="featured-meta">
                  <div className="featured-meta-top">
                    <p className="featured-title">{isHe ? work.titleHe : work.titleEn}</p>
                    {work.available
                      ? <span className="avail-badge">{t.gallery.available}</span>
                      : <span className="avail-badge sold">{t.gallery.soldLabel}</span>
                    }
                  </div>
                  <p className="featured-detail">{isHe ? work.mediumHe : work.mediumEn} · {work.dims}</p>
                  {/* Short story teaser */}
                  <p className="featured-story-teaser">
                    {(isHe ? work.storyHe : work.storyEn).substring(0, 90)}…
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="featured-cta reveal">
            <button className="btn-primary" onClick={() => go('gallery')}>{t.home.featuredCta}</button>
          </div>
        </div>
      </section>

      {/* ══ 5. HEALING SECTION ══════════════════════════════ */}
      <section className="healing-section">
        <div className="container">
          <div className="healing-grid">
            <div className="healing-text reveal">
              <span className="label-tag">{t.home.healingLabel}</span>
              <h2 className="section-heading">{t.home.healingTitle}</h2>
              <div className="gold-rule" />
              <p className="body-para">{t.home.healingText}</p>
              <button className="btn-outline" onClick={() => go('contact')}>{t.home.healingCta}</button>
            </div>
            <div className="healing-image reveal">
              {/* ← REPLACE with real image */}
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                alt="Paintbrushes and color"
                className="healing-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══ 6. COLLECT CTA ══════════════════════════════════ */}
      <section className="collect-section">
        <div className="collect-inner">
          <div className="collect-content reveal">
            <span className="label-tag collect-label">{t.home.collectLabel}</span>
            <h2 className="collect-heading">{t.home.collectTitle}</h2>
            <div className="gold-rule center" />
            <p className="collect-text">{t.home.collectText}</p>
            <button className="btn-primary collect-cta" onClick={() => go('contact')}>{t.home.collectCta}</button>
          </div>
        </div>
      </section>

    </main>
  );
};

export default HomePage;
