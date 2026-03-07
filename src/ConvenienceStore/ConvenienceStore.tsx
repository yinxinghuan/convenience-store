import React, { forwardRef, useState } from 'react';
import { useStoryEngine } from './hooks/useStoryEngine';
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
import bgImg from './img/bg.png';
import bgBackroomImg from './img/bg_backroom.png';
import bgDawnImg from './img/bg_dawn.png';
import aigramLogo from './img/aigram.svg';
import './ConvenienceStore.less';

const ConvenienceStore = React.memo(
  forwardRef<HTMLDivElement, Record<string, never>>(function ConvenienceStore(_props, ref) {
    const [showSplash, setShowSplash] = useState(true);
    const { t, getText } = useLocale();
    const {
      beat, pageIndex, fullTextZh, fullTextEn,
      displayedChars, isTyping, choicesReady, isEnded, warmthScore,
      currentScene, skipOrAdvance, choose, restart,
    } = useStoryEngine();

    const BG_IMAGES = { store: bgImg, backroom: bgBackroomImg, dawn: bgDawnImg };
    const activeBg = BG_IMAGES[currentScene] ?? bgImg;

    const fullText = getText(fullTextZh, fullTextEn);
    const displayedText = fullText.slice(0, displayedChars);
    const hasChoices = !!beat.choices?.length && !isTyping && choicesReady;
    const totalPages = beat.pages ? beat.pages.length + 1 : 1;

    return (
      <div className="cs" ref={ref}>
        {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}

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

        {/* Story ended */}
        {isEnded ? (
          <div className="cs__ending" onPointerDown={restart}>
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
              <button className="cs__ending-btn">{t('replay')}</button>
            </div>
          </div>
        ) : (
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
        )}
      </div>
    );
  })
);

ConvenienceStore.displayName = 'ConvenienceStore';
export default ConvenienceStore;
