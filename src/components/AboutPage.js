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
    <main className="ap" dir={t.dir}>
      <section className="ap__head">
        <div className="container">
          <span className="t-label">{t.about.pageLabel}</span>
          <h1 className="t-heading t-heading--xl ap__title">{t.about.pageTitle}</h1>
          <div className="g-rule g-rule--center" />
        </div>
      </section>

      <section className="ap__bio">
        <div className="container">
          <div className="ap__bio-grid">
            <div className="ap__portrait reveal">
              <img src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=700&q=80" alt="Yehudis Jacobs" className="ap__portrait-img" />
              {/* ← REPLACE: <img src="/images/portrait.jpg" alt="Yehudis Jacobs" className="ap__portrait-img" /> */}
              <p className="ap__portrait-cap">{isHe ? 'יהודית ג׳קובס · ירושלים' : 'Yehudis Jacobs · Jerusalem'}</p>
            </div>
            <div className="ap__bio-text reveal" style={{ transitionDelay: '120ms' }}>
              <span className="t-label">{isHe ? 'ביוגרפיה' : 'Biography'}</span>
              <h2 className="ap__bio-name">{isHe ? 'יהודית ג׳קובס' : 'Yehudis Jacobs'}</h2>
              <div className="g-rule" />
              {[t.about.bio1, t.about.bio2, t.about.bio3, t.about.bio4].map((p, i) => (
                <p key={i} className="t-body ap__para">{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ap__edu">
        <div className="container">
          <div className="ap__edu-inner reveal">
            <span className="t-label" style={{ color: 'rgba(255,255,255,0.32)' }}>{t.about.eduLabel}</span>
            <div className="ap__edu-list">
              {[t.about.edu1, t.about.edu2, t.about.edu3].map((item, i) => (
                <div key={i} className="ap__edu-item">
                  <span className="ap__edu-num">{String(i + 1).padStart(2, '0')}</span>
                  <p className="ap__edu-text">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ap__statement">
        <div className="container">
          <div className="ap__statement-inner">
            <div className="reveal">
              <span className="t-label">{t.about.statementLabel}</span>
              <h2 className="t-heading">{t.about.statementTitle}</h2>
              <div className="g-rule" />
            </div>
            {[t.about.s1, t.about.s2, t.about.s3, t.about.s4].map((para, i) => (
              <p key={i} className={`ap__s-para reveal ${i === 0 ? 'ap__s-lead' : ''}`} style={{ transitionDelay: `${i * 80}ms` }}>
                {para}
              </p>
            ))}
            <div className="ap__sig reveal">
              <svg viewBox="0 0 60 12" width="60"><line x1="0" y1="6" x2="20" y2="6" stroke="var(--gold)" strokeWidth="0.7" opacity="0.5"/><circle cx="30" cy="6" r="2" fill="none" stroke="var(--gold)" strokeWidth="0.7" opacity="0.5"/><line x1="40" y1="6" x2="60" y2="6" stroke="var(--gold)" strokeWidth="0.7" opacity="0.5"/></svg>
              <p className="ap__sig-name">{isHe ? 'יהודית ג׳קובס · ירושלים' : 'Yehudis Jacobs · Jerusalem'}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
export default AboutPage;
