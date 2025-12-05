import { useState, useRef, type FormEvent } from 'react';
import { useArticles } from '../contexts/ArticleContext';
import { BlurOnIdle } from '../components/BlurOnIdle';
import { ValidationError } from '../utils/errors';
import { parseFile, isValidFileType, ACCEPTED_FILE_TYPES } from '../utils/fileParser';
import styles from './CuratorView.module.css';

interface CuratorViewProps {
  onNavigateToFeed: () => void;
}

interface FormData {
  title: string;
  content: string;
  source: string;
  category: 'tech' | 'spooky';
}

interface FormErrors {
  title?: string;
  content?: string;
  source?: string;
  category?: string;
  general?: string;
}

export function CuratorView({ onNavigateToFeed }: CuratorViewProps) {
  const { addArticle } = useArticles();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    source: '',
    category: 'tech',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!isValidFileType(file)) {
      setErrors({
        general: 'Invalid file type. Please upload a PDF, TXT, or Markdown file.',
      });
      return;
    }

    setIsUploading(true);
    setErrors({});

    try {
      const parsed = await parseFile(file);
      
      // Update form with parsed content
      setFormData(prev => ({
        ...prev,
        title: parsed.title || prev.title,
        content: parsed.content,
        source: prev.source || file.name,
      }));
    } catch (error) {
      setErrors({
        general: `Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Add the article
      addArticle({
        title: formData.title,
        content: formData.content,
        source: formData.source,
        category: formData.category,
        preview: formData.content.substring(0, 150),
      });

      // Navigate back to feed after successful submission
      onNavigateToFeed();
    } catch (error) {
      if (error instanceof ValidationError) {
        setErrors(prev => ({
          ...prev,
          [error.field]: error.message,
        }));
      } else {
        setErrors({
          general: 'Failed to add article. Please try again.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.curatorView} data-testid="curator-view">
      <header className={styles.header}>
        <BlurOnIdle>
          <h1 className={styles.title}>CURATOR CONSOLE</h1>
        </BlurOnIdle>
        <BlurOnIdle>
          <p className={styles.subtitle}>Add new articles to the feed</p>
        </BlurOnIdle>
      </header>

      <button
        className={styles.backButton}
        onClick={onNavigateToFeed}
        type="button"
        aria-label="Return to feed"
      >
        <BlurOnIdle>
          <span className={styles.backIcon}>←</span>
          <span className={styles.backText}>BACK TO FEED</span>
        </BlurOnIdle>
      </button>

      <form 
        className={styles.articleForm} 
        onSubmit={handleSubmit}
        data-testid="article-form"
      >
        {errors.general && (
          <div className={styles.errorBanner} role="alert">
            <BlurOnIdle>
              {errors.general}
            </BlurOnIdle>
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="file-upload" className={styles.label}>
            <BlurOnIdle>Upload File (PDF, TXT, Markdown)</BlurOnIdle>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            id="file-upload"
            accept={ACCEPTED_FILE_TYPES}
            onChange={handleFileUpload}
            className={styles.fileInput}
            disabled={isUploading}
            data-testid="file-upload"
          />
          {isUploading && (
            <span className={styles.uploadingMessage}>
              Parsing file...
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            <BlurOnIdle>Title *</BlurOnIdle>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'title-error' : undefined}
            data-testid="title-input"
          />
          {errors.title && (
            <span 
              id="title-error" 
              className={styles.errorMessage}
              role="alert"
            >
              {errors.title}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="source" className={styles.label}>
            <BlurOnIdle>Source *</BlurOnIdle>
          </label>
          <input
            type="text"
            id="source"
            name="source"
            value={formData.source}
            onChange={handleInputChange}
            className={`${styles.input} ${errors.source ? styles.inputError : ''}`}
            aria-invalid={!!errors.source}
            aria-describedby={errors.source ? 'source-error' : undefined}
            data-testid="source-input"
          />
          {errors.source && (
            <span 
              id="source-error" 
              className={styles.errorMessage}
              role="alert"
            >
              {errors.source}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category" className={styles.label}>
            <BlurOnIdle>Category *</BlurOnIdle>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className={`${styles.select} ${errors.category ? styles.inputError : ''}`}
            aria-invalid={!!errors.category}
            aria-describedby={errors.category ? 'category-error' : undefined}
            data-testid="category-select"
          >
            <option value="tech">Tech</option>
            <option value="spooky">Spooky</option>
          </select>
          {errors.category && (
            <span 
              id="category-error" 
              className={styles.errorMessage}
              role="alert"
            >
              {errors.category}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content" className={styles.label}>
            <BlurOnIdle>Content *</BlurOnIdle>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            className={`${styles.textarea} ${errors.content ? styles.inputError : ''}`}
            rows={12}
            aria-invalid={!!errors.content}
            aria-describedby={errors.content ? 'content-error' : undefined}
            data-testid="content-textarea"
          />
          {errors.content && (
            <span 
              id="content-error" 
              className={styles.errorMessage}
              role="alert"
            >
              {errors.content}
            </span>
          )}
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
          data-testid="submit-button"
        >
          <BlurOnIdle>
            {isSubmitting ? 'SUBMITTING...' : 'SUBMIT ARTICLE'}
          </BlurOnIdle>
        </button>
      </form>
    </div>
  );
}
