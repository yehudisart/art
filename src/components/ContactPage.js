import React, { useState, useEffect } from 'react';
import './ContactPage.css';

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

const ContactPage = ({ t }) => {
  useReveal();
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'' });
  const [sent, setSent] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    // ← REPLACE: connect to Formspree / EmailJS / your backend here
    // fetch('https://formspree.io/f/YOUR_ID', { method: 'POST', body: JSON.stringify(form) })
    setSent(true);
  };

  return (
    <main className="contact-page" dir={t.dir}>

      <section className="contact-hero">
        <div className="container">
          <span className="label-tag contact-label">{t.contact.pageLabel}</span>
          <h1 className="contact-title">{t.contact.pageTitle}</h1>
          <div className="gold-rule center" />
          <p className="contact-intro">{t.contact.intro}</p>
        </div>
      </section>

      <section className="contact-body">
        <div className="container">
          <div className="contact-grid">

            {/* Info column */}
            <div className="contact-info reveal">
              <div className="info-block">
                <span className="label-tag">{t.lang === 'he' ? 'פניות מתקבלות' : 'Open to'}</span>
                <ul className="invite-list">
                  {t.contact.invitations.map((item, i) => (
                    <li key={i} className="invite-item">
                      <span className="invite-num">{String(i+1).padStart(2,'0')}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="details-block">
                {[
                  { label: t.contact.emailLabel, value: t.contact.emailValue, href: `mailto:${t.contact.emailValue}` },
                  { label: t.contact.phoneLabel, value: t.contact.phoneValue, href: `tel:${t.contact.phoneValue.replace(/\s/g,'')}` },
                  { label: t.contact.instagramLabel, value: t.contact.instagramValue, href: t.contact.instagramUrl, ext: true },
                  { label: t.contact.locationLabel, value: t.contact.locationValue, href: null },
                ].map((row, i) => (
                  <div key={i} className="detail-row">
                    <span className="detail-label">{row.label}</span>
                    {row.href
                      ? <a href={row.href} className="detail-value" target={row.ext ? '_blank' : undefined} rel={row.ext ? 'noopener noreferrer' : undefined}>{row.value}</a>
                      : <span className="detail-value">{row.value}</span>
                    }
                  </div>
                ))}
              </div>
            </div>

            {/* Form column */}
            <div className="contact-form-wrap reveal">
              {sent ? (
                <div className="form-thanks">
                  <svg viewBox="0 0 56 56" className="thanks-icon">
                    <circle cx="28" cy="28" r="26" fill="none" stroke="#C9A84C" strokeWidth="1"/>
                    <path d="M16 28 L24 36 L40 20" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <p className="thanks-text">{t.contact.thankYou}</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  {[
                    { id:'name',    label: t.contact.formName,    type:'text',  required:true },
                    { id:'email',   label: t.contact.formEmail,   type:'email', required:true },
                    { id:'phone',   label: t.contact.formPhone,   type:'tel',   required:false },
                  ].map(field => (
                    <div key={field.id} className="form-field">
                      <label htmlFor={field.id} className="form-label">{field.label}</label>
                      <input
                        id={field.id} name={field.id} type={field.type}
                        className="form-input" required={field.required}
                        value={form[field.id]} onChange={handleChange}
                      />
                    </div>
                  ))}
                  <div className="form-field">
                    <label htmlFor="message" className="form-label">{t.contact.formMessage}</label>
                    <textarea
                      id="message" name="message" rows={5}
                      className="form-input form-textarea" required
                      value={form.message} onChange={handleChange}
                    />
                  </div>
                  <button type="submit" className="btn-primary form-submit">{t.contact.formSend}</button>
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
