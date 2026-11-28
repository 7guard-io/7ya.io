import type { ReactNode } from 'react';
import { LanguageSwitcher, rootHref, useLocale } from '../locale';
import type { CoreRouteKey } from './core-types';

const labels = {
    he: { home: 'בית', story: 'הסיפור', media: 'מדיה', politics: 'שירות ופוליטיקה', starton: 'StartOn', music: 'מוזיקה', research: 'מחקר', archive: 'ארכיון' },
    en: { home: 'Home', story: 'Story', media: 'Media', politics: 'Service & Politics', starton: 'StartOn', music: 'Music', research: 'Research', archive: 'Archive' },
    ru: { home: 'Главная', story: 'История', media: 'Медиа', politics: 'Служба и политика', starton: 'StartOn', music: 'Музыка', research: 'Исследования', archive: 'Архив' }
} as const;

const routePaths: Record<CoreRouteKey, string> = { home: '', story: 'story/', media: 'media/', politics: 'politics/', starton: 'starton/', music: 'music/', research: 'research/', archive: 'archive/' };

export default function ExperienceShell({ route, children }: { route: CoreRouteKey; children: ReactNode }) {
    const { locale } = useLocale();
    const prefix = locale === 'he' ? '' : `${locale}/`;
    return <div className='core-experience' data-core-source='7ya-core'>
        <header className='core-header'>
            <a className='core-brand' href={rootHref(prefix)} aria-label='7YA home'><span>7YA</span><strong>IGOR VEPRETSKI</strong></a>
            <nav className='core-nav' aria-label='7YA Core'>{(Object.keys(routePaths) as CoreRouteKey[]).map(key => <a key={key} className={route === key ? 'active' : ''} href={rootHref(prefix + routePaths[key])}>{labels[locale][key]}</a>)}</nav>
            <LanguageSwitcher compact />
        </header>
        <main className='core-main'>{children}</main>
        <footer className='core-footer'><span>7YA CORE · SOURCE OF TRUTH</span><span>Source-linked public record · HE / EN / RU</span></footer>
    </div>;
}
