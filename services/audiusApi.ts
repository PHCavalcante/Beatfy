import axios, { AxiosError } from "axios";
import { AUDIUS_ENDPOINTS } from "@/constants/api";
import type { AudiusTrack, AudiusPlaylist, AudiusUser } from "@/types/audius";

const REQUEST_TIMEOUT_MS = 15000;

const apiClient = axios.create({
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    Accept: "application/json",
  },
});

export class AudiusApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = "AudiusApiError";
  }
}

export async function fetchTrendingTracks(
  time?: "month" | "year" | "allTime"
): Promise<AudiusTrack[]> {
  const url =
    time === "month"
      ? AUDIUS_ENDPOINTS.TRACKS_TRENDING_MONTHLY
      : time === "year"
        ? AUDIUS_ENDPOINTS.TRACKS_TRENDING_YEARLY
        : time === "allTime"
          ? AUDIUS_ENDPOINTS.TRACKS_TRENDING_ALL_TIME
          : AUDIUS_ENDPOINTS.TRACKS_TRENDING;

  const response = await apiClient.get<{ data: AudiusTrack[] }>(url);
  return response.data?.data ?? [];
}

export async function fetchTrendingPlaylists(): Promise<AudiusPlaylist[]> {
  const response = await apiClient.get<{ data: AudiusPlaylist[] }>(
    AUDIUS_ENDPOINTS.PLAYLISTS_TRENDING
  );
  return response.data?.data ?? [];
}

export async function fetchTrendingArtists(): Promise<AudiusUser[]> {
  const response = await apiClient.get<{ data: AudiusUser[] }>(
    AUDIUS_ENDPOINTS.USERS_SEARCH
  );
  return response.data?.data ?? [];
}

export async function searchTracks(query: string): Promise<AudiusTrack[]> {
  if (!query.trim()) return [];

  const response = await apiClient.get<{ data: AudiusTrack[] }>(
    AUDIUS_ENDPOINTS.TRACKS_SEARCH(query)
  );
  return response.data?.data ?? [];
}

export async function getTrackStreamUrl(trackId: string): Promise<string> {
  const response = await apiClient.get(AUDIUS_ENDPOINTS.TRACK_STREAM(trackId), {
    maxRedirects: 0,
    validateStatus: (status) => status >= 200 && status < 400,
  });
  return response.request.responseURL ?? response.config.url ?? "";
}

export function isAudiusError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error);
}

export function getErrorMessage(error: unknown): string {
  if (isAudiusError(error)) {
    if (error.response?.status === 404) {
      return "Conteúdo não encontrado.";
    }
    if (error.response?.status === 429) {
      return "Muitas requisições. Tente novamente em alguns minutos.";
    }
    if (error.code === "ECONNABORTED") {
      return "Tempo esgotado. Verifique sua conexão.";
    }
    if (error.code === "ERR_NETWORK") {
      return "Sem conexão. Verifique sua internet.";
    }
  }
  return "Algo deu errado. Tente novamente.";
}
