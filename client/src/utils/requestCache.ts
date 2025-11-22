type CacheEntry<T> = {
  data: T
  timestamp: number
  expiresAt: number
}

const CACHE_DURATION = 5 * 60 * 1000
const DAILY_CACHE_DURATION = 24 * 60 * 60 * 1000
const cache = new Map<string, CacheEntry<unknown>>()

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry) return null

  if (Date.now() > entry.expiresAt) {
    cache.delete(key)
    return null
  }

  return entry.data as T
}

export function setCached<T>(key: string, data: T, duration: number = CACHE_DURATION): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    expiresAt: Date.now() + duration,
  })
}

export function setDailyCached<T>(key: string, data: T): void {
  const today = new Date().toISOString().split('T')[0]
  const dailyKey = `${key}_${today}`
  setCached(dailyKey, data, DAILY_CACHE_DURATION)
}

export function getDailyCached<T>(key: string): T | null {
  const today = new Date().toISOString().split('T')[0]
  const dailyKey = `${key}_${today}`
  return getCached<T>(dailyKey)
}

export function clearCache(): void {
  cache.clear()
}

export function invalidateCache(keyPattern?: string): void {
  if (!keyPattern) {
    cache.clear()
    return
  }

  for (const key of cache.keys()) {
    if (key.includes(keyPattern)) {
      cache.delete(key)
    }
  }
}

