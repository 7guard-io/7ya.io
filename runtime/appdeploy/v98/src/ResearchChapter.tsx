import { ArrowUpLeft, BookMarked, BrainCircuit, Network, Scale } from 'lucide-react';
import './research-chapter.css';

const lenses=[
  {icon:Scale,title:'קרימינולוגיה וחברה',text:'איך סביבה, אמון ומוסדות מעצבים בחירה — ואיך מחזירים לאדם מרחב פעולה.'},
  {icon:BrainCircuit,title:'תקשורת והשפעה',text:'מה הופך סיפור ציבורי לרגע שמשנה שיחה, ולא רק לעוד חשיפה חולפת.'},
  {icon:Network,title:'מידע וממשל דיגיטלי',text:'איך בונים מערכות שקופות, ניתנות לבדיקה ומכוונות לתוצאה אנושית.'},
];

export default function ResearchChapter(){
  return <section className="research-chapter" id="research">
    <div className="research-visual">
      <img src="/resources/7ya-research.webp" alt="דימוי חזותי של איגור ופרצקי בין מחקר, עיר וטכנולוגיה"/>
      <span>7YA ORIGINAL VISUAL · INTERPRETATION, NOT DOCUMENTATION</span>
    </div>
    <div className="research-content">
      <span className="research-kicker"><BookMarked/>IDEAS · RESEARCH · ACADEMIA</span>
      <h2>העשייה היא<br/><em>המעבדה.</em></h2>
      <p>מאחורי הפרויקטים, הראיונות והיוזמות נמצאת שאלה עקבית: איך ידע הופך למערכת שעוזרת לאנשים לפעול. עמוד Academia הוא שער לכתיבה ולרעיונות שמחברים בין קרימינולוגיה, תקשורת, מידע ויזמות חברתית.</p>
      <div className="research-lenses">{lenses.map(({icon:Icon,title,text})=><article key={title}><Icon/><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
      <a className="research-link" href="https://igorvepretski.academia.edu/" target="_blank" rel="noreferrer">לעמוד Academia <ArrowUpLeft/></a>
      <small>הקישור מוביל לפרופיל הציבורי. באתר מוצג מסגור רעיוני בלבד, ללא המצאת שמות מחקרים או הישגים.</small>
    </div>
  </section>;
}
