/** localStorage helpers for UI prefs */

export function readPref(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) ?? fallback
  } catch {
    return fallback
  }
}

export function writePref(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* ignore */
  }
}

export const PREF_STREAM_TAB = 'sn-tab-stream-lyrics'
export const PREF_LIST_TAB = 'sn-tab-playlist-queue'
export const PREF_LYRICS_SYNCED = 'sn-lyrics-synced'
