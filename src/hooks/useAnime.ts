/**
 * Generic data-fetching hook.
 * Accepts a service function instead of an endpoint string.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseAnimeResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useAnime<T>(
    fetcher: (signal: AbortSignal) => Promise<T>,
    enabled: boolean = true,
    deps: any[] = [],
): UseAnimeResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const mountedRef = useRef(true);

    const fetchData = useCallback(() => {
        if (!enabled) {
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        setLoading(true);
        setError(null);

        fetcher(controller.signal)
            .then((result) => {
                if (mountedRef.current) {
                    setData(result);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (mountedRef.current && err.name !== 'AbortError') {
                    setError(err.message || 'Something went wrong');
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [enabled, ...deps]);

    useEffect(() => {
        mountedRef.current = true;
        const cleanup = fetchData();
        return () => {
            mountedRef.current = false;
            cleanup?.();
        };
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}
