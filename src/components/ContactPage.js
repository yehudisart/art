import React, { useState, useEffect } from 'react';
import './ContactPage.css';

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

const ContactPage = ({ t }) => {
  useReveal();
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'' });
  const [sent, setSent] = useState(false);
  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = e => {
    e.preventDefault();
    // ← REPLACE: add your form handler here (Formspree / EmailJS / etc.)
    setSent(true);
  };

  return (
    <main className="contact-page" dir={t.dir}>

      <section className="cp-hero">
        <div className="container">
          <span className="cp-hero-label">{t.contact.pageLabel}</span>
          <h1 className="cp-hero-title">{t.contact.pageTitle}</h1>
          <hr className="cp-gold-rule" />
          <p className="cp-intro">{t.contact.intro}</p>
        </div>
      </section>

      <section className="cp-body">
        <div className="container">
          <div className="cp-grid">

            {/* Info */}
            <div className="cp-info reveal">
              <div>
                <span className="cp-invites-label">{t.lang === 'he' ? 'פניות מתקבלות' : 'Open to'}</span>
                <ul className="cp-invite-list">
                  {t.contact.invitations.map((item, i) => (
                    <li key={i} className="cp-invite-item">
                      <span className="cp-invite-num">{String(i+1).padStart(2,'0')}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="cp-details">
                {[
                  { label: t.contact.emailLabel,    value: t.contact.emailValue,    href: `mailto:${t.contact.emailValue}` },
                  { label: t.contact.phoneLabel,     value: t.contact.phoneValue,    href: `tel:${t.contact.phoneValue.replace(/\s/g,'')}` },
                  { label: t.contact.instagramLabel, value: t.contact.instagramValue, href: t.contact.instagramUrl, ext: true },
                  { label: t.contact.locationLabel,  value: t.contact.locationValue,  href: null },
                ].map((row, i) => (
                  <div key={i} className="cp-detail-row">
                    <span className="cp-detail-label">{row.label}</span>
                    {row.href
                      ? <a href={row.href} className="cp-detail-value" target={row.ext ? '_blank' : undefined} rel={row.ext ? 'noopener noreferrer' : undefined}>{row.value}</a>
                      : <span className="cp-detail-value">{row.value}</span>
                    }
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="cp-form-wrap reveal" style={{ transitionDelay: '120ms' }}>
              {sent ? (
                <div className="cp-thanks">
                  <svg viewBox="0 0 52 52" width="52" height="52">
                    <circle cx="26" cy="26" r="24" fill="none" stroke="#C9A84C" strokeWidth="1"/>
                    <path d="M14 26 L22 34 L38 18" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <p className="cp-thanks-text">{t.contact.thankYou}</p>
                </div>
              ) : (
                <form className="cp-form" onSubmit={onSubmit} noValidate>
                  {[
                    { id:'name',  label:t.contact.formName,  type:'text',  req:true  },
                    { id:'email', label:t.contact.formEmail, type:'email', req:true  },
                    { id:'phone', label:t.contact.formPhone, type:'tel',   req:false },
                  ].map(f => (
                    <div key={f.id} className="cp-field">
                      <label htmlFor={f.id} className="cp-label">{f.label}</label>
                      <input id={f.id} name={f.id} type={f.type} required={f.req}
                        className="cp-input" value={form[f.id]} onChange={onChange} />
                    </div>
                  ))}
                  <div className="cp-field">
                    <label htmlFor="message" className="cp-label">{t.contact.formMessage}</label>
                    <textarea id="message" name="message" rows={5} required
                      className="cp-input cp-textarea" value={form.message} onChange={onChange} />
                  </div>
                  <button type="submit" className="btn-primary cp-submit">{t.contact.formSend}</button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </main>
  );
};
export default ContactPage;
