import {ArrowUpRight,ExternalLink,MessageCircle} from 'lucide-react';
import {deepMedia,type DeepMediaItem} from '../deep-media-data';
import {LanguageSwitcher,itemText,metricText,pageHref,rootHref,useLocale,yearText} from '../locale';
import {homeCopy,selectedEvidenceIds,type HomeSystem} from './home-content';
import './engineering-home.css';

const selectedEvidence=selectedEvidenceIds.map(id=>deepMedia.find(item=>item.id===id)).filter((item):item is DeepMediaItem=>Boolean(item));

export default function EngineeringHome(){
    const {locale,dir}=useLocale();
    const c=homeCopy[locale];
    const home=pageHref('home',locale);
    const chat=home+(home.includes('?')?'&':'?')+'chat=open';
    const systemHref=(system:HomeSystem)=>system.target==='starton'?pageHref('starton',locale):system.target==='library'?pageHref('library',locale):pageHref('media',locale);
    return <main className='eng-home' dir={dir} data-home-version='engineering-v1'>
        <a className='eng-skip' href='#eng-main'>Skip to content</a>
        <header className='eng-header'>
            <a className='eng-brand' href={home} aria-label='7YA home'><span>7YA</span><small>IGOR VEPRETSKI</small></a>
            <nav className='eng-nav' aria-label='Primary'><a href='#systems'>{c.nav.work}</a><a href={pageHref('starton',locale)}>{c.nav.starton}</a><a href={pageHref('evidence',locale)}>{c.nav.evidence}</a><a href={pageHref('library',locale)}>{c.nav.archive}</a><a href={rootHref('contact/')}>{c.nav.contact}</a></nav>
            <LanguageSwitcher compact/>
        </header>
        <div id='eng-main'>
            <section className='eng-hero' aria-labelledby='eng-title'>
                <div className='eng-hero-copy'><p className='eng-kicker'>{c.eyebrow}</p><h1 id='eng-title'>{c.title}</h1><p className='eng-lead'>{c.lead}</p><div className='eng-actions'><a className='eng-button eng-button-primary' href='#systems'>{c.primary}<ArrowUpRight/></a><a className='eng-button' href={pageHref('evidence',locale)}>{c.evidence}<ArrowUpRight/></a><a className='eng-utility' href={chat}>{c.chat}<MessageCircle/></a></div></div>
                <figure className='eng-portrait'><img src={rootHref('resources/igor-hero.jpg')} alt='Igor Vepretski' fetchPriority='high'/><figcaption><span>{c.portraitNote}</span><strong>#7YA🥷</strong></figcaption></figure>
            </section>
            <section className='eng-systems eng-section' id='systems' aria-labelledby='eng-systems-title'><header className='eng-section-head'><p className='eng-kicker'>{c.systemsKicker}</p><div><h2 id='eng-systems-title'>{c.systemsTitle}</h2><p>{c.systemsLead}</p></div></header><div className='eng-system-grid'>{c.systems.map(system=><article className='eng-system' key={system.code}><div className='eng-system-meta'><span>{system.code}</span><small>{system.status}</small></div><h3>{system.title}</h3><p>{system.description}</p><a href={systemHref(system)}>{system.linkLabel}<ArrowUpRight/></a></article>)}</div></section>
            <section className='eng-evidence eng-section' aria-labelledby='eng-evidence-title'><header className='eng-section-head'><p className='eng-kicker'>{c.evidenceKicker}</p><div><h2 id='eng-evidence-title'>{c.evidenceTitle}</h2><p>{c.evidenceLead}</p></div></header><div className='eng-evidence-grid'>{selectedEvidence.map(item=>{const text=itemText(item.id,locale,item.title,item.summary);return <a className='eng-evidence-card' href={item.url} target='_blank' rel='noreferrer' key={item.id}><figure><img src={item.image||item.fallback} alt='' loading='lazy' decoding='async' referrerPolicy='no-referrer'/></figure><div className='eng-evidence-body'><div className='eng-evidence-meta'><span>{yearText(item.year,locale)}</span><span>{item.source}</span></div><h3>{text.title}</h3>{metricText(item.metric,locale)&&<p className='eng-metric'>{metricText(item.metric,locale)}</p>}<span className='eng-source-link'>{c.openSource}<ExternalLink/></span></div></a>})}</div><a className='eng-inline-link' href={pageHref('evidence',locale)}>{c.evidence}<ArrowUpRight/></a></section>
            <section className='eng-timeline eng-section' aria-labelledby='eng-timeline-title'><header className='eng-section-head'><p className='eng-kicker'>{c.timelineKicker}</p><div><h2 id='eng-timeline-title'>{c.timelineTitle}</h2><p>{c.timelineLead}</p></div></header><ol>{c.timeline.map(item=><li key={item.year}><time>{item.year}</time><div><h3>{item.title}</h3><p>{item.description}</p></div></li>)}</ol></section>
            <section className='eng-contact eng-section' aria-labelledby='eng-contact-title'><p className='eng-kicker'>{c.contactKicker}</p><div className='eng-contact-grid'><div><h2 id='eng-contact-title'>{c.contactTitle}</h2><p>{c.contactLead}</p></div><div className='eng-contact-actions'><a className='eng-button eng-button-light' href={rootHref('contact/')}>{c.contactButton}<ArrowUpRight/></a><a className='eng-button eng-button-dark' href={pageHref('library',locale)}>{c.archiveButton}<ArrowUpRight/></a></div></div></section>
        </div>
        <footer className='eng-footer'><strong>7YA</strong><span>{c.footer}</span><a href={pageHref('evidence',locale)}>{c.evidence}<ArrowUpRight/></a></footer>
    </main>;
}
