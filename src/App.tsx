import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { ArticleProvider } from './contexts/ArticleContext';
import { NarratorProvider } from './contexts/NarratorContext';
import { Scanlines } from './components/Scanlines';
import { ScreenJitter } from './components/ScreenJitter';
import { CrawlingSpider } from './components/CrawlingSpider';
import { FloatingGhost } from './components/FloatingGhost';
import { GlitchEffect } from './components/GlitchEffect';
import { JumpScare } from './components/JumpScare';
import { ShadowFigure } from './components/ShadowFigure';
import { FeedView } from './views/FeedView';
import { ArticleView } from './views/ArticleView';
import { CuratorView } from './views/CuratorView';
import { logPerformanceMetrics } from './utils/performance';
import { useRandomSpookyEffect } from './hooks/useRandomSpookyEffect';
import './App.css';

type Route = 
  | { view: 'feed' }
  | { view: 'article'; articleId: string }
  | { view: 'curator' };

interface NavigationState {
  scrollPosition: number;
}

function App() {
  const [route, setRoute] = useState<Route>({ view: 'feed' });
  const [navigationState, setNavigationState] = useState<NavigationState>({
    scrollPosition: 0,
  });
  
  // Random spooky effects
  const { activeEffect, clearEffect } = useRandomSpookyEffect({
    minDelay: 30000, // 30 seconds
    maxDelay: 90000, // 90 seconds
    enabled: true,
  });

  // Log performance metrics on initial load
  useEffect(() => {
    // Wait for load event to complete
    if (document.readyState === 'complete') {
      logPerformanceMetrics();
    } else {
      window.addEventListener('load', logPerformanceMetrics);
      return () => window.removeEventListener('load', logPerformanceMetrics);
    }
  }, []);

  // Parse hash and update route
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove '#'
      
      if (!hash || hash === 'feed') {
        setRoute({ view: 'feed' });
      } else if (hash.startsWith('article/')) {
        const articleId = hash.slice('article/'.length);
        setRoute({ view: 'article', articleId });
      } else if (hash === 'curator') {
        setRoute({ view: 'curator' });
      } else {
        // Default to feed for unknown routes
        setRoute({ view: 'feed' });
      }
    };

    // Handle initial load
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToArticle = (articleId: string) => {
    window.location.hash = `article/${articleId}`;
  };

  const navigateToFeed = () => {
    window.location.hash = 'feed';
  };

  const navigateToCurator = () => {
    window.location.hash = 'curator';
  };

  const handleScrollPositionChange = (position: number) => {
    setNavigationState(prev => ({ ...prev, scrollPosition: position }));
  };

  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <NarratorProvider>
          <ArticleProvider>
            <Scanlines />
            <ScreenJitter>
            <div className="app-container">
              {route.view === 'feed' && (
                <FeedView
                  onArticleClick={navigateToArticle}
                  scrollPosition={navigationState.scrollPosition}
                  onScrollPositionChange={handleScrollPositionChange}
                  onNavigateToCurator={navigateToCurator}
                />
              )}
              {route.view === 'article' && (
                <ArticleView
                  articleId={route.articleId}
                  onBack={navigateToFeed}
                />
              )}
              {route.view === 'curator' && (
                <CuratorView onNavigateToFeed={navigateToFeed} />
              )}
            </div>
          </ScreenJitter>
          
          {/* Random spooky visual effects */}
          {activeEffect === 'spider' && <CrawlingSpider onComplete={clearEffect} />}
          {activeEffect === 'ghost' && <FloatingGhost onComplete={clearEffect} />}
          {activeEffect === 'glitch' && <GlitchEffect onComplete={clearEffect} />}
          {activeEffect === 'jumpscare' && <JumpScare onComplete={clearEffect} />}
          {activeEffect === 'shadow' && <ShadowFigure onComplete={clearEffect} />}
          </ArticleProvider>
        </NarratorProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  );
}

export default App;
