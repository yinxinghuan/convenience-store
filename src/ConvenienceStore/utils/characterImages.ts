import type { AnyCharId } from '../types';
import { isMainChar } from '../types';

// Main character sprites
import guitaristNormal from '../img/guitarist_normal.png';
import guitaristHappy from '../img/guitarist_happy.png';
import guitaristSad from '../img/guitarist_sad.png';
import guitaristSurprised from '../img/guitarist_surprised.png';
import guitaristShy from '../img/guitarist_shy.png';

import coderNormal from '../img/coder_normal.png';
import coderHappy from '../img/coder_happy.png';
import coderSad from '../img/coder_sad.png';
import coderSurprised from '../img/coder_surprised.png';
import coderShy from '../img/coder_shy.png';

import hackerNormal from '../img/hacker_normal.png';
import hackerHappy from '../img/hacker_happy.png';
import hackerSad from '../img/hacker_sad.png';
import hackerSurprised from '../img/hacker_surprised.png';
import hackerShy from '../img/hacker_shy.png';

import ghostNormal from '../img/ghost_normal.png';
import ghostHappy from '../img/ghost_happy.png';
import ghostSad from '../img/ghost_sad.png';
import ghostSurprised from '../img/ghost_surprised.png';
import ghostShy from '../img/ghost_shy.png';

import type { CharId } from '../types';

const MAIN_IMAGES: Record<CharId, Record<string, string>> = {
  guitarist: { normal: guitaristNormal, happy: guitaristHappy, sad: guitaristSad, surprised: guitaristSurprised, shy: guitaristShy },
  coder:     { normal: coderNormal,     happy: coderHappy,     sad: coderSad,     surprised: coderSurprised,     shy: coderShy     },
  hacker:    { normal: hackerNormal,    happy: hackerHappy,    sad: hackerSad,    surprised: hackerSurprised,    shy: hackerShy    },
  ghost:     { normal: ghostNormal,     happy: ghostHappy,     sad: ghostSad,     surprised: ghostSurprised,     shy: ghostShy     },
};

const customerModules = import.meta.glob('../img/customers/*.png', { eager: true }) as Record<string, { default: string }>;

export function getCharacterImageUrl(charId: AnyCharId, emotion = 'normal'): string | undefined {
  if (isMainChar(charId)) {
    return MAIN_IMAGES[charId][emotion] ?? MAIN_IMAGES[charId]['normal'];
  }
  const key      = `../img/customers/${charId}_${emotion}.png`;
  const fallback = `../img/customers/${charId}_normal.png`;
  return customerModules[key]?.default ?? customerModules[fallback]?.default;
}
