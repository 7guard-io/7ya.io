import {useEffect} from 'react';
import PublicJourneyHome from './PublicJourneyHome';
import MuseumPage from './MuseumPage';
import MediaPage from './MediaPage';
import MusicRoom from './MusicRoom';
import SpeakerPage from './SpeakerPage';
import BlogPage from './BlogPage';
import CreatorPathPage from './CreatorPathPage';
import GrowthPathPage from './GrowthPathPage';
import ResearchPage from './ResearchPage';
import SiteControl from './SiteControl';
import GlobalNav from './GlobalNav';
import StoryCompanion from './StoryCompanion';
import {LocaleProvider,useLocale,type Locale} from './locale';
import IntegrityPage from './IntegrityPage';
import SocialControlPage from './SocialControlPage';
import './7ya-brand-frame.css';

const release='7ya-public-journey-20260909-1';
const health={status:'ok',service:'7ya-independent',provider:'portable-runtime',release,build:release};
type View='home'|'museum'|'music'|'media'|'speaker'|'blog'|'create'|'research';

const homeSeo:Record<Locale,{title:string;description:string}>={
  he:{title:'איגור ופרצקי | שירות, יצירה, StartOn ומסע ציבורי · 7YA',description:'המסע הציבורי של איגור ופרצקי: שירות, מערכות ציבוריות, StartOn, מדיה, יצירה, מוזיקה, מחקר וראיות — בממשק אחד שאפשר לפתוח ולבדוק.'},
  en:{title:'Igor Vepretski | Service, Creation, StartOn & Public Journey · 7YA',description:'Igor Vepretski’s public journey across service, public systems, StartOn, media, creation, music, research and source-linked evidence.'},
  ru:{title:'Игорь Вепрецкий | Служба, творчество, StartOn и публичный путь · 7YA',description:'Публичный путь Игоря Вепрецкого: служба, общественные системы, StartOn, медиа, творчество, музыка, исследования и открытые источники.'}
};

const viewLabel:Record<View,string>={home:'',museum:'Museum',music:'Music',media:'Media',speaker:'Speaker',blog:'Blog',create:'Create',research:'Research'};

function resolveView():View|'growth'{
  const clean=window.location.pathname.replace(/\/+$/,'');
  const page=new URLSearchParams(window.location.search).get('page');
  if(page==='museum'||clean.endsWith('/museum'))return 'museum';
  if(page==='research'||clean.endsWith('/research'))return 'research';
  if(page==='music'||clean.endsWith('/music'))return 'music';
  if(page==='media'||clean.endsWith('/media'))return 'media';
  if(page==='speaker'||clean.endsWith('/speaker'))return 'speaker';
  if(page==='blog'||clean.endsWith('/blog'))return 'blog';
  if(page==='growth')return 'growth';
  if(page==='create'||clean.endsWith('/create'))return 'create';
  return 'home';
}

function AppContent(){
  const {locale}=useLocale();
  const params=new URLSearchParams(window.location.search);
  const clean=window.location.pathname.replace(/\/+$/,'');
  const view=resolveView();
  const socialControl=params.get('page')==='social-control';
  const diagnostics=params.get('diagnostics')==='1';

  useEffect(()=>{
    const meta=view==='home'?homeSeo[locale]:{title:`${viewLabel[view==='growth'?'create':view]} | Igor Vepretski · 7YA`,description:homeSeo[locale].description};
    document.title=meta.title;
    const set=(selector:string,value:string)=>document.querySelector<HTMLElement>(selector)?.setAttribute('content',value);
    set('meta[name="description"]',meta.description);
    set('meta[property="og:title"]',meta.title);
    set('meta[property="og:description"]',meta.description);
    set('meta[name="twitter:title"]',meta.title);
    set('meta[name="twitter:description"]',meta.description);
    set('meta[property="og:locale"]',locale==='he'?'he_IL':locale==='ru'?'ru_RU':'en_US');
    const canonical=view==='home'?`https://7ya.io/?lang=${locale}`:`https://7ya.io/?page=${view}&lang=${locale}`;
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href',canonical);
  },[locale,view]);

  if(diagnostics)return <IntegrityPage release={release}/>;
  if(clean.endsWith('/api/health'))return <main dir='ltr' className='min-h-screen bg-[#07090d] p-6 font-mono text-emerald-300'><pre>{JSON.stringify(health,null,2)}</pre></main>;

  const content=socialControl?<SocialControlPage/>:view==='museum'?<MuseumPage/>:view==='research'?<ResearchPage/>:view==='music'?<MusicRoom/>:view==='media'?<MediaPage/>:view==='speaker'?<SpeakerPage/>:view==='blog'?<BlogPage/>:view==='growth'?<GrowthPathPage/>:view==='create'?<CreatorPathPage/>:<PublicJourneyHome/>;
  const navView:View=view==='growth'?'create':view;

  return <div className='igor-ambient-frame'>
    <div className='igor-ambient igor-ambient-a' aria-hidden='true'><img src='./resources/igor-hero.jpg' alt=''/></div>
    <div className='igor-ambient igor-ambient-b' aria-hidden='true'><img src='./resources/igor-hero.jpg' alt=''/></div>
    <GlobalNav view={navView}/>
    <SiteControl/>
    <div id='main-content'>{content}</div>
    <StoryCompanion key={locale}/>
  </div>;
}

export default function App(){return <LocaleProvider><AppContent/></LocaleProvider>}
