import React, { forwardRef, useEffect, useState } from 'react';
import posterImg from '../img/poster.png';
import bgImg from '../img/bg.png';
import bgBackroomImg from '../img/bg_backroom.png';
import bgDawnImg from '../img/bg_dawn.png';
import guitaristNormal from '../img/guitarist_normal.png';
import coderNormal from '../img/coder_normal.png';
import hackerNormal from '../img/hacker_normal.png';
import ghostNormal from '../img/ghost_normal.png';
import './SplashScreen.less';

// Critical assets to preload before entering the game
const PRELOAD = [bgImg, bgBackroomImg, bgDawnImg, guitaristNormal, coderNormal, hackerNormal, ghostNormal];
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

    // Preload critical assets, track progress
    useEffect(() => {
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
    }, []);

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
