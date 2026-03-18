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
  const onSubmit = e => { e.preventDefault(); /* ← REPLACE: add form handler */ setSent(true); };

  return (
    <main className="cp" dir={t.dir}>
      <section className="cp__head">
        <div className="container">
          <span className="t-label">{t.contact.pageLabel}</span>
          <h1 className="t-heading t-heading--xl cp__title">{t.contact.pageTitle}</h1>
          <div className="g-rule g-rule--center" />
          <p className="cp__intro">{t.contact.intro}</p>
        </div>
      </section>

      <section className="cp__body">
        <div className="container">
          <div className="cp__grid">
            <div className="cp__info reveal">
              <div className="cp__invites">
                <span className="t-label">{t.lang === 'he' ? 'פניות מתקבלות' : 'Open to'}</span>
                <ul className="cp__invite-list">
                  {t.contact.invitations.map((item, i) => (
                    <li key={i} className="cp__invite-item">
                      <span className="cp__invite-num">{String(i+1).padStart(2,'0')}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="cp__details">
                {[
                  { label: t.contact.emailLabel,     val: t.contact.emailValue,     href: `mailto:${t.contact.emailValue}` },
                  { label: t.contact.phoneLabel,      val: t.contact.phoneValue,     href: `tel:${t.contact.phoneValue.replace(/\s/g,'')}` },
                  { label: t.contact.instagramLabel,  val: t.contact.instagramValue, href: t.contact.instagramUrl, ext: true },
                  { label: t.contact.locationLabel,   val: t.contact.locationValue,  href: null },
                ].map((row, i) => (
                  <div key={i} className="cp__detail-row">
                    <span className="cp__detail-label">{row.label}</span>
                    {row.href
                      ? <a href={row.href} className="cp__detail-val" target={row.ext ? '_blank' : undefined} rel={row.ext ? 'noopener noreferrer' : undefined}>{row.val}</a>
                      : <span className="cp__detail-val">{row.val}</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="cp__form-wrap reveal" style={{ transitionDelay: '120ms' }}>
              {sent ? (
                <div className="cp__thanks">
                  <svg viewBox="0 0 52 52" width="52" height="52"><circle cx="26" cy="26" r="24" fill="none" stroke="var(--gold)" strokeWidth="1"/><path d="M14 26 L22 34 L38 18" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  <p className="cp__thanks-text">{t.contact.thankYou}</p>
                </div>
              ) : (
                <form className="cp__form" onSubmit={onSubmit} noValidate>
                  {[
                    { id:'name',  label:t.contact.formName,  type:'text',  req:true },
                    { id:'email', label:t.contact.formEmail, type:'email', req:true },
                    { id:'phone', label:t.contact.formPhone, type:'tel',   req:false },
                  ].map(f => (
                    <div key={f.id} className="cp__field">
                      <label htmlFor={f.id} className="cp__label">{f.label}</label>
                      <input id={f.id} name={f.id} type={f.type} required={f.req}
                        className="cp__input" value={form[f.id]} onChange={onChange} />
                    </div>
                  ))}
                  <div className="cp__field">
                    <label htmlFor="message" className="cp__label">{t.contact.formMessage}</label>
                    <textarea id="message" name="message" rows={5} required
                      className="cp__input cp__textarea" value={form.message} onChange={onChange} />
                  </div>
                  <button type="submit" className="btn btn--dark cp__submit">{t.contact.formSend}</button>
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
