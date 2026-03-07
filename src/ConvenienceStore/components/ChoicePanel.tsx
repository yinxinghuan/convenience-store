import React from 'react';
import type { StoryChoice } from '../types';
import './ChoicePanel.less';

interface Props {
  choices: StoryChoice[];
  onChoose: (choice: StoryChoice) => void;
  getText: (zh: string, en: string) => string;
}

const ChoicePanel = React.memo(function ChoicePanel({ choices, onChoose, getText }: Props) {
  return (
    <div className="cs-choices">
      {choices.map((c, i) => (
        <button key={i} className="cs-choices__btn" onPointerDown={() => onChoose(c)}>
          <span className="cs-choices__marker">▶</span>
          {getText(c.labelZh, c.labelEn)}
        </button>
      ))}
    </div>
  );
});

export default ChoicePanel;
