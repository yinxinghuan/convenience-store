export type CharId = 'guitarist' | 'coder' | 'hacker' | 'ghost';
export type Emotion = 'normal' | 'happy' | 'sad' | 'surprised' | 'shy';
export type Position = 'left' | 'center' | 'right';
export type GamePhase = 'splash' | 'playing' | 'ended';

export interface StoryChoice {
  labelZh: string;
  labelEn: string;
  next: string;
  flag?: string;
}

export interface StoryPage {
  textZh: string;
  textEn: string;
}

export interface StoryBeat {
  id: string;
  character?: CharId;
  position?: Position;
  emotion?: Emotion;
  /** null = narration (no nameplate) */
  speaker?: string | null;
  textZh: string;
  textEn: string;
  /** Extra pages — if present, clicking advances through these before going to next beat */
  pages?: StoryPage[];
  /** Auto-advance to this beat on click */
  next?: string;
  /** Show choice buttons */
  choices?: StoryChoice[];
  /** Flag set when this beat is reached */
  flag?: string;
  /** Skip this beat if the named flag is NOT in the flag set; go to next directly */
  condition?: string;
  /** Background scene identifier — omit to keep current scene */
  scene?: 'store' | 'backroom' | 'dawn';
  /** If true, engine computes ending dynamically from flags instead of using next */
  endingBranch?: true;
}
