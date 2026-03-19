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
      { threshold: 0.12 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
};

const HomePage = ({ t, onNavigate }) => {
  useReveal();
  const isHe = t.lang === 'he';
  const go = page => { onNavigate(page); window.scrollTo({ top: 0 }); };
  const preview = artworks.slice(0, 3);

  return (
    <main className="home-page" dir={t.dir}>

      {/* ── VIDEO HERO ── */}
      <section className="video-hero">
        <div className="video-wrap">
          <div className="video-placeholder">
            <div className="video-placeholder-inner">
              {/*
                ← REPLACE with your real video:
                Option A — self-hosted:
                  <video autoPlay muted loop playsInline>
                    <source src="/videos/studio.mp4" type="video/mp4" />
                  </video>
                Option B — YouTube (replace YOUR_VIDEO_ID):
                  <iframe
                    src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&mute=1&loop=1&playlist=YOUR_VIDEO_ID&controls=0"
                    className="yt-iframe" title="Studio" frameBorder="0"
                    allow="autoplay; encrypted-media" />
              */}
              {/* Fallback: first painting fills hero until video is set */}
              <img
                src={artworks[0].image}
                alt=""
                aria-hidden="true"
                style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 30%' }}
              />
            </div>
            <div className="video-overlay" />
          </div>
        </div>

        <div className="video-content">
          {/* Signature logo */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'5px', marginBottom:'20px' }}>
            <img
              src="/images/logo.png"
              alt="Yehudis Jacobs"
              style={{ height:'clamp(60px,12vw,108px)', width:'auto', filter:'none', opacity:0.92 }}
            />
            <span className="hero-tagline" style={{ letterSpacing:'0.48em', marginBottom:0 }}>Jacobs</span>
          </div>
          <p className="hero-subtitle">{t.home.heroSubtitle}</p>
          <p className="hero-tagline">{t.home.videoTagline}</p>
          <div className="hero-ctas" style={{ marginTop:'28px' }}>
            <button className="btn-primary" onClick={() => go('gallery')} style={{ background:'transparent', color:'rgba(255,255,255,0.85)', border:'1px solid rgba(255,255,255,0.3)' }}>
              {t.home.heroCta}
            </button>
            <button className="btn-outline hero-outline" onClick={() => go('about')}>
              {t.home.heroCtaAbout}
            </button>
          </div>
        </div>

        <div className="scroll-cue">
          <div className="scroll-cue-line" />
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-image reveal">
              {/* ← REPLACE: <img src="/images/portrait.jpg" alt="Yehudis Jacobs" className="story-img" /> */}
              <img
                src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80"
                alt="Yehudis Jacobs in her studio"
                className="story-img"
              />
              <p className="story-img-caption">{isHe ? 'יהודית ג׳קובס, ירושלים' : 'Yehudis Jacobs, Jerusalem'}</p>
            </div>
            <div className="story-text reveal">
              <span className="label-tag">{t.home.storyLabel}</span>
              <h2 className="section-heading story-heading">{t.home.storyTitle}</h2>
              <hr className="gold-rule" />
              <p className="body-para">{t.home.storyText}</p>
              <p className="body-para">{t.home.storyText2}</p>
              <button className="btn-outline" onClick={() => go('about')}>{t.home.heroCtaAbout}</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section className="quote-section">
        <div className="container">
          <blockquote className="artist-quote reveal">
            <p className="quote-mark">"</p>
            <p className="quote-text">{t.home.quoteText}</p>
            <cite className="quote-author">{t.home.quoteAuthor}</cite>
          </blockquote>
        </div>
      </section>

      {/* ── FEATURED WORKS ── */}
      <section className="featured-section">
        <div className="container">
          <div className="featured-header reveal">
            <span className="label-tag" style={{ textAlign:'center' }}>{t.home.featuredLabel}</span>
            <h2 className="section-heading" style={{ textAlign:'center' }}>{t.home.featuredTitle}</h2>
            <p className="featured-sub">{t.home.featuredSub}</p>
          </div>
          <div className="featured-grid">
            {preview.map((work, i) => (
              <div
                key={work.id}
                className="featured-card reveal"
                style={{ transitionDelay:`${i * 100}ms` }}
                onClick={() => go('gallery')}
              >
                <div className="featured-img-wrap">
                  <img src={work.image} alt={isHe ? work.titleHe : work.titleEn} />
                  <div className="featured-img-overlay">
                    <span>{isHe ? 'לצפייה' : 'View Work'}</span>
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
                  {(isHe ? work.storyHe : work.storyEn) && (
                    <p className="featured-story-teaser">
                      {(isHe ? work.storyHe : work.storyEn).substring(0, 90)}…
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="featured-cta reveal">
            <button className="btn-outline" onClick={() => go('gallery')}>{t.home.featuredCta}</button>
          </div>
        </div>
      </section>

      {/* ── HEALING ── */}
      <section className="healing-section">
        <div className="container">
          <div className="healing-grid">
            <div className="healing-text reveal">
              <span className="label-tag">{t.home.healingLabel}</span>
              <h2 className="section-heading">{t.home.healingTitle}</h2>
              <hr className="gold-rule" />
              <p className="body-para">{t.home.healingText}</p>
              <button className="btn-primary" onClick={() => go('contact')} style={{ marginTop:'8px' }}>
                {t.home.healingCta}
              </button>
            </div>
            <div className="healing-image reveal" style={{ transitionDelay:'120ms' }}>
              <img src={artworks[1].image} alt="" aria-hidden="true" className="healing-img" />
            </div>
          </div>
        </div>
      </section>

      {/* ── COLLECT CTA ── */}
      <section className="collect-section">
        <div className="collect-inner">
          <div className="collect-content reveal">
            <span className="label-tag collect-label">{t.home.collectLabel}</span>
            <h2 className="collect-heading">{t.home.collectTitle}</h2>
            <hr className="gold-rule center" />
            <p className="collect-text">{t.home.collectText}</p>
            <button className="btn-primary collect-cta" onClick={() => go('contact')}>
              {t.home.collectCta}
            </button>
          </div>
        </div>
      </section>

    </main>
  );
};
export default HomePage;
