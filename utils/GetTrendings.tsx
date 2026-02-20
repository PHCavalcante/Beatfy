import { usePlaySelectedTrackWithFeedback } from "@/hooks/usePlaySelectedTrackWithFeedback";
import { useCurrentTrack } from "@/store/playerSelectors";
import { Image, Text, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { useState, useEffect, useCallback } from "react";
import SkeletonLoader from "@/components/SkeletonLoader";
import { useToast } from "@/context/ToastContext";
import {
  fetchTrendingTracks,
  fetchTrendingPlaylists,
  fetchTrendingArtists,
  getErrorMessage,
} from "@/services/audiusApi";
import type { AudiusTrack, AudiusPlaylist, AudiusUser } from "@/types/audius";
import { borderRadius } from "@/theme";

type TrendingSongsProps = {
  type: "trending" | "monthly" | "yearly" | "allTime" | "playlists" | "artists";
  setMusicLoading: (musicIsLoading: boolean) => void;
  colors: {
    background: string;
    text: string;
    textSecondary: string;
  };
};

export default function GetTrendingSongs({ type, colors, setMusicLoading }: TrendingSongsProps) {
  const [requestedResource, setRequestedResource] = useState<
    (AudiusTrack | AudiusPlaylist | AudiusUser)[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const playSelectedTrack = usePlaySelectedTrackWithFeedback();
  const currentTrack = useCurrentTrack();
  const { showToast } = useToast();

  const handlePress = useCallback(
    (item: AudiusTrack | AudiusPlaylist | AudiusUser) => {
      if ("title" in item && "user" in item) {
        setMusicLoading(true);
        playSelectedTrack(
          item.id,
          item.title,
          item.user.name,
          item.artwork?.["480x480"] ?? item.artwork?.["150x150"] ?? ""
        );
      }
    },
    [playSelectedTrack, setMusicLoading]
  );

  useEffect(() => {
    if (currentTrack) {
      setMusicLoading(false);
    }
  }, [currentTrack, setMusicLoading]);

  useEffect(() => {
    async function fetchTrending() {
      setLoading(true);
      try {
        let data: (AudiusTrack | AudiusPlaylist | AudiusUser)[] = [];
        if (type === "playlists") {
          data = await fetchTrendingPlaylists();
        } else if (type === "artists") {
          data = await fetchTrendingArtists();
        } else {
          const time =
            type === "monthly"
              ? "month"
              : type === "yearly"
                ? "year"
                : type === "allTime"
                  ? "allTime"
                  : undefined;
          data = await fetchTrendingTracks(time);
        }
        setRequestedResource(data);
      } catch (error) {
        const message = getErrorMessage(error);
        showToast(message, "error");
        setRequestedResource([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTrending();
  }, [type, showToast]);

  if (loading) {
    return (
      <View style={{flexDirection: "row", padding: 0, alignItems: "center", justifyContent: "center"}}>
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
      </View>
    );
  }
  const getImageUri = (item: AudiusTrack | AudiusPlaylist | AudiusUser) => {
    if ("artwork" in item && item.artwork?.["150x150"]) return item.artwork["150x150"];
    if ("profile_picture" in item && item.profile_picture?.["480x480"])
      return item.profile_picture["480x480"];
    return undefined;
  };

  const getTitle = (item: AudiusTrack | AudiusPlaylist | AudiusUser) => {
    if ("playlist_name" in item) return item.playlist_name;
    if ("name" in item && !("user" in item)) return item.name;
    if ("title" in item) return item.title;
    return "";
  };

  const getSubtitle = (item: AudiusTrack | AudiusPlaylist | AudiusUser) => {
    if ("user" in item) return item.user.name;
    return "";
  };

  return (
    <FlatList
      style={[styles.container, { backgroundColor: colors.background }]}
      horizontal
      showsHorizontalScrollIndicator={false}
      data={requestedResource}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.item, { backgroundColor: colors.surface }]}
          onPress={() => handlePress(item)}
          activeOpacity={0.8}
        >
          <Image
            source={
              getImageUri(item)
                ? { uri: getImageUri(item) }
                : require("@/assets/icons/default-song.png")
            }
            style={styles.image}
          />
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {getTitle(item)}
          </Text>
          {getSubtitle(item) ? (
            <Text style={[styles.artist, { color: colors.textSecondary }]} numberOfLines={1}>
              {getSubtitle(item)}
            </Text>
          ) : null}
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignContent: "center",
    flexGrow: 0,
  },
  listContent: {
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    maxWidth: 120,
  },
  item: {
    padding: 12,
    maxWidth: 130,
    marginHorizontal: 6,
    borderRadius: borderRadius.md,
  },
  artist: {
    fontSize: 12,
    maxWidth: 120,
    marginTop: 2,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: borderRadius.md,
    marginBottom: 8,
  },
});
