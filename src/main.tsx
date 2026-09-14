import { Component, StrictMode, useEffect, type ErrorInfo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = document.getElementById('root');
const recoveryShell = document.getElementById('recovery-shell');

if (recoveryShell) {
    recoveryShell.innerHTML = `<section style='max-width:760px;margin:0 auto;padding:48px 20px'><p dir='ltr' style='font:900 11px/1.4 ui-monospace,monospace;letter-spacing:.14em;color:#d8aa62'>LIFE ATLAS · SOURCE-LINKED RECOVERY</p><h1 style='font-size:clamp(46px,9vw,88px);line-height:.92;letter-spacing:-.055em'>החיים שלי. לא שמונה קופסאות.</h1><p style='max-width:58ch;color:#c8c2b8;line-height:1.7'>אם הממשק החי לא נטען, זו שכבת התאוששות בלבד. המסלול נשמר כמקורות, מדיה ורגעים כרונולוגיים — בלי להמציא אירועים כדי למלא חורים.</p></section>`;
}

if (!root) throw new Error('7YA root element not found');

type RecoveryWindow = Window & { __7yaRecoveryTimer?: number };

function clearRecoveryTimer() {
    const recoveryWindow = window as RecoveryWindow;
    if (recoveryWindow.__7yaRecoveryTimer !== undefined) {
        window.clearTimeout(recoveryWindow.__7yaRecoveryTimer);
        delete recoveryWindow.__7yaRecoveryTimer;
    }
}

function showRecovery(state: 'error') {
    clearRecoveryTimer();
    document.documentElement.dataset.appHydrated = state;
    recoveryShell?.removeAttribute('data-hydrated');
    recoveryShell?.removeAttribute('aria-hidden');
}

function homepageIsComplete() {
    if (window.location.pathname !== '/') return true;
    const isDeepAlbum = new URLSearchParams(window.location.search).get('page') === 'album';
    const required = isDeepAlbum
        ? ['.album-home', '#album-cover', '#album-journey', '.album-chapters', '#album-closing']
        : ['.album-home', '#album-cover', '#igor-voice', '.life-throughline', '.life-media-strip', '#album-closing'];
    return required.every((selector) => Boolean(root.querySelector(selector)));
}

function hideRecovery() {
    if (!homepageIsComplete()) {
        console.error('7YA hydration gate rejected an incomplete homepage');
        showRecovery('error');
        return;
    }
    clearRecoveryTimer();
    document.documentElement.dataset.appHydrated = 'ready';
    recoveryShell?.setAttribute('data-hydrated', 'hidden');
    recoveryShell?.setAttribute('aria-hidden', 'true');
}

function HydrationCommit() {
    useEffect(() => {
        let cancelled = false;
        let frame = 0;
        let attempts = 0;
        const maxAttempts = 180;

        const confirmHomepage = () => {
            if (cancelled) return;
            if (homepageIsComplete()) {
                hideRecovery();
                return;
            }
            attempts += 1;
            if (attempts >= maxAttempts) {
                console.error('7YA hydration gate timed out before the Personal Album homepage was ready');
                showRecovery('error');
                return;
            }
            frame = window.requestAnimationFrame(confirmHomepage);
        };

        frame = window.requestAnimationFrame(confirmHomepage);
        return () => {
            cancelled = true;
            window.cancelAnimationFrame(frame);
        };
    }, []);
    return <App />;
}

class RootErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
    state = { failed: false };

    static getDerivedStateFromError() {
        return { failed: true };
    }

    componentDidCatch(error: unknown, info: ErrorInfo) {
        console.error('7YA root render failed', error, info);
        showRecovery('error');
    }

    render() {
        return this.state.failed ? null : this.props.children;
    }
}

document.documentElement.dataset.appHydrated = 'booting';
recoveryShell?.setAttribute('data-hydrated', 'hidden');
recoveryShell?.setAttribute('aria-hidden', 'true');
createRoot(root).render(
    <StrictMode>
        <RootErrorBoundary>
            <HydrationCommit />
        </RootErrorBoundary>
    </StrictMode>,
);
