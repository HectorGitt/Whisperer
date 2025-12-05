/**
 * Narrator - Text-to-Speech system for spooky narration
 * Uses Web Speech API for voice synthesis
 */

export interface NarratorOptions {
  enabled: boolean;
  voice?: SpeechSynthesisVoice;
  rate?: number; // 0.1 to 10 (default 1)
  pitch?: number; // 0 to 2 (default 1)
  volume?: number; // 0 to 1 (default 1)
}

export class Narrator {
  private synth: SpeechSynthesis;
  private options: NarratorOptions;
  private voices: SpeechSynthesisVoice[] = [];
  
  constructor(options: Partial<NarratorOptions> = {}) {
    this.synth = window.speechSynthesis;
    this.options = {
      enabled: options.enabled ?? false,
      rate: options.rate ?? 0.8, // Slower for creepy effect
      pitch: options.pitch ?? 0.7, // Lower pitch for creepy effect
      volume: options.volume ?? 0.8,
    };
    
    // Load voices (only if speechSynthesis is available)
    if (this.synth) {
      this.loadVoices();
      
      // Voices might load asynchronously
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }
  
  private loadVoices(): void {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    
    console.log('Narrator: Loaded voices:', this.voices.length);
    
    // Try to find a good creepy voice
    if (!this.options.voice && this.voices.length > 0) {
      // Prefer male voices or voices with "dark" characteristics
      const preferredVoice = this.voices.find(
        (voice) =>
          voice.name.toLowerCase().includes('male') ||
          voice.name.toLowerCase().includes('daniel') ||
          voice.name.toLowerCase().includes('alex')
      );
      
      this.options.voice = preferredVoice || this.voices[0];
      console.log('Narrator: Selected voice:', this.options.voice?.name);
    }
  }
  
  /**
   * Speak text with narrator voice
   */
  speak(text: string): void {
    if (!this.options.enabled || !text || !this.synth) {
      console.log('Narrator: Cannot speak', { enabled: this.options.enabled, hasText: !!text, hasSynth: !!this.synth });
      return;
    }
    
    // Cancel any ongoing speech
    this.stop();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (this.options.voice) {
      utterance.voice = this.options.voice;
    }
    
    utterance.rate = this.options.rate ?? 0.8;
    utterance.pitch = this.options.pitch ?? 0.7;
    utterance.volume = this.options.volume ?? 0.8;
    
    console.log('Narrator: Speaking:', text.substring(0, 50) + '...');
    this.synth.speak(utterance);
  }
  
  /**
   * Stop current narration
   */
  stop(): void {
    if (!this.synth) return;
    if (this.synth.speaking) {
      this.synth.cancel();
    }
  }
  
  /**
   * Pause current narration
   */
  pause(): void {
    if (!this.synth) return;
    if (this.synth.speaking) {
      this.synth.pause();
      console.log('Narrator: Paused');
    }
  }
  
  /**
   * Resume paused narration
   */
  resume(): void {
    if (!this.synth) return;
    if (this.synth.paused) {
      this.synth.resume();
      console.log('Narrator: Resumed');
    }
  }
  
  /**
   * Enable or disable narrator
   */
  setEnabled(enabled: boolean): void {
    this.options.enabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }
  
  /**
   * Set narrator voice
   */
  setVoice(voice: SpeechSynthesisVoice): void {
    this.options.voice = voice;
  }
  
  /**
   * Get available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }
  
  /**
   * Set speech rate
   */
  setRate(rate: number): void {
    this.options.rate = Math.max(0.1, Math.min(10, rate));
  }
  
  /**
   * Set speech pitch
   */
  setPitch(pitch: number): void {
    this.options.pitch = Math.max(0, Math.min(2, pitch));
  }
  
  /**
   * Set volume
   */
  setVolume(volume: number): void {
    this.options.volume = Math.max(0, Math.min(1, volume));
  }
  
  /**
   * Get random spooky phrase
   */
  getRandomSpookyPhrase(): string {
    const phrases = [
      "Welcome... to the darkness...",
      "Are you afraid of what lurks in the shadows?",
      "The void is watching...",
      "Something wicked this way comes...",
      "Do you hear that? Listen closely...",
      "The darkness calls to you...",
      "There's no escape from the horror...",
      "Your fears are about to become real...",
      "The nightmare has only just begun...",
      "Can you feel it? The presence...",
      "They're coming for you...",
      "The dead don't rest here...",
      "Welcome to your doom...",
      "The terror never ends...",
      "Beware what you read...",
    ];
    
    return phrases[Math.floor(Math.random() * phrases.length)];
  }
  
  /**
   * Narrate article title with creepy intro
   */
  narrateArticleTitle(title: string): void {
    if (!this.options.enabled) return;
    
    const intros = [
      "Now reading...",
      "Behold...",
      "Witness...",
      "Prepare yourself for...",
      "Enter the world of...",
      "Dare to read...",
    ];
    
    const intro = intros[Math.floor(Math.random() * intros.length)];
    this.speak(`${intro} ${title}`);
  }
  
  /**
   * Check if speech synthesis is supported
   */
  static isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
}

// Singleton instance
export const narrator = new Narrator({ enabled: false });
