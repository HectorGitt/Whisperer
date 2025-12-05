import { useEffect, useState } from 'react';
import styles from './OnboardingModal.module.css';

const ONBOARDING_KEY = 'whisperer-onboarding-seen';

export function OnboardingModal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem(ONBOARDING_KEY);
    if (!hasSeenOnboarding) {
      // Small delay for dramatic effect
      setTimeout(() => setIsVisible(true), 500);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Welcome... to the Darkness</h2>
        </div>

        <div className={styles.content}>
          <div className={styles.feature}>
            <span className={styles.icon}>👻</span>
            <div>
              <h3>Horror Stories</h3>
              <p>Curated creepypasta and scary tales await you</p>
            </div>
          </div>

          <div className={styles.feature}>
            <span className={styles.icon}>🎵</span>
            <div>
              <h3>Atmospheric Audio</h3>
              <p>Random background music plays with each story</p>
            </div>
          </div>

          <div className={styles.feature}>
            <span className={styles.icon}>🔊</span>
            <div>
              <h3>Auto-Narration</h3>
              <p>Stories are read aloud automatically with a creepy voice</p>
              <small>Click any paragraph to start from there</small>
            </div>
          </div>

          <div className={styles.feature}>
            <span className={styles.icon}>👻</span>
            <div>
              <h3>Spooky Effects</h3>
              <p>Random scares appear: spiders, ghosts, glitches, jumpscares</p>
            </div>
          </div>

          <div className={styles.feature}>
            <span className={styles.icon}>🖥️</span>
            <div>
              <h3>CRT Aesthetic</h3>
              <p>Retro monitor effects with scanlines and screen jitter</p>
              <small>Hover over each paragraph to reveal the text</small>
            </div>
          </div>

          <div className={styles.feature}>
            <span className={styles.icon}>⚙️</span>
            <div>
              <h3>Settings</h3>
              <p>Disable narrator, reduce motion, or turn off blur effects</p>
            </div>
          </div>

          <div className={styles.warning}>
            ⚠️ <strong>Important:</strong> Click anywhere to enable audio (browser requirement)
          </div>
        </div>

        <button className={styles.closeButton} onClick={handleClose}>
          Enter the Void
        </button>
      </div>
    </div>
  );
}
