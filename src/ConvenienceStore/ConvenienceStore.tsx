import React, { forwardRef, useState, useEffect } from 'react';
import { useGameScore, Leaderboard } from '@shared/leaderboard';
import { useGameSave } from '@shared/save';
import { useStoryEngine, type StorySnapshot } from './hooks/useStoryEngine';
import { useLocale } from './i18n';
import type { CharId } from './types';
import { isMainChar } from './types';

// Story character names = real usernames
const CHAR_NAMES: Record<CharId, [string, string]> = {
  guitarist: ['Algram',     'Algram'],
  coder:     ['Jenny',      'Jenny'],
  hacker:    ['JM·F',       'JM·F'],
  ghost:     ['ghostpixel', 'ghostpixel'],
};
import CharacterSprite from './components/CharacterSprite';
import DialogBox from './components/DialogBox';
import ChoicePanel from './components/ChoicePanel';
import SplashScreen from './components/SplashScreen';
import ResumePrompt from './components/ResumePrompt';
import bgImg from './img/bg.png';
import bgBackroomImg from './img/bg_backroom.png';
import bgDawnImg from './img/bg_dawn.png';
import aigramLogo from './img/aigram.svg';
import './ConvenienceStore.less';

const GAME_ID = 'convenience-store';

interface GameProps {
  initialSave: StorySnapshot | null;
  persist: (snapshot: StorySnapshot) => void;
  clear: () => void;
  isInAigram: boolean;
  submitScore: (score: number) => void;
  fetchLeaderboard: ReturnType<typeof useGameScore>['fetchLeaderboard'];
}

function ConvenienceStoreGame({
  initialSave, persist, clear, isInAigram, submitScore,
  fetchLeaderboard,
}: GameProps) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const { t, getText } = useLocale();

  const {
    beat, pageIndex, fullTextZh, fullTextEn,
    flags, displayedChars, isTyping, choicesReady, isEnded, isFailed, warmthScore,
    currentScene, skipOrAdvance, choose, restart,
  } = useStoryEngine(initialSave);

  // Persist on every meaningful navigation change (cloud write debounced inside the hook).
  useEffect(() => {
    if (isEnded || isFailed) return;
    persist({ flags: [...flags], beatId: beat.id, pageIndex, currentScene });
  }, [flags, beat.id, pageIndex, currentScene, isEnded, isFailed, persist]);

  // Wipe save on terminal states so the next open starts fresh.
  useEffect(() => {
    if (isEnded || isFailed) clear();
  }, [isEnded, isFailed, clear]);

  // 故事结束时提交暖心值分数
  useEffect(() => {
    if (isEnded && warmthScore > 0) submitScore(warmthScore * 100);
  }, [isEnded]);

  const BG_IMAGES = { store: bgImg, backroom: bgBackroomImg, dawn: bgDawnImg };
  const activeBg = BG_IMAGES[currentScene] ?? bgImg;

  const fullText = getText(fullTextZh, fullTextEn);
  const displayedText = fullText.slice(0, displayedChars);
  const hasChoices = !!beat.choices?.length && !isTyping && choicesReady;
  const totalPages = beat.pages ? beat.pages.length + 1 : 1;

  return (
    <>
      {showLeaderboard && (
        <Leaderboard
          gameName="Convenience Store"
          isInAigram={isInAigram}
          onClose={() => setShowLeaderboard(false)}
          fetch={fetchLeaderboard}
        />
      )}

      {/* Background */}
      <div className="cs__bg" style={{ backgroundImage: `url(${activeBg})` }} />
      <div className="cs__bg-overlay" />

      {/* Character sprite */}
      {beat.character && (
        <CharacterSprite
          charId={beat.character}
          position={beat.position ?? 'right'}
          emotion={beat.emotion ?? 'normal'}
          visible
        />
      )}

      {/* Watermark */}
      <img className="cs__watermark" src={aigramLogo} alt="Aigram" draggable={false} />

      {/* Game over — failure screen */}
      {isFailed && (
        <div className="cs__failure">
          <div className="cs__failure-card">
            <div className="cs__failure-icon">☁</div>
            <p className="cs__failure-title">
              {getText('夜班结束了', 'Shift Over')}
            </p>
            <p className="cs__failure-desc">
              {flags.has('stood_up_to_robber') || flags.has('ghost_seen')
                ? getText('你受伤了。这一夜，比你想的要短。', 'You got hurt. The night ended sooner than you expected.')
                : getText('有人认出了你。这一夜，比你想的要短。', 'Someone figured it out. The night ended sooner than you expected.')}
            </p>
            <button className="cs__failure-btn" onPointerDown={restart}>{t('replay')}</button>
            <button className="cs__lb-icon" onPointerDown={() => setShowLeaderboard(true)}>🏆</button>
          </div>
        </div>
      )}

      {/* Story ended */}
      {!isFailed && isEnded ? (
        <div className="cs__ending">
          <div className="cs__ending-card">
            <div className="cs__ending-score">
              {warmthScore >= 6 ? '✦ ✦ ✦' : warmthScore >= 3 ? '✦ ✦' : '✦'}
            </div>
            <p className="cs__ending-label">
              {warmthScore >= 6
                ? getText('这是一个温暖的夜班。', 'A warm night shift.')
                : warmthScore >= 3
                ? getText('夜班就这样过去了。', 'The night passed.')
                : getText('有些人只是路过。', 'Some people just pass through.')}
            </p>
            <button className="cs__ending-btn" onPointerDown={restart}>{t('replay')}</button>
            <button className="cs__lb-icon" onPointerDown={() => setShowLeaderboard(true)}>🏆</button>
          </div>
        </div>
      ) : !isFailed ? (
        /* Tap area + dialog */
        <div className="cs__scene" onPointerDown={!hasChoices ? skipOrAdvance : undefined}>
          {hasChoices ? (
            <ChoicePanel choices={beat.choices!} onChoose={choose} getText={getText} />
          ) : (
            <DialogBox
              speaker={beat.character
            ? (isMainChar(beat.character)
                ? getText(...CHAR_NAMES[beat.character])
                : (beat.speaker ?? beat.character))
            : (beat.speaker ?? null)}
              charId={beat.character}
              displayedText={displayedText}
              isTyping={isTyping}
              hasChoices={false}
              pageIndex={pageIndex}
              totalPages={totalPages}
              hintText={isTyping
                ? getText(displayedChars < fullText.length ? '点击跳过' : '', 'tap to skip')
                : getText('点击继续', 'tap to continue')}
            />
          )}
        </div>
      ) : null}
    </>
  );
}

const ConvenienceStore = React.memo(
  forwardRef<HTMLDivElement, Record<string, never>>(function ConvenienceStore(_props, ref) {
    const [showSplash, setShowSplash] = useState(true);
    const [decision, setDecision] = useState<'pending' | 'continue' | 'fresh'>('pending');
    const { getText } = useLocale();
    const score = useGameScore();
    const { savedData, loaded: saveLoaded, hasSave, persist, clear } = useGameSave<StorySnapshot>(GAME_ID);

    // Auto-decide "fresh" when there's nothing to resume.
    useEffect(() => {
      if (saveLoaded && !hasSave && decision === 'pending') setDecision('fresh');
    }, [saveLoaded, hasSave, decision]);

    const showResume = !showSplash && saveLoaded && hasSave && decision === 'pending';
    const showGame = !showSplash && decision !== 'pending';
    const initialSave = decision === 'continue' ? savedData ?? null : null;

    return (
      <div className="cs" ref={ref}>
        {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}

        {showResume && (
          <ResumePrompt
            getText={getText}
            onContinue={() => setDecision('continue')}
            onRestart={() => { clear(); setDecision('fresh'); }}
          />
        )}

        {showGame && (
          <ConvenienceStoreGame
            initialSave={initialSave}
            persist={persist}
            clear={clear}
            isInAigram={score.isInAigram}
            submitScore={score.submitScore}
            fetchLeaderboard={score.fetchLeaderboard}
          />
        )}
      </div>
    );
  })
);

ConvenienceStore.displayName = 'ConvenienceStore';
export default ConvenienceStore;
