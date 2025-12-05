import { useEffect, useState } from 'react';
import { useArticles } from '../contexts/ArticleContext';
import { useNarrator } from '../contexts/NarratorContext';
import { BlurOnIdle } from '../components/BlurOnIdle';
import { audioManager } from '../utils/AudioManager';
import styles from './ArticleView.module.css';

interface ArticleViewProps {
  articleId: string;
  onBack: () => void;
}

export function ArticleView({ articleId, onBack }: ArticleViewProps) {
  const { articles, deleteArticle } = useArticles();
  const { narrateArticleTitle, speak, stop, enabled: narratorEnabled, isSpeaking } = useNarrator();
  const [isNarrating, setIsNarrating] = useState(false);
  const [startParagraph, setStartParagraph] = useState(0);
  
  // Find the article by ID
  const article = articles.find(a => a.id === articleId);
  
  // Play background ambient for all articles (all are spooky now)
  useEffect(() => {
    if (article) {
      // Use AudioManager to get a random ambient sound from the full list
      const randomAmbient = audioManager.getRandomAmbientSound();
      console.log('ArticleView: Playing background ambient:', randomAmbient);
      // Play as looping background music
      audioManager.playSound(randomAmbient, true);
    }
    
    // Stop background music when leaving article
    return () => {
      console.log('ArticleView: Stopping background music');
      audioManager.stopAll();
    };
  }, [article?.id]);
  
  // Auto-narrate full article content when enabled (only once per article)
  useEffect(() => {
    if (!article) return;
    
    if (narratorEnabled && !isNarrating && !isSpeaking) {
      console.log('ArticleView: Auto-starting narration for:', article.title);
      // Small delay to let page load and voices to load
      const timer = setTimeout(() => {
        const fullText = `${article.title}. ${article.content}`;
        speak(fullText);
        setIsNarrating(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    } else {
      console.log('ArticleView: Skipping auto-narration', { 
        narratorEnabled, 
        isNarrating,
        isSpeaking
      });
    }
    // Only depend on article.id to run once per article
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article?.id]);

  // Stop narration only when leaving the article (navigating away)
  useEffect(() => {
    return () => {
      // Only stop if we're actually leaving (article ID changed or unmounting)
      console.log('ArticleView: Component unmounting, stopping narrator');
      stop();
      setIsNarrating(false);
    };
    // Empty dependency array - only runs on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If article not found, show error state
  if (!article) {
    return (
      <div className={styles.articleView} data-testid="article-view">
        <BackButton onClick={onBack} />
        <div className={styles.errorState} data-testid="article-not-found">
          <BlurOnIdle>
            <p className={styles.errorMessage}>
              Article not found. The void has consumed it...
            </p>
          </BlurOnIdle>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this article? It will be lost to the void forever...')) {
      deleteArticle(articleId);
      onBack();
    }
  };

  const handleNarrateToggle = () => {
    if (!narratorEnabled) {
      alert('Narrator is disabled. Enable it in settings to hear articles read aloud.');
      return;
    }

    if (isSpeaking || isNarrating) {
      // Stop/pause narration
      stop();
      setIsNarrating(false);
    } else {
      // Start/resume narration from beginning
      const fullText = `${article.title}. ${article.content}`;
      speak(fullText);
      setIsNarrating(true);
      setStartParagraph(0);
    }
  };

  const handleParagraphClick = (paragraphIndex: number) => {
    if (!narratorEnabled) {
      alert('Narrator is disabled. Enable it in settings to hear articles read aloud.');
      return;
    }

    // Stop current narration
    stop();
    
    // Get paragraphs
    const paragraphs = article.content.split('\n\n').filter(p => p.trim());
    
    // Create text from selected paragraph onwards
    const textFromParagraph = paragraphs.slice(paragraphIndex).join('. ');
    
    // Start narrating from this paragraph
    speak(textFromParagraph);
    setIsNarrating(true);
    setStartParagraph(paragraphIndex);
  };

  return (
    <div className={styles.articleView} data-testid="article-view">
      <div className={styles.topBar}>
        <BackButton onClick={onBack} />
        <div className={styles.actionButtons}>
          <button 
            className={`${styles.narrateButton} ${(isSpeaking || isNarrating) ? styles.narrating : ''}`}
            onClick={handleNarrateToggle}
            aria-label={(isSpeaking || isNarrating) ? 'Stop narration' : 'Narrate article'}
            title={(isSpeaking || isNarrating) ? 'Stop narration' : 'Narrate article'}
            data-testid="narrate-button"
          >
            <BlurOnIdle>
              <span className={styles.narrateIcon}>{(isSpeaking || isNarrating) ? '⏸️' : '🔊'}</span>
              <span className={styles.narrateText}>{(isSpeaking || isNarrating) ? 'STOP' : 'NARRATE'}</span>
            </BlurOnIdle>
          </button>
          <button 
            className={styles.deleteButton}
            onClick={handleDelete}
            aria-label="Delete article"
            title="Delete article"
          >
            <BlurOnIdle>
              <span className={styles.deleteIcon}>🗑️</span>
              <span className={styles.deleteText}>DELETE</span>
            </BlurOnIdle>
          </button>
        </div>
      </div>
      
      <article 
        className={styles.article}
        role="article"
        aria-labelledby={`article-${article.id}-title`}
      >
        <header className={styles.articleHeader}>
          <BlurOnIdle>
            <h1 
              id={`article-${article.id}-title`}
              className={styles.articleTitle}
              data-testid="article-view-title"
            >
              {article.title}
            </h1>
          </BlurOnIdle>
          
          <BlurOnIdle>
            <div className={styles.articleMeta} data-testid="article-meta">
              <span className={styles.source}>{article.source}</span>
              <span className={styles.separator}>•</span>
              <time 
                className={styles.timestamp}
                dateTime={new Date(article.timestamp).toISOString()}
              >
                {new Date(article.timestamp).toLocaleDateString()}
              </time>
              <span className={styles.separator}>•</span>
              <span className={styles.category}>{article.category}</span>
            </div>
          </BlurOnIdle>
        </header>

        <div className={styles.articleContent}>
          <BlurOnIdle>
            <div 
              className={styles.content}
              data-testid="article-content"
            >
              {article.content.split('\n\n').filter(p => p.trim()).map((paragraph, index) => (
                <p 
                  key={index}
                  onClick={() => handleParagraphClick(index)}
                  style={{ 
                    cursor: narratorEnabled ? 'pointer' : 'default',
                    marginBottom: '1em'
                  }}
                  title={narratorEnabled ? 'Click to start narration from here' : ''}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </BlurOnIdle>
        </div>
      </article>
    </div>
  );
}

interface BackButtonProps {
  onClick: () => void;
}

function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      className={styles.backButton}
      onClick={onClick}
      data-testid="back-button"
      aria-label="Return to feed"
    >
      <BlurOnIdle>
        <span className={styles.backIcon}>←</span>
        <span className={styles.backText}>BACK TO FEED</span>
      </BlurOnIdle>
    </button>
  );
}
