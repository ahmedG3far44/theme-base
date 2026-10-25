import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PortfolioPage } from './features/portfolio/PortfolioPage';
import './styles.css';

const EditorPage = import.meta.env.DEV ? lazy(() => import('./features/editor/PortfolioEditor')) : null;

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
        <Route path="/editor" element={EditorPage ? <Suspense fallback={<p>Loading editor…</p>}><EditorPage /></Suspense> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
