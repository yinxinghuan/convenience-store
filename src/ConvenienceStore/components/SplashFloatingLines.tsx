import { useEffect, useMemo, useState } from 'react';
import { useLocale } from '../i18n';
import './SplashFloatingLines.less';

const DIALOG_ZH = [
  '叮——',
  '凌晨一点',
  '买包烟',
  '你能看见我吗？',
  '请问关东煮还有吗',
  '我能在这儿坐一会儿吗',
  '雨停了。天色泛白。',
  '你今年多大？',
  '你也是本地人？',
  '里间的灯亮了',
  '只要还有一个人坐在窗边',
  '便利店的灯比天还亮',
  '天，快亮了',
  '一个人。',
  '今晚有点冷',
  '不害怕吗',
  '我能记住你',
  '有些人只是路过',
  '有些人会回来',
  '听见了吗',
  '不知道为什么我说了这些',
  '你不像本地人',
  '只是路过',
  '37 号便利店',
  '——明天见',
];

const DIALOG_EN = [
  'Ding —',
  '1:00 AM',
  'a pack of smokes',
  'can you see me?',
  'any oden left?',
  'mind if i sit a bit',
  'the rain stopped',
  'how old are you?',
  'are you local too?',
  'the back-room light came on',
  'as long as someone is by the window',
  'the store light is brighter than the sky',
  'morning soon',
  'just one person.',
  'cold tonight',
  'not afraid?',
  'i\'ll remember you',
  'some people just pass through',
  'some come back',
  'did you hear that',
  'not sure why i told you',
  'you don\'t look local',
  'just passing',
  'store no. 37',
  '— see you tomorrow',
];

interface Slot { id: number; xPct: number; yPct: number; delay: number; duration: number }

const SLOTS: Slot[] = [
  { id: 0, xPct: 12, yPct: 18, delay: 0.0, duration: 7.5 },
  { id: 1, xPct: 62, yPct: 14, delay: 1.4, duration: 8.5 },
  { id: 2, xPct: 22, yPct: 32, delay: 2.6, duration: 7.0 },
  { id: 3, xPct: 70, yPct: 36, delay: 3.8, duration: 8.2 },
  { id: 4, xPct: 16, yPct: 50, delay: 5.0, duration: 7.8 },
  { id: 5, xPct: 60, yPct: 56, delay: 0.6, duration: 8.0 },
  { id: 6, xPct: 30, yPct: 70, delay: 4.2, duration: 7.4 },
  { id: 7, xPct: 56, yPct: 78, delay: 2.0, duration: 8.6 },
];

function rng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function SplashFloatingLines() {
  const { locale } = useLocale();
  const pool = locale === 'zh' ? DIALOG_ZH : DIALOG_EN;

  // Assign each slot a current line; cycle to a new one when its duration elapses.
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1500);
    return () => clearInterval(id);
  }, []);

  const lines = useMemo(() => {
    const r = rng(tick * 7919 + 17);
    return SLOTS.map(() => pool[Math.floor(r() * pool.length)]);
  }, [tick, pool]);

  return (
    <div className="cs-splash-lines" aria-hidden>
      {SLOTS.map((slot, i) => (
        <div
          key={slot.id}
          className="cs-splash-lines__line"
          style={{
            left: `${slot.xPct}%`,
            top: `${slot.yPct}%`,
            animationDelay: `${slot.delay}s`,
            animationDuration: `${slot.duration}s`,
          }}
        >
          {lines[i]}
        </div>
      ))}
    </div>
  );
}
