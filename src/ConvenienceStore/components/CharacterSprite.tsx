import React from 'react';
import type { AnyCharId, Emotion, Position } from '../types';
import { getCharacterImageUrl } from '../utils/characterImages';
import './CharacterSprite.less';

interface Props {
  charId: AnyCharId;
  position: Position;
  emotion: Emotion;
  visible: boolean;
}

const CharacterSprite = React.memo(function CharacterSprite({ charId, position, emotion, visible }: Props) {
  const src = getCharacterImageUrl(charId, emotion);
  if (!src) return null;
  return (
    <div className={`cs-char cs-char--${position} cs-char--${emotion} ${visible ? 'cs-char--visible' : ''}`}>
      <img src={src} alt={charId} draggable={false} />
    </div>
  );
});

export default CharacterSprite;
