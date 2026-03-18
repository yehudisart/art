// ============================================================
// CONTACT PAGE
// ============================================================
import React, { useState, useEffect } from 'react';
import './shared.css';
import './ContactPage.css';

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

const ContactPage = ({ t }) => {
  useReveal();
  const isHe = t.lang === 'he';

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', message: '',
  });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // NOTE: form submission — connect to your backend/Formspree/EmailJS here
  const handleSubmit = (e) => {
    e.preventDefault();
    // ← REPLACE: add your form submission logic here
    // e.g., fetch('https://formspree.io/f/YOUR_ID', { method: 'POST', body: JSON.stringify(formData) })
    setSent(true);
  };

  return (
    <main className="contact-page" dir={t.dir}>

      {/* Page header */}
      <section className="page-hero contact-hero">
        <div className="container">
          <div className="page-hero-inner">
            <h1 className="page-title">{t.contact.pageTitle}</h1>
            <div className="page-title-rule" />
            <p className="contact-intro">{t.contact.intro}</p>
          </div>
        </div>
      </section>

      {/* ── CONTACT BODY ─────────────────────────────────── */}
      <section className="contact-body-section">
        <div className="container">
          <div className="contact-grid">

            {/* Left: info */}
            <div className="contact-info reveal">
              {/* Invitations */}
              <div className="contact-invitations">
                <span className="section-label">
                  {isHe ? 'לכל שאלה ובקשה' : 'Open to'}
                </span>
                <ul className="invitation-list">
                  {t.contact.invitations.map((item, i) => (
                    <li key={i} className="invitation-item">
                      <span className="inv-dot">◦</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact details */}
              <div className="contact-details">
                {/* Email */}
                <div className="contact-detail-row">
                  <span className="detail-label">{t.contact.emailLabel}</span>
                  {/* ← REPLACE: update email in translations.js */}
                  <a href={`mailto:${t.contact.emailValue}`} className="detail-value">
                    {t.contact.emailValue}
                  </a>
                </div>

                {/* Phone */}
                <div className="contact-detail-row">
                  <span className="detail-label">{t.contact.phoneLabel}</span>
                  {/* ← REPLACE: update phone in translations.js */}
                  <a href={`tel:${t.contact.phoneValue.replace(/\s/g,'')}`} className="detail-value">
                    {t.contact.phoneValue}
                  </a>
                </div>

                {/* Instagram */}
                <div className="contact-detail-row">
                  <span className="detail-label">{t.contact.instagramLabel}</span>
                  {/* ← REPLACE: update Instagram URL in translations.js */}
                  <a
                    href={t.contact.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="detail-value"
                  >
                    {t.contact.instagramValue}
                  </a>
                </div>

                {/* Location */}
                <div className="contact-detail-row">
                  <span className="detail-label">{t.contact.locationLabel}</span>
                  <span className="detail-value">{t.contact.locationValue}</span>
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div className="contact-form-wrap reveal">
              {sent ? (
                <div className="form-thank-you">
                  <svg viewBox="0 0 48 48" className="thank-you-icon">
                    <circle cx="24" cy="24" r="22" fill="none" stroke="#B8963E" strokeWidth="1" />
                    <path d="M14 24 L21 31 L34 17" fill="none" stroke="#B8963E" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <p className="thank-you-text">{t.contact.thankYou}</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  {/* Name */}
                  <div className="form-field">
                    <label className="form-label" htmlFor="name">
                      {t.contact.formName}
                    </label>
                    <input
                      className="form-input"
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="form-field">
                    <label className="form-label" htmlFor="email">
                      {t.contact.formEmail}
                    </label>
                    <input
                      className="form-input"
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="form-field">
                    <label className="form-label" htmlFor="phone">
                      {t.contact.formPhone}
                    </label>
                    <input
                      className="form-input"
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Message */}
                  <div className="form-field">
                    <label className="form-label" htmlFor="message">
                      {t.contact.formMessage}
                    </label>
                    <textarea
                      className="form-input form-textarea"
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-primary form-submit">
                    {t.contact.formSend}
                  </button>
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
