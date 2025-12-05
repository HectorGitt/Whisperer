import { useAccessibility } from '../contexts/AccessibilityContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNarrator } from '../contexts/NarratorContext';
import { BlurOnIdle } from './BlurOnIdle';
import styles from './SettingsPanel.module.css';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { settings, updateSettings } = useAccessibility();
  const { theme, setTheme } = useTheme();
  const { enabled: narratorEnabled, setEnabled: setNarratorEnabled, isSupported: narratorSupported } = useNarrator();

  if (!isOpen) return null;

  const handleBlurToggle = () => {
    updateSettings({ disableBlur: !settings.disableBlur });
  };

  const handleMotionToggle = () => {
    updateSettings({ reduceMotion: !settings.reduceMotion });
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'green' ? 'amber' : 'green');
  };

  const handleNarratorToggle = () => {
    setNarratorEnabled(!narratorEnabled);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className={styles.overlay} 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div 
        className={styles.panel} 
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <header className={styles.header}>
          <BlurOnIdle>
            <h2 id="settings-title" className={styles.title}>SETTINGS</h2>
          </BlurOnIdle>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close settings"
          >
            <BlurOnIdle>×</BlurOnIdle>
          </button>
        </header>

        <div className={styles.settingsGroup}>
          <div className={styles.settingItem}>
            <label htmlFor="blur-toggle" className={styles.label}>
              <BlurOnIdle>
                <span className={styles.labelText}>Disable Blur Effects</span>
                <span className={styles.labelDescription}>
                  Remove blur-on-idle behavior from text
                </span>
              </BlurOnIdle>
            </label>
            <button
              id="blur-toggle"
              className={`${styles.toggle} ${settings.disableBlur ? styles.toggleActive : ''}`}
              onClick={handleBlurToggle}
              role="switch"
              aria-checked={settings.disableBlur}
              aria-label="Toggle blur effects"
              data-testid="blur-toggle"
            >
              <span className={styles.toggleSlider} />
            </button>
          </div>

          <div className={styles.settingItem}>
            <label htmlFor="motion-toggle" className={styles.label}>
              <BlurOnIdle>
                <span className={styles.labelText}>Reduce Motion</span>
                <span className={styles.labelDescription}>
                  Disable screen jitter and reduce animations
                </span>
              </BlurOnIdle>
            </label>
            <button
              id="motion-toggle"
              className={`${styles.toggle} ${settings.reduceMotion ? styles.toggleActive : ''}`}
              onClick={handleMotionToggle}
              role="switch"
              aria-checked={settings.reduceMotion}
              aria-label="Toggle reduced motion"
              data-testid="motion-toggle"
            >
              <span className={styles.toggleSlider} />
            </button>
          </div>

          <div className={styles.settingItem}>
            <label htmlFor="theme-toggle" className={styles.label}>
              <BlurOnIdle>
                <span className={styles.labelText}>Color Theme</span>
                <span className={styles.labelDescription}>
                  Switch between green and amber phosphor
                </span>
              </BlurOnIdle>
            </label>
            <button
              id="theme-toggle"
              className={`${styles.toggle} ${theme === 'amber' ? styles.toggleActive : ''}`}
              onClick={handleThemeToggle}
              role="switch"
              aria-checked={theme === 'amber'}
              aria-label={`Current theme: ${theme}. Click to switch`}
              data-testid="theme-toggle"
            >
              <span className={styles.toggleSlider} />
            </button>
          </div>

          {narratorSupported && (
            <div className={styles.settingItem}>
              <label htmlFor="narrator-toggle" className={styles.label}>
                <BlurOnIdle>
                  <span className={styles.labelText}>Spooky Narrator 🎙️</span>
                  <span className={styles.labelDescription}>
                    Enable creepy voice narration
                  </span>
                </BlurOnIdle>
              </label>
              <button
                id="narrator-toggle"
                className={`${styles.toggle} ${narratorEnabled ? styles.toggleActive : ''}`}
                onClick={handleNarratorToggle}
                role="switch"
                aria-checked={narratorEnabled}
                aria-label="Toggle narrator"
                data-testid="narrator-toggle"
              >
                <span className={styles.toggleSlider} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
