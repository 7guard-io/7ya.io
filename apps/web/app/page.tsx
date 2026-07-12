const pillars = [
  {
    label: "STARTON",
    title: "טכנולוגיה כנקודת פתיחה",
    text: "מרחבים, כלים ומנטורים שמחברים בני נוער ליצירה, קהילה והזדמנות אמיתית.",
  },
  {
    label: "7YA",
    title: "מערכת שמעדיפה הוכחות",
    text: "שכבת ראיות ציבורית שמחברת מקורות, תהליכים והחלטות לתמונה אחת ברורה.",
  },
  {
    label: "IGOR",
    title: "אדם לפני מערכת",
    text: "שירות ציבורי, שטח, השפעה, יצירה ובנייה — במקום אחד, בלי להסתתר מאחורי ממשק.",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="eyebrow">STAGING · 7YA.IO</div>
        <p className="kicker">IGOR VEPRETSKI</p>
        <h1>איגור ופרצקי.</h1>
        <p className="lead">
          מייסד StartOn. בונה את 7YA. מחבר בין ניסיון חיים, אחריות ציבורית,
          נוער, טכנולוגיה והשפעה דיגיטלית.
        </p>
        <div className="actions" aria-label="פעולות מרכזיות">
          <a className="button primary" href="mailto:hello@7ya.io">
            דברו איתי
          </a>
          <a className="button" href="#work">
            לראות את העשייה
          </a>
        </div>
        <div className="portrait" aria-label="מקום שמור לתמונת איגור ופרצקי">
          <span>7</span>
          <small>PORTRAIT ASSET NEXT</small>
        </div>
      </section>

      <section className="section" id="work">
        <div className="sectionHeading">
          <p>01 · התמונה המלאה</p>
          <h2>שלושה צירים. זהות אחת.</h2>
        </div>
        <div className="grid">
          {pillars.map((pillar) => (
            <article key={pillar.label}>
              <span>{pillar.label}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="statement">
        <p>ה־MVP הזה נבנה בענף Staging מבודד.</p>
        <h2>Production נשאר נעול. כאן בונים, בודקים ומשפרים.</h2>
      </section>
    </main>
  );
}
