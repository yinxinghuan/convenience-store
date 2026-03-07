import React from 'react';
import type { AnyCharId } from '../types';
import './DialogBox.less';

const SPEAKER_COLORS: Partial<Record<AnyCharId, string>> = {
  guitarist: '#f59e0b',
  coder: '#8b5cf6',
  hacker: '#06b6d4',
  ghost: '#a3e635',
};

interface Props {
  speaker: string | null | undefined;
  charId: AnyCharId | undefined;
  displayedText: string;
  isTyping: boolean;
  hasChoices: boolean;
  hintText: string;
  pageIndex: number;
  totalPages: number;
}

const DialogBox = React.memo(function DialogBox({ speaker, charId, displayedText, isTyping, hasChoices, hintText, pageIndex, totalPages }: Props) {
  const nameColor = (charId && SPEAKER_COLORS[charId]) ?? '#fff';

  return (
    <div className="cs-dialog">
      <div className="cs-dialog__header">
        {speaker && (
          <div className="cs-dialog__name" style={{ color: nameColor }}>
            {speaker}
          </div>
        )}
        {totalPages > 1 && (
          <div className="cs-dialog__pages">
            {Array.from({ length: totalPages }, (_, i) => (
              <span key={i} className={`cs-dialog__page-dot ${i === pageIndex ? 'cs-dialog__page-dot--active' : ''}`} />
            ))}
          </div>
        )}
      </div>
      <div className={`cs-dialog__text ${!speaker ? 'cs-dialog__text--narration' : ''}`}>
        {displayedText}
        {isTyping && <span className="cs-dialog__cursor" />}
      </div>
      {!hasChoices && !isTyping && (
        <div className="cs-dialog__hint">{hintText}</div>
      )}
    </div>
  );
});

export default DialogBox;
