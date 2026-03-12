export type CharId = 'guitarist' | 'coder' | 'hacker' | 'ghost';
export type CustomerId = 'chen_bo' | 'xiao_li' | 'isaya' | 'drunk' | 'robber' | 'mei_popo' | 'cry_guy' | 'isabel';
export type AnyCharId = CharId | CustomerId;
export type Emotion = 'normal' | 'happy' | 'sad' | 'surprised' | 'shy' | 'curious';

export const MAIN_CHAR_IDS: readonly CharId[] = ['guitarist', 'coder', 'hacker', 'ghost'];
export function isMainChar(id: AnyCharId): id is CharId {
  return (MAIN_CHAR_IDS as readonly string[]).includes(id);
}
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
  character?: AnyCharId;
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
  /** If true, this is a game-over beat — triggers failure screen */
  failed?: true;
}
