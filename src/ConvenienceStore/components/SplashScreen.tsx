import React, { forwardRef, useEffect, useState } from 'react';
import posterImg from '../img/poster.png';
import bgImg from '../img/bg.png';
import bgBackroomImg from '../img/bg_backroom.png';
import bgDawnImg from '../img/bg_dawn.png';
import guitaristNormal from '../img/guitarist_normal.png';
import guitaristHappy from '../img/guitarist_happy.png';
import guitaristSad from '../img/guitarist_sad.png';
import guitaristShy from '../img/guitarist_shy.png';
import guitaristSurprised from '../img/guitarist_surprised.png';
import coderNormal from '../img/coder_normal.png';
import coderHappy from '../img/coder_happy.png';
import coderSad from '../img/coder_sad.png';
import coderShy from '../img/coder_shy.png';
import coderSurprised from '../img/coder_surprised.png';
import hackerNormal from '../img/hacker_normal.png';
import hackerHappy from '../img/hacker_happy.png';
import hackerSad from '../img/hacker_sad.png';
import hackerShy from '../img/hacker_shy.png';
import hackerSurprised from '../img/hacker_surprised.png';
import ghostNormal from '../img/ghost_normal.png';
import ghostHappy from '../img/ghost_happy.png';
import ghostSad from '../img/ghost_sad.png';
import ghostShy from '../img/ghost_shy.png';
import ghostSurprised from '../img/ghost_surprised.png';
import './SplashScreen.less';

// Critical assets to preload before entering the game
const PRELOAD = [
  bgImg, bgBackroomImg, bgDawnImg,
  guitaristNormal, guitaristHappy, guitaristSad, guitaristShy, guitaristSurprised,
  coderNormal, coderHappy, coderSad, coderShy, coderSurprised,
  hackerNormal, hackerHappy, hackerSad, hackerShy, hackerSurprised,
  ghostNormal, ghostHappy, ghostSad, ghostShy, ghostSurprised,
];
const MIN_MS = 2500; // minimum splash display time
const MAX_ASSET_MS = 10000; // give up waiting for slow assets after 10s

interface Props { onDone: () => void; }

const SplashScreen = React.memo(
  forwardRef<HTMLDivElement, Props>(function SplashScreen({ onDone }, ref) {
    const [posterReady, setPosterReady] = useState(false);
    const [progress, setProgress] = useState(0);
    const [fading, setFading] = useState(false);
    const [minDone, setMinDone] = useState(false);
    const [assetsDone, setAssetsDone] = useState(false);

    // Minimum display timer
    useEffect(() => {
      const t = setTimeout(() => setMinDone(true), MIN_MS);
      return () => clearTimeout(t);
    }, []);

    // Preload critical assets, track progress (wait for poster to show first)
    useEffect(() => {
      if (!posterReady) return;

      let loaded = 0;
      const total = PRELOAD.length;

      const onOne = () => {
        loaded++;
        setProgress(loaded / total);
        if (loaded >= total) setAssetsDone(true);
      };

      PRELOAD.forEach(src => {
        const img = new Image();
        img.onload = img.onerror = onOne;
        img.src = src;
      });

      // Safety timeout — don't block forever on slow connections
      const maxT = setTimeout(() => setAssetsDone(true), MAX_ASSET_MS);
      return () => clearTimeout(maxT);
    }, [posterReady]);

    // Begin fade-out when all gates pass
    useEffect(() => {
      if (minDone && assetsDone) setFading(true);
    }, [minDone, assetsDone]);

    // Call onDone after CSS fade completes
    useEffect(() => {
      if (!fading) return;
      const t = setTimeout(onDone, 500);
      return () => clearTimeout(t);
    }, [fading, onDone]);

    return (
      <div className={`cs-splash ${fading ? 'cs-splash--fading' : ''}`} ref={ref}>
        <img
          className={`cs-splash__img ${posterReady ? 'cs-splash__img--visible' : ''}`}
          src={posterImg}
          alt=""
          draggable={false}
          onLoad={() => setPosterReady(true)}
        />
        <div className="cs-splash__bar-track">
          <div
            className="cs-splash__bar-fill"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>
    );
  })
);

SplashScreen.displayName = 'SplashScreen';
export default SplashScreen;
