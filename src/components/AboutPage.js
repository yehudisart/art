// ============================================================
// ABOUT PAGE
// ============================================================
import React, { useEffect } from 'react';
import './shared.css';
import './AboutPage.css';

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
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

const AboutPage = ({ t }) => {
  useReveal();
  const isHe = t.lang === 'he';

  return (
    <main className="about-page" dir={t.dir}>

      {/* Page header */}
      <section className="page-hero">
        <div className="container">
          <div className="page-hero-inner">
            <h1 className="page-title">{t.about.pageTitle}</h1>
            <div className="page-title-rule" />
          </div>
        </div>
      </section>

      {/* ── BIOGRAPHY ────────────────────────────────────── */}
      <section className="about-bio-section">
        <div className="container">
          <div className="about-grid">

            {/* Portrait placeholder */}
            <div className="about-portrait reveal">
              {/* ← REPLACE: add real portrait image */}
              {/* <img src="/images/portrait.jpg" alt="Yehudis, artist" /> */}
              <div className="portrait-placeholder">
                <span className="portrait-glyph">◈</span>
                {/* ← Replace above with: <img src="/images/portrait.jpg" alt="..." /> */}
              </div>
              {/* Caption under portrait */}
              <p className="portrait-caption">
                {isHe ? 'יהודית, ירושלים' : 'Yehudis, Jerusalem'}
              </p>
            </div>

            {/* Biography text */}
            <div className="about-bio reveal">
              <span className="section-label">
                {isHe ? 'ביוגרפיה' : 'Biography'}
              </span>
              <h2 className="bio-heading">
                {isHe ? 'יהודית' : 'Yehudis'}
              </h2>
              <hr className="divider" style={{ margin: '16px 0 24px' }} />

              <p className="bio-para">{t.about.bioParagraph1}</p>
              <p className="bio-para">{t.about.bioParagraph2}</p>
              <p className="bio-para">{t.about.bioParagraph3}</p>
              <p className="bio-para">{t.about.bioParagraph4}</p>
            </div>

          </div>
        </div>
      </section>

      {/* ── EDUCATION ────────────────────────────────────── */}
      <section className="about-education-section">
        <div className="container">
          <div className="education-inner reveal">
            <span className="section-label">{t.about.education}</span>
            <div className="edu-list">
              {[t.about.edu1, t.about.edu2, t.about.edu3].map((item, i) => (
                <div key={i} className="edu-item">
                  <span className="edu-dot">◦</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ARTIST STATEMENT ─────────────────────────────── */}
      <section className="about-statement-section">
        <div className="container">
          <div className="statement-inner">
            <div className="statement-header reveal">
              <span className="section-label">
                {isHe ? 'הצהרת אמנות' : 'Artist Statement'}
              </span>
              <h2 className="section-heading">{t.about.statementTitle}</h2>
              <div className="page-title-rule" style={{ margin: '20px 0' }} />
            </div>

            <div className="statement-body">
              {[
                t.about.statementText1,
                t.about.statementText2,
                t.about.statementText3,
                t.about.statementText4,
              ].map((para, i) => (
                <p key={i} className="statement-para reveal">
                  {para}
                </p>
              ))}
            </div>

            {/* Closing decorative element */}
            <div className="statement-closing reveal">
              <svg viewBox="0 0 80 20" className="closing-ornament">
                <line x1="0" y1="10" x2="30" y2="10" stroke="#B8963E" strokeWidth="0.8" opacity="0.5" />
                <circle cx="40" cy="10" r="3" fill="none" stroke="#B8963E" strokeWidth="0.8" opacity="0.5" />
                <line x1="50" y1="10" x2="80" y2="10" stroke="#B8963E" strokeWidth="0.8" opacity="0.5" />
              </svg>
              <p className="closing-name">
                {isHe ? 'יהודית · ירושלים' : 'Yehudis · Jerusalem'}
              </p>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
};

export default AboutPage;
