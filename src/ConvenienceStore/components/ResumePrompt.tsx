import './ResumePrompt.less';

interface Props {
  getText: (zh: string, en: string) => string;
  onContinue: () => void;
  onRestart: () => void;
}

export default function ResumePrompt({ getText, onContinue, onRestart }: Props) {
  return (
    <div className="cs-resume">
      <div className="cs-resume__card">
        <div className="cs-resume__icon">⏸</div>
        <p className="cs-resume__title">
          {getText('上次的夜班还没结束', 'Your shift was still in progress')}
        </p>
        <p className="cs-resume__desc">
          {getText(
            '继续上次保存的进度，或者重新开始一个新的夜班。',
            'Continue from where you left off, or start a new night.',
          )}
        </p>
        <button className="cs-resume__btn cs-resume__btn--primary" onPointerDown={onContinue}>
          {getText('继续夜班', 'Continue shift')}
        </button>
        <button className="cs-resume__btn cs-resume__btn--ghost" onPointerDown={onRestart}>
          {getText('重新开始', 'Start over')}
        </button>
      </div>
    </div>
  );
}
