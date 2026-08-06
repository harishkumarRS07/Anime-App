/**
 * src/services/api.ts
 * Jikan API client with caching and local backend proxy support.
 */

import axios, { AxiosError } from 'axios';
import { Platform } from 'react-native';

// ─── Backend Base URL ────────────────────────────────────────────────────────
const getBackendUrl = (): string => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001'; // Android emulator
  }
  return 'http://localhost:3001'; // iOS / web
};

const BACKEND_URL = getBackendUrl();
const JIKAN_BASE = 'https://api.jikan.moe/v4';

// ─── Axios Instances ─────────────────────────────────────────────────────────
const backendApi = axios.create({
  baseURL: BACKEND_URL,
  timeout: 15000,
});

const jikanApi = axios.create({
  baseURL: JIKAN_BASE,
  timeout: 15000,
});

// ─── Simple In-Memory Cache ──────────────────────────────────────────────────
const cache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() < entry.expiry) return entry.data as T;
  if (entry) cache.delete(key);
  return null;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, expiry: Date.now() + CACHE_TTL });
}

// ─── Jikan Endpoints ─────────────────────────────────────────────────────────
export const JikanEndpoints = {
  topAiring: () => '/top/anime?filter=airing&limit=15',
  topPopular: () => '/top/anime?filter=bypopularity&limit=15',
  topUpcoming: () => '/top/anime?filter=upcoming&limit=15',
  search: (q: string) => `/anime?q=${encodeURIComponent(q)}&limit=20&sfw=true`,
  animeDetail: (id: string | number) => `/anime/${id}/full`,
  animeEpisodes: (id: string | number) => `/anime/${id}/episodes`,
  homeFeed: () => '/home-feed', // backend-only
};

// ─── Fetch Helper ────────────────────────────────────────────────────────────
export async function fetchJikan<T>(
  endpoint: string,
  signal?: AbortSignal,
): Promise<T> {
  const cacheKey = endpoint;
  const cached = getCached<T>(cacheKey);
  if (cached) return cached;

  try {
    // Try local backend first (has server-side cache)
    if (endpoint === JikanEndpoints.homeFeed()) {
      const res = await backendApi.get(endpoint, { signal });
      setCache(cacheKey, res.data);
      return res.data as T;
    }

    // Try backend proxy
    const res = await backendApi.get(`/proxy${endpoint}`, { signal });
    const data = res.data?.data ?? res.data;
    setCache(cacheKey, data);
    return data as T;
  } catch {
    // Fallback to direct Jikan
    try {
      const res = await jikanApi.get(endpoint, { signal });
      const data = res.data?.data ?? res.data;
      setCache(cacheKey, data);
      return data as T;
    } catch (err) {
      const axiosErr = err as AxiosError;
      throw new Error(
        axiosErr?.response?.status === 429
          ? 'Rate limited — please wait a moment.'
          : axiosErr?.message || 'Network error',
      );
    }
  }
}
