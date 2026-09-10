import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/global.css';

const root = document.getElementById('root');
if (!root) throw new Error('7YA root element missing');

createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
