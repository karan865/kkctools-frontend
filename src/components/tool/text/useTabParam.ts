'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Tab state synced with ?tab=. Reads the URL after mount, so the static HTML
 * always contains the default tab (useSearchParams would render only a fallback).
 */
export function useTabParam<T extends string>(ids: readonly T[], initial: T): [T, (tab: T) => void] {
  const [tab, setTabState] = useState<T>(initial);

  useEffect(() => {
    const timer = setTimeout(() => {
      const param = new URLSearchParams(window.location.search).get('tab');
      const found = ids.find((id) => id === param);
      if (found) setTabState(found);
    }, 0);
    return () => clearTimeout(timer);
    // The list of tab ids is fixed for the life of the component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTab = useCallback((next: T) => {
    setTabState(next);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', next);
    window.history.replaceState({}, '', url.toString());
  }, []);

  return [tab, setTab];
}
