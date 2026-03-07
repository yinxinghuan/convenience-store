type Locale = 'zh' | 'en';

const MESSAGES: Record<Locale, Record<string, string>> = {
  zh: {
    tapToContinue: '点击继续',
    tapToSkip: '点击跳过',
    replay: '再读一遍',
    title: '深夜便利店',
  },
  en: {
    tapToContinue: 'Tap to continue',
    tapToSkip: 'Tap to skip',
    replay: 'Read Again',
    title: 'Late Night Store',
  },
};

function detectLocale(): Locale {
  const override = localStorage.getItem('cs_locale');
  if (override === 'en' || override === 'zh') return override;
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

import { useState, useCallback } from 'react';

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);
  const setLocale = useCallback((l: Locale) => {
    localStorage.setItem('cs_locale', l);
    setLocaleState(l);
  }, []);
  const t = useCallback(
    (key: string) => MESSAGES[locale][key] ?? MESSAGES['en'][key] ?? key,
    [locale]
  );
  const getText = useCallback(
    (zh: string, en: string) => (locale === 'zh' ? zh : en),
    [locale]
  );
  return { t, getText, locale, setLocale };
}
