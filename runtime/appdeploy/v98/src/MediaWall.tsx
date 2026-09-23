import {ArrowUpLeft,Play} from 'lucide-react';
import './media-wall.css';

const media=[
  {id:'O3v309CA4ao',source:'ערוץ 14',title:'לחזור לשכונה. לבנות מקום להתחיל בו.',year:'2022',url:'https://youtu.be/O3v309CA4ao'},
  {id:'3h-oEuW8GJI',source:'פודקאסט',title:'מהבריחה — אל היכולת להפוך סיפור לפעולה.',year:'2024',url:'https://www.youtube.com/watch?v=3h-oEuW8GJI'},
  {id:'U2d_hulZAC0',source:'רדיו חברתי ראשון',title:'שיחה פתוחה על נוער, סיכון ותקווה מעשית.',year:'2023',url:'https://www.youtube.com/watch?v=U2d_hulZAC0'},
  {id:'AE5hDzLM5XU',source:'חדשות 13',title:'כשעוול פוגש פעולה: עוצרים עוקץ ומחזירים קול.',year:'2023',url:'https://www.youtube.com/watch?v=AE5hDzLM5XU'},
  {id:'3XxoBtSL2pg',source:'חדשות 12',title:'הסיפור שמאחורי המאבק בהונאות קשישים.',year:'2023',url:'https://www.youtube.com/watch?v=3XxoBtSL2pg'}
];

export function HeroMediaStage(){return <div className="hero-media-stage" aria-label="דיוקן איגור ופרצקי"><div className="stage-glow" aria-hidden="true"/><div className="stage-grid" aria-hidden="true"/><figure className="hero-face"><img src="/resources/igor-hero.jpg" alt="איגור ופרצקי"/><figcaption><b>IGOR VEPRETSKI</b><span>PERSON · STORY · PUBLIC WORK</span></figcaption></figure><div className="portrait-signals" aria-label="תחומי הסיפור"><span>PUBLIC SERVICE</span><span>STARTON</span><span>MEDIA</span><span>7YA</span></div><a className="stage-open" href="#story-player"><Play fill="currentColor"/>OPEN THE LIVING STORY</a><div className="stage-live"><i/>DOCUMENTED JOURNEY <strong>1990→</strong></div></div>}

export default function MediaWall(){return <section className="media-wall" id="media"><header className="media-wall-head"><div><span className="media-kicker"><i/>ON AIR · PUBLIC ARCHIVE</span><h2>עוד פריימים.<br/><em>פחות הסברים.</em></h2></div><p>הנגן למעלה מספר סיפור אחד בכל פעם. כאן נשמר קיר המקורות הרחב למי שרוצה להמשיך ולפתוח את התיעוד המלא.</p></header><div className="media-reel" aria-label="ראיונות נבחרים">{media.map((item,index)=><a className={`media-card media-${index+1}`} key={item.id} href={item.url} target="_blank" rel="noreferrer"><img src={`https://img.youtube.com/vi/${item.id}/hqdefault.jpg`} alt={`${item.source}: ${item.title}`}/><span className="media-shade"/><span className="media-index">0{index+1}</span><span className="media-play"><Play fill="currentColor"/></span><span className="media-copy"><small>{item.source} · {item.year}</small><strong>{item.title}</strong><b>לצפייה במקור <ArrowUpLeft/></b></span></a>)}</div></section>}
