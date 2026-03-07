import { useState, useEffect, useRef, useCallback } from 'react';
import { STORY, FIRST_BEAT, computeEnding } from '../data/story';
import type { StoryChoice } from '../types';
import { playPageSound, playChoiceSound, playChimeSound, resumeAudio } from '../utils/sounds';

const CHAR_INTERVAL = 32; // ms per character

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
  const [beatId, setBeatId] = useState(() => resolveNext(FIRST_BEAT, new Set()));
  const [pageIndex, setPageIndex] = useState(0);
  const [flags, setFlags] = useState<Set<string>>(new Set());
  const [displayedChars, setDisplayedChars] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [choicesReady, setChoicesReady] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
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

  // Apply beat's own flag and scene on arrival (only on first page)
  useEffect(() => {
    if (beat?.flag) {
      setFlags((prev) => new Set([...prev, beat.flag!]));
    }
    if (beat?.scene) {
      setCurrentScene(beat.scene);
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
    const empty = new Set<string>();
    setBeatId(resolveNext(FIRST_BEAT, empty));
    setFlags(empty);
    setIsEnded(false);
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
  ].filter((f) => flags.has(f)).length;

  return {
    beat, pageIndex, isLastPage, fullTextZh, fullTextEn,
    flags, displayedChars, isTyping, choicesReady, isEnded, warmthScore,
    currentScene, skipOrAdvance, choose, restart,
  };
}
