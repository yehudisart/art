import React, { useEffect } from 'react';
import './AboutPage.css';

const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      e => e.forEach(x => { if (x.isIntersecting) { x.target.classList.add('visible'); io.unobserve(x.target); } }),
      { threshold: 0.1 }
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

      <section className="ap-hero">
        <div className="container">
          <span className="ap-hero-label">{t.about.pageLabel}</span>
          <h1 className="ap-hero-title">{t.about.pageTitle}</h1>
          <hr className="ap-gold-rule" />
        </div>
      </section>

      <section className="ap-bio">
        <div className="container">
          <div className="ap-grid">
            <div className="ap-portrait reveal">
              {/* ← REPLACE: <img src="/images/portrait.jpg" alt="Yehudis Jacobs" className="ap-portrait-img" /> */}
              <img
                src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=700&q=80"
                alt="Yehudis Jacobs"
                className="ap-portrait-img"
              />
              <p className="ap-portrait-cap">{isHe ? 'יהודית ג׳קובס · ירושלים' : 'Yehudis Jacobs · Jerusalem'}</p>
            </div>
            <div className="ap-bio-text reveal" style={{ transitionDelay: '120ms' }}>
              <span className="ap-bio-label">{isHe ? 'ביוגרפיה' : 'Biography'}</span>
              <h2 className="ap-bio-name">{isHe ? 'יהודית ג׳קובס' : 'Yehudis Jacobs'}</h2>
              <hr className="ap-divider" />
              {[t.about.bio1, t.about.bio2, t.about.bio3, t.about.bio4].map((p, i) => (
                <p key={i} className="ap-para">{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ap-edu">
        <div className="container">
          <div className="ap-edu-inner reveal">
            <span className="ap-edu-label">{t.about.eduLabel}</span>
            <div className="ap-edu-list">
              {[t.about.edu1, t.about.edu2, t.about.edu3].map((item, i) => (
                <div key={i} className="ap-edu-item">
                  <span className="ap-edu-num">{String(i + 1).padStart(2, '0')}</span>
                  <p className="ap-edu-text">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ap-statement">
        <div className="container">
          <div className="ap-statement-inner">
            <div className="reveal">
              <span className="ap-statement-label">{t.about.statementLabel}</span>
              <h2 className="ap-statement-heading">{t.about.statementTitle}</h2>
              <hr className="ap-s-rule" />
            </div>
            <div className="ap-s-paras">
              {[t.about.s1, t.about.s2, t.about.s3, t.about.s4].map((para, i) => (
                <p key={i} className={`ap-s-para reveal ${i === 0 ? 'ap-s-lead' : ''}`} style={{ transitionDelay: `${i * 80}ms` }}>
                  {para}
                </p>
              ))}
            </div>
            <div className="ap-sig reveal">
              <svg viewBox="0 0 60 12" width="60" height="12">
                <line x1="0" y1="6" x2="20" y2="6" stroke="#C9A84C" strokeWidth="0.7" opacity="0.5"/>
                <circle cx="30" cy="6" r="2" fill="none" stroke="#C9A84C" strokeWidth="0.7" opacity="0.5"/>
                <line x1="40" y1="6" x2="60" y2="6" stroke="#C9A84C" strokeWidth="0.7" opacity="0.5"/>
              </svg>
              <p className="ap-sig-name">{isHe ? 'יהודית ג׳קובס · ירושלים' : 'Yehudis Jacobs · Jerusalem'}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
export default AboutPage;
