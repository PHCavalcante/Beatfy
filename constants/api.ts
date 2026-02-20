export const AUDIUS_API = {
  BASE: "https://api.audius.co/v1",
  DISCOVERY: "https://discoveryprovider.audius.co/v1",
} as const;

export const AUDIUS_ENDPOINTS = {
  TRACK_STREAM: (trackId: string) => `${AUDIUS_API.BASE}/tracks/${trackId}/stream`,
  TRACKS_TRENDING: `${AUDIUS_API.DISCOVERY}/tracks/trending`,
  TRACKS_TRENDING_MONTHLY: `${AUDIUS_API.DISCOVERY}/tracks/trending?time=month`,
  TRACKS_TRENDING_YEARLY: `${AUDIUS_API.DISCOVERY}/tracks/trending?time=year`,
  TRACKS_TRENDING_ALL_TIME: `${AUDIUS_API.DISCOVERY}/tracks/trending?time=allTime`,
  PLAYLISTS_TRENDING: `${AUDIUS_API.DISCOVERY}/playlists/trending`,
  USERS_SEARCH: `${AUDIUS_API.DISCOVERY}/users/search?sort_method?popular`,
  TRACKS_SEARCH: (query: string) =>
    `${AUDIUS_API.DISCOVERY}/tracks/search?query=${encodeURIComponent(query)}`,
} as const;
