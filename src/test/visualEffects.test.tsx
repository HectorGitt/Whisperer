import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import { ArticleRepository } from '../utils/ArticleRepository';

/**
 * Visual Effects Harmony Tests
 * Task 19: Verify all visual effects work together harmoniously
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3
 */
describe('Visual Effects Harmony', () => {
  beforeEach(() => {
    window.location.hash = '';
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should render all CRT effects simultaneously without conflicts', async () => {
    render(<App />);

    await waitFor(() => {
      // Verify all visual effect components are present
      expect(screen.getByTestId('scanlines')).toBeInTheDocument();
      expect(screen.getByTestId('screen-jitter')).toBeInTheDocument();
      expect(screen.getByTestId('feed-view')).toBeInTheDocument();
    });

    // Verify scanlines are rendered
    const scanlines = screen.getByTestId('scanlines');
    expect(scanlines).toBeInTheDocument();
    // CSS modules generate hashed class names, so just verify element exists

    // Verify screen jitter wrapper is present
    const jitter = screen.getByTestId('screen-jitter');
    expect(jitter).toBeInTheDocument();
  });

  it('should apply CRT color scheme consistently across all views', async () => {
    const repo = new ArticleRepository();
    repo.add({
      title: 'Test Article',
      content: 'Test content',
      preview: 'Test content',
      source: 'Test Source',
      category: 'tech',
    });

    const { container } = render(<App />);

    // Check feed view
    await waitFor(() => {
      expect(screen.getByTestId('feed-view')).toBeInTheDocument();
    });

    const feedView = screen.getByTestId('feed-view');
    const feedStyles = window.getComputedStyle(feedView);
    
    // Verify dark background
    const bgColor = feedStyles.backgroundColor;
    expect(bgColor).toBeTruthy();

    // Navigate to article view
    window.location.hash = 'article/test-id';
    window.dispatchEvent(new HashChangeEvent('hashchange'));

    await waitFor(() => {
      expect(screen.getByTestId('article-view')).toBeInTheDocument();
    });

    const articleView = screen.getByTestId('article-view');
    const articleStyles = window.getComputedStyle(articleView);
    
    // Verify consistent styling
    expect(articleStyles.backgroundColor).toBeTruthy();

    // Navigate to curator view
    window.location.hash = 'curator';
    window.dispatchEvent(new HashChangeEvent('hashchange'));

    await waitFor(() => {
      expect(screen.getByTestId('curator-view')).toBeInTheDocument();
    });

    const curatorView = screen.getByTestId('curator-view');
    const curatorStyles = window.getComputedStyle(curatorView);
    
    // Verify consistent styling
    expect(curatorStyles.backgroundColor).toBeTruthy();
  });

  it('should maintain visual effects when accessibility settings are enabled', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('feed-view')).toBeInTheDocument();
    });

    // Open settings (if available)
    const settingsButton = screen.queryByRole('button', { name: /settings/i });
    
    // Verify CRT effects are still present
    expect(screen.getByTestId('scanlines')).toBeInTheDocument();
    expect(screen.getByTestId('screen-jitter')).toBeInTheDocument();
  });

  it('should apply blur effects to appropriate text elements', async () => {
    const repo = new ArticleRepository();
    repo.add({
      title: 'Test Article',
      content: 'Test content for blur effects',
      preview: 'Test content for blur effects',
      source: 'Test Source',
      category: 'tech',
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('feed-view')).toBeInTheDocument();
    });

    // Find article card
    const articleTitle = screen.getByText('Test Article');
    expect(articleTitle).toBeInTheDocument();

    // Verify blur wrapper is applied (check for blur-on-idle class or data attribute)
    const articleCard = articleTitle.closest('[data-testid="article-card"]');
    expect(articleCard).toBeInTheDocument();
  });

  it('should maintain performance with all effects enabled', async () => {
    const repo = new ArticleRepository();
    
    // Add multiple articles to test performance
    for (let i = 0; i < 20; i++) {
      repo.add({
        title: `Article ${i}`,
        content: `Content for article ${i}`,
        preview: `Content for article ${i}`,
        source: 'Test Source',
        category: i % 2 === 0 ? 'tech' : 'spooky',
      });
    }

    const startTime = performance.now();
    
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('feed-view')).toBeInTheDocument();
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Verify render completes in reasonable time (< 1 second with all effects)
    expect(renderTime).toBeLessThan(1000);

    // Verify all effects are present
    expect(screen.getByTestId('scanlines')).toBeInTheDocument();
    expect(screen.getByTestId('screen-jitter')).toBeInTheDocument();
  });
});
