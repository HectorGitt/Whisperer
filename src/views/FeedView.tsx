import { useEffect, useRef, useState } from 'react';
import { useArticles } from '../contexts/ArticleContext';
import { ArticleCard } from '../components/ArticleCard';
import { CategoryFilter } from '../components/CategoryFilter';
import { BlurOnIdle } from '../components/BlurOnIdle';
import { SettingsPanel } from '../components/SettingsPanel';
import { useDebounce } from '../hooks/useDebounce';
import styles from './FeedView.module.css';

interface FeedViewProps {
  onArticleClick: (id: string) => void;
  scrollPosition?: number;
  onScrollPositionChange?: (position: number) => void;
  onNavigateToCurator?: () => void;
}

export function FeedView({ onArticleClick, scrollPosition, onScrollPositionChange, onNavigateToCurator }: FeedViewProps) {
  const { filteredArticles, filterState, setFilterState } = useArticles();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pendingFilter, setPendingFilter] = useState(filterState.category);
  const debouncedFilter = useDebounce(pendingFilter, 150);

  // Sort articles by timestamp (newest first)
  const sortedArticles = [...filteredArticles].sort((a, b) => b.timestamp - a.timestamp);

  // Apply debounced filter to actual filter state
  useEffect(() => {
    setFilterState({ ...filterState, category: debouncedFilter });
  }, [debouncedFilter]);

  // Restore scroll position when component mounts
  useEffect(() => {
    if (scrollPosition !== undefined && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  // Track scroll position
  const handleScroll = () => {
    if (scrollContainerRef.current && onScrollPositionChange) {
      onScrollPositionChange(scrollContainerRef.current.scrollTop);
    }
  };

  const handleFilterChange = (category: 'all' | 'tech' | 'spooky') => {
    setPendingFilter(category);
  };

  return (
    <div className={styles.feedView} data-testid="feed-view">
      <header className={styles.header}>
        <BlurOnIdle>
          <h1 className={styles.title}>THE DOOM SCROLL</h1>
        </BlurOnIdle>
        <BlurOnIdle>
          <p className={styles.subtitle}>Curated tech articles and spooky stories</p>
        </BlurOnIdle>
        <div className={styles.headerButtons}>
          {onNavigateToCurator && (
            <button
              className={styles.curatorButton}
              onClick={onNavigateToCurator}
              aria-label="Add new article"
            >
              <BlurOnIdle>
                <span className={styles.curatorIcon}>+</span>
                <span className={styles.curatorText}>ADD ARTICLE</span>
              </BlurOnIdle>
            </button>
          )}
          <button
            className={styles.settingsButton}
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Open settings"
          >
            <BlurOnIdle>
              <span className={styles.settingsIcon}>⚙</span>
              <span className={styles.settingsText}>SETTINGS</span>
            </BlurOnIdle>
          </button>
        </div>
      </header>

      <CategoryFilter
        currentFilter={filterState.category}
        onFilterChange={handleFilterChange}
      />

      <div
        className={styles.articleList}
        ref={scrollContainerRef}
        onScroll={handleScroll}
        data-testid="article-list"
      >
        {sortedArticles.length === 0 ? (
          <EmptyState />
        ) : (
          sortedArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onClick={onArticleClick}
            />
          ))
        )}
      </div>

      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div className={styles.emptyState} data-testid="empty-state">
      <BlurOnIdle>
        <p className={styles.emptyMessage}>
          No articles found. The void awaits...
        </p>
      </BlurOnIdle>
    </div>
  );
}
