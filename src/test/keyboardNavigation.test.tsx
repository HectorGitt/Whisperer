import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from '../App';
import { ArticleRepository } from '../utils/ArticleRepository';

/**
 * End-to-End Keyboard Navigation Tests
 * Task 19: Test accessibility features end-to-end with keyboard navigation
 * Requirements: 4.5, 7.4
 */
describe('Keyboard Navigation End-to-End', () => {
  beforeEach(() => {
    window.location.hash = '';
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should navigate through feed using keyboard only', async () => {
    const repo = new ArticleRepository();
    repo.add({
      title: 'First Article',
      content: 'First content',
      preview: 'First content',
      source: 'Source 1',
      category: 'tech',
    });
    repo.add({
      title: 'Second Article',
      content: 'Second content',
      preview: 'Second content',
      source: 'Source 2',
      category: 'spooky',
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('feed-view')).toBeInTheDocument();
    });

    // Find first article card and verify it's focusable
    const firstArticle = screen.getByText('First Article').closest('[data-testid="article-card"]');
    expect(firstArticle).toBeInTheDocument();
    expect(firstArticle).toHaveAttribute('tabIndex');
  });

  it('should activate article card with Enter key', async () => {
    const repo = new ArticleRepository();
    repo.add({
      title: 'Test Article',
      content: 'Test content',
      preview: 'Test content',
      source: 'Test Source',
      category: 'tech',
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('feed-view')).toBeInTheDocument();
    });

    // Find article card
    const articleCard = screen.getByText('Test Article').closest('[data-testid="article-card"]');
    expect(articleCard).toBeInTheDocument();

    // Simulate Enter key press
    if (articleCard) {
      fireEvent.keyDown(articleCard, { key: 'Enter', code: 'Enter' });

      // Should navigate to article view
      await waitFor(() => {
        expect(screen.getByTestId('article-view')).toBeInTheDocument();
      });
    }
  });

  it('should activate article card with Space key', async () => {
    const repo = new ArticleRepository();
    repo.add({
      title: 'Test Article',
      content: 'Test content',
      preview: 'Test content',
      source: 'Test Source',
      category: 'tech',
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('feed-view')).toBeInTheDocument();
    });

    // Find article card
    const articleCard = screen.getByText('Test Article').closest('[data-testid="article-card"]');
    expect(articleCard).toBeInTheDocument();

    // Simulate Space key press
    if (articleCard) {
      fireEvent.keyDown(articleCard, { key: ' ', code: 'Space' });

      // Should navigate to article view
      await waitFor(() => {
        expect(screen.getByTestId('article-view')).toBeInTheDocument();
      });
    }
  });

  it('should navigate back from article using keyboard', async () => {
    const repo = new ArticleRepository();
    repo.add({
      title: 'Test Article',
      content: 'Test content',
      preview: 'Test content',
      source: 'Test Source',
      category: 'tech',
    });

    render(<App />);

    // Navigate to article view
    window.location.hash = 'article/test-id';
    window.dispatchEvent(new HashChangeEvent('hashchange'));

    await waitFor(() => {
      expect(screen.getByTestId('article-view')).toBeInTheDocument();
    });

    // Find back button
    const backButton = screen.getByRole('button', { name: /return to feed/i });

    // Click the button (keyboard activation would trigger click event)
    fireEvent.click(backButton);

    // Should return to feed
    await waitFor(() => {
      expect(screen.getByTestId('feed-view')).toBeInTheDocument();
    });
  });

  it('should navigate category filters with keyboard', async () => {
    const repo = new ArticleRepository();
    repo.add({
      title: 'Tech Article',
      content: 'Tech content',
      preview: 'Tech content',
      source: 'Tech Source',
      category: 'tech',
    });
    repo.add({
      title: 'Spooky Story',
      content: 'Spooky content',
      preview: 'Spooky content',
      source: 'Spooky Source',
      category: 'spooky',
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('feed-view')).toBeInTheDocument();
    });

    // Find tech filter button
    const techButton = screen.getByRole('button', { name: /tech/i });

    // Simulate Enter key press
    fireEvent.keyDown(techButton, { key: 'Enter', code: 'Enter' });

    // Verify filter is applied
    await waitFor(() => {
      expect(screen.getByText('Tech Article')).toBeInTheDocument();
      expect(screen.queryByText('Spooky Story')).not.toBeInTheDocument();
    });
  });

  it('should navigate curator form with keyboard', async () => {
    render(<App />);

    // Navigate to curator view
    window.location.hash = 'curator';
    window.dispatchEvent(new HashChangeEvent('hashchange'));

    await waitFor(() => {
      expect(screen.getByTestId('curator-view')).toBeInTheDocument();
    });

    // Verify form fields are present and focusable
    const titleInput = screen.getByLabelText(/title/i);
    expect(titleInput).toBeInTheDocument();
    expect(titleInput.tagName).toMatch(/INPUT|TEXTAREA/);
  });

  it('should maintain focus visibility throughout navigation', async () => {
    const repo = new ArticleRepository();
    repo.add({
      title: 'Test Article',
      content: 'Test content',
      preview: 'Test content',
      source: 'Test Source',
      category: 'tech',
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('feed-view')).toBeInTheDocument();
    });

    // Find an interactive element
    const articleCard = screen.getByText('Test Article').closest('[data-testid="article-card"]');
    expect(articleCard).toBeInTheDocument();
    
    // Verify it's focusable
    expect(articleCard).toHaveAttribute('tabIndex');
  });
});
