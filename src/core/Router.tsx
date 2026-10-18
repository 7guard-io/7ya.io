import { lazy, Suspense, useEffect } from 'react';
import ExperienceShell from './ExperienceShell';
import PageRenderer from './PageRenderer';
import BroChat from './BroChat';
import type { CoreRouteKey } from './core-types';

const SocialControlPage = lazy(() => import('../SocialControlPage'));
const CorpusInspectorPage = lazy(() => import('../CorpusInspectorPage'));
const IntegrityPage = lazy(() => import('../IntegrityPage'));
const PersonalInternetHome = lazy(() => import('../personal-internet/PersonalInternetHome'));
const release = '7ya-core-cutover-20260912-v1';

function routeFromPath(pathname: string): CoreRouteKey {
    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] === 'en' || segments[0] === 'ru') segments.shift();
    const head = segments[0] || '';
    if (!head) return 'home';
    if (['story', 'igor-vepretski', 'journey', 'museum', 'album', 'speaker'].includes(head)) return 'story';
    if (head === 'media') return 'media';
    if (['politics', 'if-igor-were-on-the-list'].includes(head)) return 'politics';
    if (head === 'starton') return 'starton';
    if (head === 'music') return 'music';
    if (head === 'research') return 'research';
    if (['archive', 'library', 'evidence', 'search', 'blog'].includes(head)) return 'archive';
    return 'home';
}

function CorePublicExperience({ route }: { route: CoreRouteKey }) {
    return <ExperienceShell route={route}><PageRenderer route={route} /><BroChat /></ExperienceShell>;
}

export default function Router() {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    const diagnostics = params.get('diagnostics') === '1';
    const route = routeFromPath(window.location.pathname);

    useEffect(() => {
        document.documentElement.dataset.appHydrated = 'ready';
        document.body.dataset.release = release;
        const timer = (window as typeof window & { __7yaRecoveryTimer?: number }).__7yaRecoveryTimer;
        if (timer) window.clearTimeout(timer);
        const shell = document.getElementById('recovery-shell');
        if (shell) { shell.setAttribute('data-hydrated', 'hidden'); shell.setAttribute('aria-hidden', 'true'); }
    }, []);

    if (page === 'social-control') return <Suspense fallback={<div className='core-admin-loading'>Loading social control…</div>}><SocialControlPage /></Suspense>;
    if (page === 'corpus') return <Suspense fallback={<div className='core-admin-loading'>Loading corpus…</div>}><CorpusInspectorPage /></Suspense>;
    if (page === 'system') return <Suspense fallback={<div className='core-admin-loading'>Loading system…</div>}><PersonalInternetHome /></Suspense>;
    if (diagnostics) return <Suspense fallback={<div className='core-admin-loading'>Loading diagnostics…</div>}><IntegrityPage release={release} /></Suspense>;
    return <CorePublicExperience route={route} />;
}
