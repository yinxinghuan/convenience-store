import React, { forwardRef } from 'react';
import posterImg from '../img/poster.png';
import './SplashScreen.less';

interface Props { onDone: () => void; }

const SplashScreen = React.memo(
  forwardRef<HTMLDivElement, Props>(function SplashScreen({ onDone }, ref) {
    return (
      <div className="cs-splash" ref={ref}>
        <img className="cs-splash__img" src={posterImg} alt="" draggable={false} onAnimationEnd={onDone} />
      </div>
    );
  })
);

SplashScreen.displayName = 'SplashScreen';
export default SplashScreen;
