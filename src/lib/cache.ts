/**
 * Simple in-memory cache for Firestore data.
 * Prevents duplicate network requests when multiple components
 * call the same service function (e.g., Header, Footer, SEO, and page
 * all calling getProfile() on mount).
 *
 * Cache entries expire after TTL_MS so admin changes still reflect.
 */

const TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  promise?: Promise<T>;
}

const store = new Map<string, CacheEntry<any>>();

/**
 * Get or fetch data with deduplication.
 * If multiple callers request the same key simultaneously,
 * only one fetch executes — the rest await the same promise.
 */
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const existing = store.get(key);

  // Return cached data if still fresh
  if (existing && (now - existing.timestamp) < TTL_MS && existing.data !== undefined) {
    return existing.data;
  }

  // If a fetch is already in-flight for this key, await it
  if (existing?.promise) {
    return existing.promise;
  }

  // Start a new fetch and store the promise for deduplication
  const promise = fetcher().then((data) => {
    store.set(key, { data, timestamp: Date.now() });
    return data;
  }).catch((err) => {
    // On error, clear the in-flight promise so next call retries
    store.delete(key);
    throw err;
  });

  store.set(key, { ...(existing || { data: undefined, timestamp: 0 }), promise });
  return promise;
}

/**
 * Invalidate a specific cache key (call after admin saves).
 */
export function invalidateCache(key: string): void {
  store.delete(key);
}

/**
 * Invalidate all cache entries (call after admin saves).
 */
export function invalidateAllCache(): void {
  store.clear();
}
