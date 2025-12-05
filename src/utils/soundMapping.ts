/**
 * Sound Keyword Mapping System
 * Maps keywords in article text to appropriate sound effects
 */

export interface SoundMapping {
  keywords: string[];
  soundFile: string;
  category: 'ambient' | 'creature' | 'supernatural' | 'nature';
}

export const SOUND_MAPPINGS: SoundMapping[] = [
  // Ambient/Environment
  {
    keywords: ['dark', 'darkness', 'shadow', 'night', 'midnight', 'void', 'abyss'],
    soundFile: '/media/sounds/Abyss.mp3',
    category: 'ambient',
  },
  {
    keywords: ['wind', 'breeze', 'storm', 'howling', 'cold'],
    soundFile: '/media/sounds/Scary Ambient Wind.mp3',
    category: 'nature',
  },
  {
    keywords: ['creep', 'creepy', 'eerie', 'unsettling', 'disturbing'],
    soundFile: '/media/sounds/CrEEP.mp3',
    category: 'ambient',
  },
  {
    keywords: ['room', 'house', 'building', 'corridor', 'hallway'],
    soundFile: '/media/sounds/Dark Rooms and Scary Things - isaiah658.mp3',
    category: 'ambient',
  },
  
  // Creatures & Monsters
  {
    keywords: ['monster', 'beast', 'creature', 'demon', 'horror'],
    soundFile: '/media/sounds/Scary-Monster.flac',
    category: 'creature',
  },
  {
    keywords: ['troll', 'ogre', 'giant', 'brute'],
    soundFile: '/media/sounds/troll-roars.ogg',
    category: 'creature',
  },
  {
    keywords: ['growl', 'snarl', 'roar'],
    soundFile: '/media/sounds/troll-idle-noises.ogg',
    category: 'creature',
  },
  
  // Supernatural & Ghosts
  {
    keywords: ['ghost', 'spirit', 'phantom', 'apparition', 'haunted', 'spectral'],
    soundFile: '/media/sounds/ghost_1.flac',
    category: 'supernatural',
  },
  {
    keywords: ['whisper', 'voice', 'echo', 'ethereal'],
    soundFile: '/media/sounds/ghost_2.flac',
    category: 'supernatural',
  },
  {
    keywords: ['scream', 'shriek', 'wail', 'cry', 'terror'],
    soundFile: '/media/sounds/scaryhighpitchedghost.ogg',
    category: 'supernatural',
  },
  
  // Atmospheric
  {
    keywords: ['void', 'estate', 'mansion', 'castle', 'abandoned'],
    soundFile: '/media/sounds/Void Estate.ogg',
    category: 'ambient',
  },
  {
    keywords: ['arcade', 'game', 'retro', 'glitch'],
    soundFile: '/media/sounds/Void Estate [Haunted Arcade].ogg',
    category: 'ambient',
  },
  {
    keywords: ['silence', 'quiet', 'still', 'empty'],
    soundFile: '/media/sounds/silence_01.ogg',
    category: 'ambient',
  },
  {
    keywords: ['surreal', 'strange', 'bizarre', 'weird', 'uncanny'],
    soundFile: '/media/sounds/surrealization.mp3',
    category: 'ambient',
  },
  
  // Additional atmospheric sounds
  {
    keywords: ['action', 'fight', 'battle', 'attack'],
    soundFile: '/media/sounds/action_01.ogg',
    category: 'ambient',
  },
  {
    keywords: ['ambient', 'atmosphere', 'background'],
    soundFile: '/media/sounds/amb_01.ogg',
    category: 'ambient',
  },
  {
    keywords: ['scary', 'frightening', 'terrifying', 'horrifying'],
    soundFile: '/media/sounds/scary.mp3',
    category: 'ambient',
  },
  {
    keywords: ['trap', 'caught', 'captured'],
    soundFile: '/media/sounds/trappist.wav',
    category: 'ambient',
  },
  {
    keywords: ['business', 'work', 'serious'],
    soundFile: '/media/sounds/down to business.wav',
    category: 'ambient',
  },
  {
    keywords: ['home', 'house', 'dwelling', 'residence'],
    soundFile: '/media/sounds/Is Anybody Home_.wav',
    category: 'ambient',
  },
  {
    keywords: ['ahead', 'forward', 'coming', 'approaching'],
    soundFile: '/media/sounds/scary_things_ahead.mp3',
    category: 'ambient',
  },
  {
    keywords: ['cave', 'cavern', 'underground', 'tunnel', 'crawl'],
    soundFile: '/media/sounds/Fangrcrawlecave1.mid',
    category: 'ambient',
  },
  {
    keywords: ['scrapped', 'discarded', 'abandoned', 'forgotten'],
    soundFile: '/media/sounds/scrapped-troll-sounds.ogg',
    category: 'creature',
  },
  // Additional ambient variations
  {
    keywords: ['atmosphere', 'mood', 'feeling'],
    soundFile: '/media/sounds/amb_02.ogg',
    category: 'ambient',
  },
  {
    keywords: ['environment', 'surroundings', 'setting'],
    soundFile: '/media/sounds/amb_03.ogg',
    category: 'ambient',
  },
  {
    keywords: ['combat', 'conflict', 'struggle'],
    soundFile: '/media/sounds/action_02.ogg',
    category: 'ambient',
  },
  {
    keywords: ['peace', 'calm', 'tranquil'],
    soundFile: '/media/sounds/silence_02.ogg',
    category: 'ambient',
  },
  {
    keywords: ['nothing', 'void', 'emptiness'],
    soundFile: '/media/sounds/silence_03.ogg',
    category: 'ambient',
  },
  {
    keywords: ['estate', 'property', 'grounds'],
    soundFile: '/media/sounds/void_estate.ogg',
    category: 'ambient',
  },
];

/**
 * Analyzes text and returns relevant sound files based on keyword matches
 */
export function getSoundsForText(text: string): string[] {
  const lowerText = text.toLowerCase();
  const matchedSounds = new Set<string>();
  
  for (const mapping of SOUND_MAPPINGS) {
    for (const keyword of mapping.keywords) {
      // Use word boundaries to avoid partial matches
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(lowerText)) {
        matchedSounds.add(mapping.soundFile);
        break; // Only add once per mapping
      }
    }
  }
  
  return Array.from(matchedSounds);
}

/**
 * Gets a random sound from a specific category
 */
export function getRandomSoundByCategory(
  category: SoundMapping['category']
): string | null {
  const categorySounds = SOUND_MAPPINGS.filter((m) => m.category === category);
  if (categorySounds.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * categorySounds.length);
  return categorySounds[randomIndex].soundFile;
}

// Longer audio files for background music (>2MB, longer duration)
const AMBIENT_BACKGROUND_SOUNDS = [
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

// Shorter audio files for jump scares (<500KB, quick impact)
export const JUMP_SCARE_SOUNDS = [
  '/media/sounds/scaryhighpitchedghost.ogg',  // 446KB - high pitched scream
  '/media/sounds/ghost_1.flac',               // 207KB - ghost sound
  '/media/sounds/ghost_2.flac',               // 220KB - ghost sound
  '/media/sounds/troll-roars.ogg',            // 126KB - roar
  '/media/sounds/scrapped-troll-sounds.ogg',  // 117KB - troll sounds
  '/media/sounds/troll-idle-noises.ogg',      // 292KB - creature noises
];

/**
 * Gets ambient background sound for spooky articles (randomly selected)
 */
export function getAmbientSound(): string {
  return AMBIENT_BACKGROUND_SOUNDS[Math.floor(Math.random() * AMBIENT_BACKGROUND_SOUNDS.length)];
}

/**
 * Gets a random jump scare sound (short, impactful)
 */
export function getJumpScareSound(): string {
  return JUMP_SCARE_SOUNDS[Math.floor(Math.random() * JUMP_SCARE_SOUNDS.length)];
}
