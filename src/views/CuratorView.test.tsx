import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CuratorView } from './CuratorView';
import { ArticleProvider } from '../contexts/ArticleContext';
import { AccessibilityProvider } from '../contexts/AccessibilityContext';
import { ArticleRepository } from '../utils/ArticleRepository';

describe('CuratorView', () => {
  it('should render the curator form with all required fields', () => {
    const mockNavigate = vi.fn();
    
    render(
      <AccessibilityProvider>
        <ArticleProvider>
          <CuratorView onNavigateToFeed={mockNavigate} />
        </ArticleProvider>
      </AccessibilityProvider>
    );

    expect(screen.getByTestId('curator-view')).toBeInTheDocument();
    expect(screen.getByTestId('article-form')).toBeInTheDocument();
    expect(screen.getByTestId('title-input')).toBeInTheDocument();
    expect(screen.getByTestId('source-input')).toBeInTheDocument();
    expect(screen.getByTestId('category-select')).toBeInTheDocument();
    expect(screen.getByTestId('content-textarea')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('should display validation errors for empty fields', async () => {
    const mockNavigate = vi.fn();
    
    render(
      <AccessibilityProvider>
        <ArticleProvider>
          <CuratorView onNavigateToFeed={mockNavigate} />
        </ArticleProvider>
      </AccessibilityProvider>
    );

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  it('should submit valid article and navigate to feed', async () => {
    const mockNavigate = vi.fn();
    const mockRepo = new ArticleRepository();
    
    render(
      <AccessibilityProvider>
        <ArticleProvider repository={mockRepo}>
          <CuratorView onNavigateToFeed={mockNavigate} />
        </ArticleProvider>
      </AccessibilityProvider>
    );

    // Fill in the form
    fireEvent.change(screen.getByTestId('title-input'), {
      target: { value: 'Test Article' },
    });
    fireEvent.change(screen.getByTestId('source-input'), {
      target: { value: 'Test Source' },
    });
    fireEvent.change(screen.getByTestId('category-select'), {
      target: { value: 'tech' },
    });
    fireEvent.change(screen.getByTestId('content-textarea'), {
      target: { value: 'This is test content for the article.' },
    });

    // Submit the form
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    // Wait for navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });

    // Verify article was added
    const articles = mockRepo.getAll();
    expect(articles).toHaveLength(1);
    expect(articles[0].title).toBe('Test Article');
    expect(articles[0].source).toBe('Test Source');
    expect(articles[0].category).toBe('tech');
  });

  it('should clear field errors when user starts typing', async () => {
    const mockNavigate = vi.fn();
    
    render(
      <AccessibilityProvider>
        <ArticleProvider>
          <CuratorView onNavigateToFeed={mockNavigate} />
        </ArticleProvider>
      </AccessibilityProvider>
    );

    // Submit empty form to trigger errors
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });

    // Start typing in title field
    fireEvent.change(screen.getByTestId('title-input'), {
      target: { value: 'T' },
    });

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
    });
  });

  it('should have back button that navigates to feed', () => {
    const mockNavigate = vi.fn();
    
    render(
      <AccessibilityProvider>
        <ArticleProvider>
          <CuratorView onNavigateToFeed={mockNavigate} />
        </ArticleProvider>
      </AccessibilityProvider>
    );

    const backButtons = screen.getAllByRole('button', { name: /return to feed/i });
    fireEvent.click(backButtons[0]);

    expect(mockNavigate).toHaveBeenCalled();
  });
});
