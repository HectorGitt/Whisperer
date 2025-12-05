import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from '../App';
import { ArticleRepository } from '../utils/ArticleRepository';

/**
 * Integration tests for complete user flows
 * Task 19: Final integration testing and polish
 * Requirements: All
 */
describe('Complete User Flows', () => {
  let originalHash: string;

  beforeEach(() => {
    originalHash = window.location.hash;
    window.location.hash = '';
    localStorage.clear();
  });

  afterEach(() => {
    window.location.hash = originalHash;
    localStorage.clear();
  });

  it('should complete full browse flow: view feed → click article → read → return', async () => {
    // Setup: Add test articles
    const repo = new ArticleRepository();
    const article = repo.add({
      title: 'Test Article',
      content: 'This is test content for the article.',
      preview: 'This is test content for the article.',
      source: 'Test Source',
      category: 'tech',
    });

    // Render app
    render(<App />);

    // Step 1: Verify feed view loads
    await waitFor(() => {
      expect(screen.getByTestId('feed-view')).toBeInTheDocument();
    });

    // Step 2: Find and click article
    const articleCard = screen.getByText('Test Article');
    expect(articleCard).toBeInTheDocument();
    
    fireEvent.click(articleCard);

    // Step 3: Verify article view loads
    await waitFor(() => {
      expect(screen.getByTestId('article-view')).toBeInTheDocument();
      expect(screen.getByText('This is test content for the article.')).toBeInTheDocument();
    });

    // Step 4: Click back button
    const backButton = screen.getByRole('button', { name: /return to feed/i });
    fireEvent.click(backButton);

    // Step 5: Verify return to feed
    await waitFor(() => {
      expect(screen.getByTestId('feed-view')).toBeInTheDocument();
    });
  });

  it('should complete filter flow: apply filter → view filtered results → clear filter', async () => {
    // Setup: Add articles of different categories
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

    // Wait for feed to load
    await waitFor(() => {
      expect(screen.getByTestId('feed-view')).toBeInTheDocument();
    });

    // Verify both articles are visible initially
    expect(screen.getByText('Tech Article')).toBeInTheDocument();
    expect(screen.getByText('Spooky Story')).toBeInTheDocument();

    // Apply tech filter
    const techButton = screen.getByRole('button', { name: /tech/i });
    fireEvent.click(techButton);

    // Verify only tech article is visible
    await waitFor(() => {
      expect(screen.getByText('Tech Article')).toBeInTheDocument();
      expect(screen.queryByText('Spooky Story')).not.toBeInTheDocument();
    });

    // Clear filter (click "all")
    const allButton = screen.getByRole('button', { name: /all/i });
    fireEvent.click(allButton);

    // Verify both articles are visible again
    await waitFor(() => {
      expect(screen.getByText('Tech Article')).toBeInTheDocument();
      expect(screen.getByText('Spooky Story')).toBeInTheDocument();
    });
  });

  it('should complete add article flow: navigate to curator → fill form → submit → view in feed', async () => {
    render(<App />);

    // Navigate to curator view
    window.location.hash = 'curator';
    window.dispatchEvent(new HashChangeEvent('hashchange'));

    await waitFor(() => {
      expect(screen.getByTestId('curator-view')).toBeInTheDocument();
    });

    // Fill out form
    const titleInput = screen.getByLabelText(/title/i);
    const contentInput = screen.getByLabelText(/content/i);
    const sourceInput = screen.getByLabelText(/source/i);
    const categorySelect = screen.getByLabelText(/category/i);

    fireEvent.change(titleInput, { target: { value: 'New Article' } });
    fireEvent.change(contentInput, { target: { value: 'This is new article content.' } });
    fireEvent.change(sourceInput, { target: { value: 'New Source' } });
    fireEvent.change(categorySelect, { target: { value: 'tech' } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit article/i });
    fireEvent.click(submitButton);

    // Should navigate back to feed
    await waitFor(() => {
      expect(screen.getByTestId('feed-view')).toBeInTheDocument();
    });

    // Verify new article appears in feed
    expect(screen.getByText('New Article')).toBeInTheDocument();
  });

  it('should maintain filter state across navigation', async () => {
    // Setup: Add articles
    const repo = new ArticleRepository();
    const article = repo.add({
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

    // Apply tech filter
    const techButton = screen.getByRole('button', { name: /tech/i });
    fireEvent.click(techButton);

    await waitFor(() => {
      expect(screen.getByText('Tech Article')).toBeInTheDocument();
      expect(screen.queryByText('Spooky Story')).not.toBeInTheDocument();
    });

    // Navigate to article
    const articleCard = screen.getByText('Tech Article');
    fireEvent.click(articleCard);

    await waitFor(() => {
      expect(screen.getByTestId('article-view')).toBeInTheDocument();
    });

    // Navigate back
    const backButton = screen.getByRole('button', { name: /return to feed/i });
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.getByTestId('feed-view')).toBeInTheDocument();
    });

    // Verify filter is still applied
    expect(screen.getByText('Tech Article')).toBeInTheDocument();
    expect(screen.queryByText('Spooky Story')).not.toBeInTheDocument();
  });
});
