import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { seedDemoContent, cleanupTechArticles, reseedDemoContent } from './utils/seedData'

// Clean up any old tech articles
cleanupTechArticles();

// Seed demo content on first load
seedDemoContent();

// Expose reseed function globally for easy access
(window as any).reseedStories = () => {
  reseedDemoContent();
  window.location.reload();
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
