import { memo } from 'react';
import type { Article } from '../types';
import { BlurOnIdle } from './BlurOnIdle';
import styles from './ArticleCard.module.css';

interface ArticleCardProps {
  article: Article;
  onClick: (id: string) => void;
}

function ArticleCardComponent({ article, onClick }: ArticleCardProps) {
  const handleClick = () => {
    onClick(article.id);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(article.id);
    }
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <article
      className={styles.card}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="article"
      aria-label={`${article.title} from ${article.source}`}
      data-testid="article-card"
    >
      <BlurOnIdle>
        <h2 className={styles.title} data-testid="article-title">
          {article.title}
        </h2>
      </BlurOnIdle>

      <div className={styles.metadata}>
        <BlurOnIdle>
          <span className={styles.source} data-testid="article-source">
            {article.source}
          </span>
        </BlurOnIdle>
        <BlurOnIdle>
          <span className={styles.timestamp} data-testid="article-timestamp">
            {formatTimestamp(article.timestamp)}
          </span>
        </BlurOnIdle>
      </div>

      <BlurOnIdle>
        <p className={styles.preview} data-testid="article-preview">
          {article.preview}
        </p>
      </BlurOnIdle>
    </article>
  );
}

// Wrap with React.memo to prevent unnecessary re-renders
export const ArticleCard = memo(ArticleCardComponent);
