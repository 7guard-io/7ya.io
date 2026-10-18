import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './visual-system.css';
import './visual-system.css';

if (window.location.hostname === 'www.7ya.io') {
    window.location.replace('https://7ya.io' + window.location.pathname + window.location.search + window.location.hash);
} else {
    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <App />
        </StrictMode>
    );
}