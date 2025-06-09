import { create } from "zustand";
import { Audio } from "expo-av";
import type { Sound } from "expo-av/build/Audio";
import { useDatabase } from "@/database/useDatabase";
import axios from "axios";

export type Track = {
  id: string;
  uri: string;
  name?: string | undefined;
  artist?: string;
  image?: string;
};

type PlayerState = {
  currentTrack: Track | null;
  isPlaying: boolean;
  playlist: Track[];
  currentIndex: number;
  duration: number;
  position: number;
  playTrack: (track: Track, playlist?: Track[]) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  togglePreviousSong: () => Promise<void>;
  toggleNextSong: () => Promise<void>;
  seekTo: (milliseconds: number) => Promise<void>;
  setVolume: (value: number) => Promise<void>;
  playSelectedTrack: (trackId: string, trackName: string, artist: string, trackImage: string) => Promise<void>;
  isShuffleEnabled: boolean;
  repeatMode: "off" | "one" | "all";
  toggleShuffle: () => void;
  setRepeatMode: (mode: "off" | "one" | "all") => void;
};

let soundRef: Sound | null = null;

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  playlist: [],
  currentIndex: -1,
  duration: 0,
  position: 0,
  isShuffleEnabled: false,
  repeatMode: "off",

  playTrack: async (track, newPlaylist) => {
    const db = await useDatabase();

    if (soundRef) {
      await soundRef.unloadAsync();
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: track.uri },
      { shouldPlay: true }
    );

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        set({
          duration: status.durationMillis || 0,
          position: status.positionMillis || 0,
        });
        if (status.didJustFinish) {
      const { repeatMode, currentTrack, playlist, playTrack, toggleNextSong } = get();

      if (repeatMode === "one") {
        playTrack(currentTrack!, playlist);
      } else {
        toggleNextSong();
        }
      }
    }
   });

    soundRef = sound;
    set({ currentTrack: track, isPlaying: true, playlist: newPlaylist });

    if (track.id) {
      const exists = await db.existsDataOnRecentPlays(track.id);
      if (exists) {
        await db.incrementQuantityPlays(track.id);
      } else {
        await db.insertInRecentPlaysTable(track.id);
      }
    }

    if (newPlaylist) {
      const index = newPlaylist.findIndex((t) => t.uri === track.uri);
      if (index !== -1) {
        set({ playlist: newPlaylist, currentIndex: index });
      }
    }
  },

  togglePlayPause: async () => {
    if (!soundRef) return;
    const status = await soundRef.getStatusAsync();
    if (status.isLoaded && status.isPlaying) {
      await soundRef.pauseAsync();
      set({ isPlaying: false });
    } else {
      await soundRef.playAsync();
      set({ isPlaying: true });
    }
  },

  togglePreviousSong: async () => {
    const { playlist, currentIndex, playTrack } = get();
    if (playlist.length === 0 || currentIndex <= 0) return;
    await playTrack(playlist[currentIndex - 1], playlist);
  },

  toggleNextSong: async () => {
    const { playlist, currentIndex, playTrack, isShuffleEnabled, repeatMode } =
      get();

    if (playlist.length === 0) return;

    let nextIndex = currentIndex + 1;

    if (isShuffleEnabled) {
      const remaining = playlist.filter((_, i) => i !== currentIndex);
      const random = remaining[Math.floor(Math.random() * remaining.length)];
      return await playTrack(random, playlist);
    }

    if (nextIndex >= playlist.length) {
      if (repeatMode === "all") {
        nextIndex = 0;
      } else {
        return;
      }
    }

    await playTrack(playlist[nextIndex], playlist);
  },

  seekTo: async (milliseconds) => {
    if (soundRef) {
      await soundRef.setPositionAsync(milliseconds);
    }
  },

  setVolume: async (value) => {
    if (soundRef) {
      try {
        await soundRef.setVolumeAsync(value);
      } catch (error) {
        console.error("Erro ao ajustar volume:", error);
      }
    }
  },

  playSelectedTrack: async (
    trackId: string,
    trackName: string,
    artist: string,
    trackImage: string
  ) => {
    const { playTrack } = get();
    try {
      const response = await axios.get(
        `https://api.audius.co/v1/tracks/${trackId}/stream`,
        {
          maxRedirects: 0,
          validateStatus: (status) => status >= 200 && status < 400,
        }
      );
      const streamUrl = response.request.responseURL;
      if (streamUrl){
        const track: Track = {
          id: trackId,
          uri: streamUrl,
          name: trackName,
          artist,
          image: trackImage,
        };
        await playTrack(track);
      }
    } catch (error: any) {
      if (error.response?.status === 302) {
        await playTrack(error.response.headers.location);
        return;
      }
      console.log("Error fetching track stream:", error);
    }
  },

  toggleShuffle: () => {
    set((state) => ({ isShuffleEnabled: !state.isShuffleEnabled }));
  },

  setRepeatMode: (mode) => {
    set({ repeatMode: mode });
  },
}));
