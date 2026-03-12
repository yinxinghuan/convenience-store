import { useState, useEffect, useRef, useCallback } from 'react';
import { STORY, FIRST_BEAT, computeEnding } from '../data/story';
import type { StoryChoice } from '../types';
import { playPageSound, playChoiceSound, playChimeSound, resumeAudio } from '../utils/sounds';
import { getCharacterImageUrl } from '../utils/characterImages';

const CHAR_INTERVAL = 32; // ms per character

const SLOT1_POOL = ['cust_chen_bo', 'cust_xiao_li', 'cust_isaya'] as const;
const SLOT2_POOL = ['cust_drunk', 'cust_cry_guy', 'cust_isabel'] as const;
const SLOT3_POOL = ['cust_mei_popo', 'cust_robber'] as const;

function pickCustomers(): Set<string> {
  const flags = new Set<string>();
  const shuffle = <T,>(arr: T[]) => arr.sort(() => Math.random() - 0.5);
  // Slot 1 & 2: pick 2 from each pool (both appear this game)
  shuffle([...SLOT1_POOL]).slice(0, 2).forEach(f => flags.add(f));
  shuffle([...SLOT2_POOL]).slice(0, 2).forEach(f => flags.add(f));
  // Slot 3: always pick 1 (mei_popo = cozy; robber = dramatic)
  flags.add(SLOT3_POOL[Math.floor(Math.random() * SLOT3_POOL.length)]);
  return flags;
}

/** Navigate to a beat, automatically skipping any whose condition flag is not met. */
function resolveNext(targetId: string, flags: Set<string>): string {
  let id = targetId;
  for (let i = 0; i < 20; i++) {
    const beat = STORY[id];
    if (!beat) return id;
    if (beat.condition && !flags.has(beat.condition)) {
      if (beat.next) { id = beat.next; continue; }
      break;
    }
    return id;
  }
  return id;
}

export function useStoryEngine() {
  const [flags, setFlags] = useState<Set<string>>(() => pickCustomers());
  const [beatId, setBeatId] = useState(() => resolveNext(FIRST_BEAT, flags));
  const [pageIndex, setPageIndex] = useState(0);
  const [displayedChars, setDisplayedChars] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [choicesReady, setChoicesReady] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [currentScene, setCurrentScene] = useState<'store' | 'backroom' | 'dawn'>('store');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flagsRef = useRef(flags);
  flagsRef.current = flags;

  const beat = STORY[beatId];

  // Resolve current page text: pages[pageIndex] if available, else beat.textZh/En
  const allPages = beat?.pages ? [{ textZh: beat.textZh, textEn: beat.textEn }, ...beat.pages] : null;
  const currentPage = allPages ? allPages[pageIndex] : null;
  const fullTextZh = currentPage ? currentPage.textZh : (beat?.textZh ?? '');
  const fullTextEn = currentPage ? currentPage.textEn : (beat?.textEn ?? '');
  const isLastPage = !allPages || pageIndex >= allPages.length - 1;

  // Typewriter when beat or page changes
  useEffect(() => {
    setDisplayedChars(0);
    setIsTyping(true);
    if (timerRef.current) clearInterval(timerRef.current);
    let count = 0;
    timerRef.current = setInterval(() => {
      count += 1;
      setDisplayedChars(count);
      if (count >= fullTextZh.length) {
        clearInterval(timerRef.current!);
        setIsTyping(false);
      }
    }, CHAR_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [beatId, pageIndex, fullTextZh.length]);

  // Preload images for upcoming beats (look-ahead)
  useEffect(() => {
    const flags = flagsRef.current;
    const visited = new Set<string>();
    const urls: string[] = [];

    function walk(id: string, depth: number) {
      if (depth <= 0 || visited.has(id)) return;
      visited.add(id);
      const b = STORY[id];
      if (!b) return;
      if (b.character) {
        const url = getCharacterImageUrl(b.character, b.emotion ?? 'normal');
        if (url) urls.push(url);
      }
      if (b.next) walk(resolveNext(b.next, flags), depth - 1);
      b.choices?.forEach(c => walk(resolveNext(c.next, flags), depth - 1));
    }

    // Start from next possible beats (not the current one — it's already visible)
    const cur = STORY[beatId];
    if (cur?.next) walk(resolveNext(cur.next, flags), 4);
    cur?.choices?.forEach(c => walk(resolveNext(c.next, flags), 4));

    urls.forEach(url => { const img = new Image(); img.src = url; });
  }, [beatId]);

  // Apply beat's own flag, scene, and failure on arrival
  useEffect(() => {
    if (beat?.flag) {
      setFlags((prev) => new Set([...prev, beat.flag!]));
    }
    if (beat?.scene) {
      setCurrentScene(beat.scene);
    }
    if (beat?.failed) {
      setIsFailed(true);
    }
    setPageIndex(0);
    setChoicesReady(false);
  }, [beat]);

  const goTo = useCallback((nextId: string, currentFlags: Set<string>) => {
    const resolved = resolveNext(nextId, currentFlags);
    setBeatId(resolved);
  }, []);

  const skipOrAdvance = useCallback(() => {
    resumeAudio();
    // Skip typewriter on current page
    if (isTyping) {
      if (timerRef.current) clearInterval(timerRef.current);
      setDisplayedChars(fullTextZh.length);
      setIsTyping(false);
      return;
    }
    // Beat has choices: first click reveals them (after typing done)
    if (beat?.choices?.length) {
      if (!choicesReady) setChoicesReady(true);
      return;
    }

    // Advance to next page if there are more
    if (!isLastPage) {
      playPageSound();
      setPageIndex((p) => p + 1);
      return;
    }

    // Ending branch: compute dynamically
    if (beat?.endingBranch) {
      const endingId = computeEnding(flagsRef.current);
      playChimeSound();
      setBeatId(endingId);
      return;
    }

    if (beat?.next) {
      playPageSound();
      const chimeBeats = ['g_enter', 'c_intro', 'h_intro', 'gh_intro'];
      if (chimeBeats.includes(beat.next)) playChimeSound();
      goTo(beat.next, flagsRef.current);
    } else {
      setIsEnded(true);
    }
  }, [isTyping, fullTextZh.length, beat, isLastPage, choicesReady, goTo]);

  const choose = useCallback((choice: StoryChoice) => {
    resumeAudio();
    playChoiceSound();
    setFlags((prev) => {
      const next = choice.flag ? new Set([...prev, choice.flag]) : prev;
      const resolved = resolveNext(choice.next, next);
      setBeatId(resolved);
      return next;
    });
  }, []);

  const restart = useCallback(() => {
    const initialFlags = pickCustomers();
    setBeatId(resolveNext(FIRST_BEAT, initialFlags));
    setFlags(initialFlags);
    setIsEnded(false);
    setIsFailed(false);
    setDisplayedChars(0);
    setPageIndex(0);
    setCurrentScene('store');
  }, []);

  const warmthScore = [
    'g_shared', 'aichen_honest', 'g_warm',
    'c_connected', 'c_stayed', 'suli_forgave',
    'h_soft', 'h_daughter_known', 'fangming_explained',
    'ghost_seen', 'ghost_told',
    'letter_opened', 'suli_recorded', 'petition_signed',
    // customer warmth
    'helped_chen_bo', 'helped_xiao_li', 'bonded_with_isaya',
    'helped_drunk', 'helped_cry_guy', 'bonded_with_isabel',
    'helped_mei_popo',
  ].filter((f) => flags.has(f)).length;

  return {
    beat, pageIndex, isLastPage, fullTextZh, fullTextEn,
    flags, displayedChars, isTyping, choicesReady, isEnded, isFailed, warmthScore,
    currentScene, skipOrAdvance, choose, restart,
  };
}
