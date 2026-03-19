import React, { useEffect, useState, useCallback } from 'react';
import { artworks } from '../translations';
import './GalleryPage.css';

const useReveal = () => {
  useEffect(() => {
    const run = () => {
      const els = document.querySelectorAll('.rv');
      const io = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } }),
        { threshold: 0.06 }
      );
      els.forEach(el => io.observe(el));
      return () => io.disconnect();
    };
    const t = setTimeout(run, 80);
    return () => clearTimeout(t);
  }, []);
};

// Split artworks into 3 tabs
const tabs = {
  soul:  [0, 1, 2],   // har-sinai, torah, angel
  story: [3, 4],      // hasidim, tefila
  light: [5, 6, 7],   // remaining
};

const Modal = ({ work, isHe, t, onClose, onPrev, onNext }) => {
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
    <div className="modal open" onClick={onClose}>
      <button className="modal-x" onClick={onClose}>Close ✕</button>
      <div className="modal-in" onClick={e => e.stopPropagation()}>
        <img src={work.image} alt={isHe ? work.titleHe : work.titleEn} className="modal-art" />
        <div className="modal-meta">
          <span className="m-cat">{isHe ? 'יצירה מקורית' : 'Original Work'}</span>
          <h2 className="m-title">{isHe ? work.titleHe : work.titleEn}</h2>
          {isHe
            ? <p className="m-he">{work.titleEn}</p>
            : <p className="m-he">{work.titleHe}</p>
          }
          <div className="m-rule" />
          <div className="m-sp"><span className="m-lbl">{isHe ? 'טכניקה' : 'Medium'}</span><span className="m-val">{isHe ? work.mediumHe : work.mediumEn}</span></div>
          <div className="m-sp"><span className="m-lbl">{isHe ? 'מידות' : 'Dimensions'}</span><span className="m-val">{work.dims}</span></div>
          <div className="m-sp"><span className="m-lbl">{isHe ? 'שנה' : 'Year'}</span><span className="m-val">{work.year}</span></div>
          <div className="m-sp"><span className="m-lbl">{isHe ? 'זמינות' : 'Status'}</span>
            <span className="m-val">{work.available ? (isHe ? 'זמין' : 'Available') : (isHe ? 'נמכר' : 'Sold')}</span>
          </div>
          {(isHe ? work.storyHe : work.storyEn) && <>
            <span className="m-story-lbl">{isHe ? 'על היצירה' : 'About This Work'}</span>
            <p className="m-poem">{isHe ? work.storyHe : work.storyEn}</p>
          </>}
          <a className="m-cta" href="mailto:yehudisfineartgallery@gmail.com">
            {isHe ? 'פנייה לגבי יצירה זו' : 'Inquire About This Work'}
          </a>
          <div className="modal-nav">
            <button className="modal-nav-btn" onClick={onPrev}>←</button>
            <button className="modal-nav-btn" onClick={onNext}>→</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const GalleryPage = ({ t, onNavigate }) => {
  useReveal();
  const isHe = t.lang === 'he';
  const go = page => { onNavigate(page); window.scrollTo({ top: 0 }); };
  const [activeTab, setActiveTab] = useState('soul');
  const [modalIdx, setModalIdx] = useState(null);
  const [modalList, setModalList] = useState([]);

  const openModal = useCallback((list, idx) => { setModalList(list); setModalIdx(idx); }, []);
  const closeModal = useCallback(() => setModalIdx(null), []);
  const prevModal = useCallback(() => setModalIdx(i => (i - 1 + modalList.length) % modalList.length), [modalList]);
  const nextModal = useCallback(() => setModalIdx(i => (i + 1) % modalList.length), [modalList]);

  const tabWorks = tabs[activeTab].map(i => artworks[i]).filter(Boolean);

  return (
    <main className="gal-page" dir={t.dir}>

      {/* Header */}
      <div className="gal-head">
        <span className="g-eyebrow">{isHe ? 'יצירות מקוריות' : 'Original Works'}</span>
        <h1 className="g-title">{isHe ? 'גלריה' : 'Gallery'}</h1>
        <p className="g-sub">{isHe ? 'זמין לרכישה פרטית · כל יצירה ייחודית' : 'Available for private acquisition · Each work unique'}</p>
        <div className="g-tabs">
          {['soul','story','light'].map(tab => (
            <button key={tab} className={`g-tab ${activeTab === tab ? 'on' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab === 'soul'  ? (isHe ? 'נשמה' : 'Soul')  : ''}
              {tab === 'story' ? (isHe ? 'סיפור' : 'Story') : ''}
              {tab === 'light' ? (isHe ? 'אור'   : 'Light') : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry grid */}
      <div className="g-grid">
        {tabWorks.map((work, i) => {
          const cls = i === 0 && activeTab === 'soul' ? 'tall' : i === 0 && activeTab === 'story' ? 'wide' : '';
          return (
            <div key={work.id} className={`gc rv ${cls} d${i}`} onClick={() => openModal(tabWorks, i)}>
              <img src={work.image} alt={isHe ? work.titleHe : work.titleEn} className="gc-img" />
              <div className="gc-hov">
                <div className="gc-info">
                  <span className="gc-title">{isHe ? work.titleHe : work.titleEn}</span>
                  <span className="gc-med">{isHe ? work.mediumHe : work.mediumEn} · {work.dims}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Story cards */}
      <div className="stories">
        <div className="st-head">
          <span className="st-eyebrow">{isHe ? 'מאחורי הבד' : 'Behind the Canvas'}</span>
          <h3 className="st-title">{isHe ? 'לכל יצירה יש סיפור' : 'Every Work Has a Story'}</h3>
        </div>
        <div className="st-grid">
          {tabWorks.map((work, i) => (
            <div key={work.id} className={`sc rv d${i}`} onClick={() => openModal(tabWorks, i)}>
              <div className="sc-img-wrap">
                <img src={work.image} alt={isHe ? work.titleHe : work.titleEn} className="sc-img" />
              </div>
              <div className="sc-body">
                <span className="sc-n">{String(i + 1).padStart(2,'0')}</span>
                <div className="sc-ttl">{isHe ? work.titleHe : work.titleEn}</div>
                <span className="sc-m">{isHe ? work.mediumHe : work.mediumEn} · {work.dims}</span>
                {(isHe ? work.storyHe : work.storyEn) &&
                  <p className="sc-story">{(isHe ? work.storyHe : work.storyEn).substring(0, 110)}…</p>
                }
                <button className="sc-cta">{isHe ? 'פנייה' : 'Inquire'}</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Acquire band */}
      <div className="gal-acquire">
        <span className="acq-eyebrow">{isHe ? 'לאספנים' : 'For Collectors'}</span>
        <h2 className="acq-title">{isHe ? 'רכישת יצירה מקורית' : 'Acquire an Original Work'}</h2>
        <div className="acq-rule" />
        <p className="acq-body">{isHe
          ? 'כל ציור הוא יצירה מקורית ויחידה. יהודית עובדת עם אספנים פרטיים ומעצבי פנים ברחבי העולם.'
          : 'Each painting is singular and original — never reproduced. Yehudis works with private collectors and designers worldwide.'
        }</p>
        <button className="acq-link" onClick={() => go('contact')}>
          {isHe ? 'צרו קשר' : 'Get in Touch'}
        </button>
      </div>

      {/* Modal */}
      {modalIdx !== null && (
        <Modal work={modalList[modalIdx]} isHe={isHe} t={t}
          onClose={closeModal} onPrev={prevModal} onNext={nextModal} />
      )}
    </main>
  );
};

export default GalleryPage;
