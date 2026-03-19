import React, { useEffect } from 'react';
import './AboutPage.css';

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

const AboutPage = ({ t }) => {
  useReveal();
  const isHe = t.lang === 'he';

  return (
    <main className="about-page" dir={t.dir}>

      {/* Split — sticky image left, scrolling text right */}
      <div className="ab-split">
        <div className="ab-img-col">
          <img src="/images/tefila.jpg" alt="Yehudis" className="ab-img" />
        </div>
        <div className="ab-text">
          <span className="ab-ey rv">{isHe ? 'על האמנית' : 'About the Artist'}</span>
          <img className="ab-logo rv d1" src="/images/logo-yehudis-dark.png" alt="Yehudis" />
          <p className="ab-sub rv d1">יהודית יעקבס</p>
          <div className="ab-rule rv d2" />

          {isHe ? (
            <>
              <p className="ab-p rv">יהודית יעקבס היא ציירת ירושלמית שיצירתה שוכנת על הסף שבין הנראה לנחוש. בדיה לא מתארים חיים יהודיים — הם נושמים אותם. בכל ציור, תנועה מחזיקה תפילה, קרן אור נושאת זיכרון, ופנים נושאות את כובד הדורות.</p>
              <p className="ab-p rv">בעלת תואר שני בטיפול באמנות מאוניברסיטת חיפה ובוגרת בצלאל, אקדמיה לאמנות ועיצוב בירושלים — כולל לימודים אצל אחת הציירות המפורסמות ביותר בישראל — היא מביאה גם קשב של מרפאה וגם דיוק של אומנת.</p>
              <p className="ab-p rv">ציוריה מוחזקים באוספים פרטיים בישראל, בארצות הברית ובכל רחבי אירופה. כל יצירה ייחודית — נוצרת לאט, בכוונה.</p>
            </>
          ) : (
            <>
              <p className="ab-p rv">Yehudis Jacobs is a Jerusalem-based painter whose work inhabits the threshold between the seen and the felt. Her canvases do not describe Jewish life — they breathe it. In each painting, a gesture holds a prayer, a shaft of light carries memory, a face holds the weight of generations.</p>
              <p className="ab-p rv">Trained in art therapy at the University of Haifa and schooled at Bezalel Academy in Jerusalem — including study with one of Israel's most celebrated painters — she brings both a healer's attention and a craftsman's rigor to each canvas.</p>
              <p className="ab-p rv">Her paintings are held in private collections in Israel, the United States, and across Europe. Each work is unique — made slowly, with intention.</p>
            </>
          )}

          <div className="ab-creds rv">
            <div className="cr-row">
              <span className="cr-l">{isHe ? 'מקום' : 'Based'}</span>
              <span className="cr-v">{isHe ? 'ירושלים, ישראל' : 'Jerusalem, Israel'}</span>
            </div>
            <div className="cr-row">
              <span className="cr-l">{isHe ? 'השכלה' : 'Education'}</span>
              <span className="cr-v">{isHe ? 'בצלאל · תואר שני בטיפול באמנות, אוניברסיטת חיפה' : 'Bezalel Academy · M.A. Art Therapy, University of Haifa'}</span>
            </div>
            <div className="cr-row">
              <span className="cr-l">{isHe ? 'מדיה' : 'Medium'}</span>
              <span className="cr-v">{isHe ? 'שמן, אקריליק, מדיה מעורבת, עלי זהב' : 'Oil, acrylic, mixed media, gold leaf on canvas'}</span>
            </div>
            <div className="cr-row">
              <span className="cr-l">{isHe ? 'אוספים' : 'Collections'}</span>
              <span className="cr-v">{isHe ? 'פרטיים — ישראל, ארה"ב, אירופה' : 'Private — Israel, USA, Europe'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dark quote band */}
      <div className="a-stmt">
        <blockquote className="rv">
          {isHe
            ? '״אני מציירת את מה שלא ניתן לומר במילים — המרחב שבין נשימה לברכה, בין זיכרון להווה.״'
            : '"I paint what cannot be spoken — the space between a breath and a blessing, between memory and now."'
          }
        </blockquote>
        <cite className="rv d1">— Yehudis Jacobs</cite>
      </div>

    </main>
  );
};

export default AboutPage;
