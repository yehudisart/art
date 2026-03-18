import React, { useEffect } from 'react';
import './AboutPage.css';

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

const AboutPage = ({ t }) => {
  useReveal();
  const isHe = t.lang === 'he';

  return (
    <main className="about-page" dir={t.dir}>

      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <span className="label-tag">{t.about.pageLabel}</span>
          <h1 className="about-page-title">{t.about.pageTitle}</h1>
          <div className="gold-rule center" />
        </div>
      </section>

      {/* Bio */}
      <section className="about-bio-section">
        <div className="container">
          <div className="about-grid">

            <div className="about-portrait reveal">
              {/*
                ← REPLACE: <img src="/images/portrait.jpg" alt="Yehudis" className="portrait-img" />
              */}
              <img
                src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=700&q=80"
                alt="Yehudis, artist"
                className="portrait-img"
              />
              <p className="portrait-cap">
                {isHe ? 'יהודית · ירושלים' : 'Yehudis · Jerusalem'}
              </p>
            </div>

            <div className="about-bio reveal">
              <span className="label-tag">{isHe ? 'ביוגרפיה' : 'Biography'}</span>
              <h2 className="bio-name">{isHe ? 'יהודית' : 'Yehudis'}</h2>
              <div className="gold-rule" />
              {[t.about.bio1, t.about.bio2, t.about.bio3, t.about.bio4].map((p, i) => (
                <p key={i} className="bio-para">{p}</p>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Education */}
      <section className="about-edu-section">
        <div className="container">
          <div className="edu-inner reveal">
            <span className="label-tag">{t.about.eduLabel}</span>
            <div className="edu-list">
              {[t.about.edu1, t.about.edu2, t.about.edu3].map((item, i) => (
                <div key={i} className="edu-item">
                  <span className="edu-num">{String(i + 1).padStart(2,'0')}</span>
                  <p className="edu-text">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Artist Statement */}
      <section className="about-statement-section">
        <div className="container">
          <div className="statement-inner">
            <div className="statement-header reveal">
              <span className="label-tag">{t.about.statementLabel}</span>
              <h2 className="section-heading">{t.about.statementTitle}</h2>
              <div className="gold-rule" />
            </div>
            <div className="statement-paras">
              {[t.about.s1, t.about.s2, t.about.s3, t.about.s4].map((para, i) => (
                <p key={i} className={`statement-para reveal ${i === 0 ? 'statement-lead' : ''}`}>
                  {para}
                </p>
              ))}
            </div>
            <div className="statement-sig reveal">
              <svg viewBox="0 0 80 16" className="sig-rule">
                <line x1="0" y1="8" x2="28" y2="8" stroke="#C9A84C" strokeWidth="0.8" opacity="0.5"/>
                <circle cx="40" cy="8" r="2.5" fill="none" stroke="#C9A84C" strokeWidth="0.8" opacity="0.5"/>
                <line x1="52" y1="8" x2="80" y2="8" stroke="#C9A84C" strokeWidth="0.8" opacity="0.5"/>
              </svg>
              <p className="sig-name">{isHe ? 'יהודית · ירושלים' : 'Yehudis · Jerusalem'}</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default AboutPage;
