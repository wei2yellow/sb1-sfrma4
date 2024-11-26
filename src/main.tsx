import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from './routes';
import { Toaster } from 'react-hot-toast';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
    <Toaster position="top-center" />
  </StrictMode>
);