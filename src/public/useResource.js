import { useCallback, useEffect, useState } from 'react';
import { request } from './api';

export function useResource(path, { pollWhile } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((value) => value + 1), []);
  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    setError(null);
    request(path, { signal: controller.signal }).then(setData).catch((failure) => {
      if (failure.name !== 'AbortError') setError(failure);
    });
    return () => controller.abort();
  }, [path, version]);
  useEffect(() => {
    if (!data || error || !pollWhile || !pollWhile(data)) return;
    const timer = setTimeout(refresh, 5000);
    return () => clearTimeout(timer);
  }, [data, error, pollWhile, refresh]);
  return { data, error, refresh };
}
