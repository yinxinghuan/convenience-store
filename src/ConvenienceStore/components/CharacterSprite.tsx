import React from 'react';
import type { CharId, Emotion, Position } from '../types';

// normal fallbacks (original single images)
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

import './CharacterSprite.less';

const IMAGES: Record<CharId, Record<Emotion, string>> = {
  guitarist: { normal: guitaristNormal, happy: guitaristHappy, sad: guitaristSad, surprised: guitaristSurprised, shy: guitaristShy },
  coder:     { normal: coderNormal,     happy: coderHappy,     sad: coderSad,     surprised: coderSurprised,     shy: coderShy     },
  hacker:    { normal: hackerNormal,    happy: hackerHappy,    sad: hackerSad,    surprised: hackerSurprised,    shy: hackerShy    },
  ghost:     { normal: ghostNormal,     happy: ghostHappy,     sad: ghostSad,     surprised: ghostSurprised,     shy: ghostShy     },
};

interface Props {
  charId: CharId;
  position: Position;
  emotion: Emotion;
  visible: boolean;
}

const CharacterSprite = React.memo(function CharacterSprite({ charId, position, emotion, visible }: Props) {
  const src = IMAGES[charId][emotion];
  return (
    <div className={`cs-char cs-char--${position} cs-char--${emotion} ${visible ? 'cs-char--visible' : ''}`}>
      <img src={src} alt={charId} draggable={false} />
    </div>
  );
});

export default CharacterSprite;
