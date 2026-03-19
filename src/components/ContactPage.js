import React, { useState, useEffect } from 'react';
import './ContactPage.css';

const useReveal = () => {
  useEffect(() => {
    const t = setTimeout(() => {
      const els = document.querySelectorAll('.rv');
      const io = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } }),
        { threshold: 0.06 }
      );
      els.forEach(el => io.observe(el));
      return () => io.disconnect();
    }, 80);
    return () => clearTimeout(t);
  }, []);
};

const ContactPage = ({ t }) => {
  useReveal();
  const isHe = t.lang === 'he';
  const [form, setForm] = useState({ name:'', email:'', subject:'', whatsapp:'', message:'' });
  const [sent, setSent] = useState(false);
  const upd = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = e => { e.preventDefault(); setSent(true); };

  return (
    <main className="contact-page" dir={t.dir}>
      <div className="ct-wrap">
        <span className="ct-ey rv">{isHe ? 'פניות פרטיות' : 'Private Inquiries'}</span>
        <h1 className="ct-h rv d1">{isHe ? 'יצירת קשר' : 'Contact'}</h1>
        <p className="ct-h-he rv d1">{isHe ? 'Contact' : 'יצירת קשר'}</p>
        <p className="ct-int rv d2">
          {isHe
            ? 'לפניות רכישה, ביקורי סטודיו או עבודות לפי הזמנה — כתבו אלינו. אנו מגיבים לכל פנייה רצינית תוך 48 שעות.'
            : 'For acquisition enquiries, studio visits, or commissioned works — write to us. We respond to all serious enquiries within 48 hours.'
          }
        </p>
        <div className="ct-rule rv d2" />

        {sent ? (
          <div className="fok show rv">
            <p>{isHe ? '׳תודה — פנייתך התקבלה. נחזור אליך בקרוב.' : 'Thank you — your message has been received. We\'ll be in touch soon.'}</p>
          </div>
        ) : (
          <form className="ct-form rv" onSubmit={submit} noValidate>
            <div className="ct-row">
              <div className="ct-g">
                <label className="ct-l">{isHe ? 'שם מלא' : 'Full Name'}</label>
                <input className="ct-i" type="text" name="name" value={form.name} onChange={upd}
                  placeholder={isHe ? 'שמך' : 'Your name'} required />
              </div>
              <div className="ct-g">
                <label className="ct-l">{isHe ? 'אימייל' : 'Email'}</label>
                <input className="ct-i" type="email" name="email" value={form.email} onChange={upd}
                  placeholder="your@email.com" required />
              </div>
            </div>
            <div className="ct-row">
              <div className="ct-g">
                <label className="ct-l">{isHe ? 'נושא' : 'Subject'}</label>
                <input className="ct-i" type="text" name="subject" value={form.subject} onChange={upd}
                  placeholder={isHe ? 'רכישה / ביקור סטודיו...' : 'Acquisition / Studio visit…'} />
              </div>
              <div className="ct-g">
                <label className="ct-l">WhatsApp</label>
                <input className="ct-i" type="tel" name="whatsapp" value={form.whatsapp} onChange={upd}
                  placeholder="+972…" />
              </div>
            </div>
            <div className="ct-g">
              <label className="ct-l">{isHe ? 'הודעה' : 'Message'}</label>
              <textarea className="ct-ta" name="message" value={form.message} onChange={upd} rows={5}
                placeholder={isHe ? 'ספרו לנו על היצירה שמעניינת אתכם...' : 'Please share which work interests you…'}
                required />
            </div>
            <button type="submit" className="ct-sub">
              {isHe ? 'שליחת פנייה' : 'Send Enquiry'}
            </button>
          </form>
        )}

        {/* Contact details */}
        <div className="ct-dets">
          <div>
            <span className="cd-l">Email</span>
            <span className="cd-v"><a href="mailto:yehudisfineartgallery@gmail.com">yehudisfineartgallery@gmail.com</a></span>
          </div>
          <div>
            <span className="cd-l">WhatsApp</span>
            <span className="cd-v"><a href="https://wa.me/972" target="_blank" rel="noopener noreferrer">{isHe ? 'שלחו הודעה' : 'Send a message'}</a></span>
          </div>
          <div>
            <span className="cd-l">Instagram</span>
            <span className="cd-v"><a href="https://instagram.com/yehudisart" target="_blank" rel="noopener noreferrer">@yehudisart</a></span>
          </div>
          <div>
            <span className="cd-l">{isHe ? 'סטודיו' : 'Studio'}</span>
            <span className="cd-v">{isHe ? 'ירושלים, ישראל' : 'Jerusalem, Israel'}</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
