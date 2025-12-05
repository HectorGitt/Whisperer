/**
 * Audio Manager for handling sound effects
 * Manages audio playback with volume control and queuing
 */

// Longer audio files for background music (>2MB, longer duration)
const AMBIENT_SOUNDS = [
  '/media/sounds/Abyss.mp3',                                    // 2.8MB
  '/media/sounds/CrEEP.mp3',                                    // 3.6MB
  '/media/sounds/Dark Rooms and Scary Things - isaiah658.mp3', // 2.5MB
  '/media/sounds/Scary Ambient Wind.mp3',                       // 4.9MB
  '/media/sounds/down to business.wav',                         // 4.9MB
  '/media/sounds/Is Anybody Home_.wav',                         // 5.5MB
  '/media/sounds/Scary-Monster.flac',                           // 4.2MB
  '/media/sounds/trappist.wav',                                 // 10.5MB
  '/media/sounds/amb_01.ogg',                                   // 2.4MB
  '/media/sounds/amb_02.ogg',                                   // 1.8MB
  '/media/sounds/amb_03.ogg',                                   // 1.8MB
];

export class AudioManager {
  private audioElements: Map<string, HTMLAudioElement> = new Map();
  private volume: number = 0.3; // Default volume (30%)
  private enabled: boolean = true;
  private backgroundAudio: HTMLAudioElement | null = null;
  private userInteracted: boolean = false;
  private interactionListenersAttached: boolean = false;
  
  constructor() {
    this.setupInteractionListeners();
    
    // Preload common sounds (but don't play yet)
    this.preloadSound('/media/sounds/Abyss.mp3');
    this.preloadSound('/media/sounds/ghost_1.flac');
  }
  
  /**
   * Setup listeners for user interaction
   */
  private setupInteractionListeners(): void {
    if (this.interactionListenersAttached) return;
    
    const enableAudio = () => {
      this.userInteracted = true;
      console.log('Audio enabled after user interaction');
      this.removeInteractionListeners();
    };
    
    // Use capture phase to ensure we catch the event
    if (typeof document !== 'undefined') {
      document.addEventListener('click', enableAudio, { capture: true, once: true });
      document.addEventListener('keydown', enableAudio, { capture: true, once: true });
      document.addEventListener('touchstart', enableAudio, { capture: true, once: true });
      this.interactionListenersAttached = true;
    }
  }
  
  /**
   * Remove interaction listeners
   */
  private removeInteractionListeners(): void {
    this.interactionListenersAttached = false;
  }
  
  /**
   * Check if user has interacted
   */
  hasUserInteracted(): boolean {
    return this.userInteracted;
  }
  
  /**
   * Get a random ambient sound
   */
  getRandomAmbientSound(): string {
    return AMBIENT_SOUNDS[Math.floor(Math.random() * AMBIENT_SOUNDS.length)];
  }
  
  /**
   * Preload a sound file
   */
  preloadSound(soundFile: string): void {
    if (!this.audioElements.has(soundFile)) {
      const audio = new Audio(soundFile);
      audio.volume = this.volume;
      audio.preload = 'auto';
      this.audioElements.set(soundFile, audio);
    }
  }
  
  /**
   * Play a sound effect
   */
  async playSound(soundFile: string, loop: boolean = false): Promise<void> {
    if (!this.enabled) return;
    
    if (!this.userInteracted) {
      console.log('Waiting for user interaction before playing audio');
      return;
    }
    
    try {
      // Check if this sound is already playing
      let audio = this.audioElements.get(soundFile);
      
      if (audio && !audio.paused && audio.currentTime > 0) {
        // Already playing, don't interrupt
        console.log('Sound already playing:', soundFile);
        return;
      }
      
      // Preload if not already loaded
      if (!audio) {
        this.preloadSound(soundFile);
        audio = this.audioElements.get(soundFile);
      }
      
      if (!audio) return;
      
      audio.loop = loop;
      
      // Only reset if not currently playing
      if (audio.paused || audio.currentTime === 0) {
        audio.currentTime = 0;
      }
      
      await audio.play();
      console.log('Playing sound:', soundFile);
    } catch (error) {
      // Silently fail if autoplay is still blocked or interrupted
      if (error instanceof Error && error.name !== 'NotAllowedError' && error.name !== 'AbortError') {
        console.warn('Failed to play sound:', soundFile, error);
      }
    }
  }
  
  /**
   * Stop a specific sound
   */
  stopSound(soundFile: string): void {
    const audio = this.audioElements.get(soundFile);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }
  
  /**
   * Stop all sounds
   */
  stopAll(): void {
    this.audioElements.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }
  
  /**
   * Set volume for all sounds (0-1)
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.audioElements.forEach((audio) => {
      audio.volume = this.volume;
    });
  }
  
  /**
   * Enable or disable all sounds
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.stopAll();
    }
  }
  
  /**
   * Play multiple sounds with delay between them
   */
  async playSoundsSequentially(
    soundFiles: string[],
    delayMs: number = 1000
  ): Promise<void> {
    for (const soundFile of soundFiles) {
      await this.playSound(soundFile);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  
  /**
   * Play background ambient sound (looping)
   */
  playBackgroundAmbient(soundFile: string): void {
    if (!this.enabled) return;
    
    if (!this.userInteracted) {
      console.log('Waiting for user interaction before playing background audio');
      return;
    }
    
    // Stop existing background
    this.stopBackgroundAmbient();
    
    try {
      this.backgroundAudio = new Audio(soundFile);
      this.backgroundAudio.volume = this.volume * 0.5; // Quieter for background
      this.backgroundAudio.loop = true;
      this.backgroundAudio.play()
        .then(() => console.log('Playing background ambient:', soundFile))
        .catch((error) => {
          // Silently fail if autoplay is still blocked
          if (error.name !== 'NotAllowedError') {
            console.warn('Failed to play background ambient:', soundFile, error);
          }
        });
    } catch (error) {
      console.warn('Failed to play background ambient:', soundFile, error);
    }
  }
  
  /**
   * Stop background ambient sound
   */
  stopBackgroundAmbient(): void {
    if (this.backgroundAudio) {
      this.backgroundAudio.pause();
      this.backgroundAudio = null;
    }
  }
  
  /**
   * Cleanup all audio elements
   */
  cleanup(): void {
    this.stopAll();
    this.stopBackgroundAmbient();
    this.audioElements.clear();
  }
}

// Singleton instance
export const audioManager = new AudioManager();
