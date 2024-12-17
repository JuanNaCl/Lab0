import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppRoutes from './routes';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>
);
