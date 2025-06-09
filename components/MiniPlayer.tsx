import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Platform,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import {
  useCurrentTrack,
  useIsPlaying,
  useTogglePlayPause,
  useTogglePreviousSong,
  useToggleNextSong,
  usePosition,
  useDuration,
  useSeekTo,
  useSetVolume,
} from "@/store/playerSelectors";
import { usePlayerStore } from "@/store/playerStore";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useDatabase } from "@/database/useDatabase";

const formatMilliseconds = (milliseconds: number) => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

type CollapsedMiniPlayerProps = {
  currentTrack: {
    name: string;
    artist?: string;
    image?: string;
  };
  isPlaying: boolean;
  togglePlayPause: () => void;
  handleToggle: () => void;
  colors: {
    surface: string;
    text: string;
    textSecondary: string;
  };
};

const CollapsedMiniPlayer = React.memo(
  ({ currentTrack, isPlaying, togglePlayPause, handleToggle, colors }: CollapsedMiniPlayerProps) => {
    const imageSource = useMemo(
      () =>
        currentTrack.image
          ? { uri: currentTrack.image }
          : require("@/assets/icons/default-song.png"),
      [currentTrack.image]
    );

    return (
      <TouchableOpacity
        style={[styles.container, { backgroundColor: colors.surface }]}
        onPress={handleToggle}
      >
        <View style={styles.miniImageWrapper}>
          <Image source={imageSource} style={styles.miniImage} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={[styles.title, { color: colors.text }]}
            numberOfLines={1}
          >
            {currentTrack.name}
          </Text>
          <Text
            style={[styles.artist, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {currentTrack.artist ?? "Artista desconhecido"}
          </Text>
        </View>
        <TouchableOpacity onPress={togglePlayPause}>
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={30}
            color={colors.text}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
);

type ExpandedPlayerProps = {
  currentTrack: {
    name: string;
    artist?: string;
    image?: string;
    id?: string;
  };
  isPlaying: boolean;
  position: number;
  duration: number;
  volume: number;
  colors: {
    background: string;
    text: string;
    textSecondary: string;
    primary: string;
  };
  isFavorite: boolean;
  togglePlayPause: () => void;
  togglePreviousSong: () => void;
  toggleNextSong: () => void;
  handleSeek: (value: number) => void;
  handleVolumeChange: (value: number) => void;
  toggleFavorite: () => void;
  toggleShuffle: () => void;
  isShuffleEnabled: boolean;
  repeatMode: "off" | "one" | "all";
  nextRepeatMode: () => void;
  router: ReturnType<typeof useRouter>;
  handleToggle: () => void;
};

const ExpandedPlayer = React.memo(
  ({
    currentTrack,
    isPlaying,
    position,
    duration,
    volume,
    colors,
    isFavorite,
    togglePlayPause,
    togglePreviousSong,
    toggleNextSong,
    handleSeek,
    handleVolumeChange,
    toggleFavorite,
    toggleShuffle,
    isShuffleEnabled,
    repeatMode,
    nextRepeatMode,
    router,
    handleToggle,
  }: ExpandedPlayerProps) => {
    const formattedPosition = useMemo(
      () => formatMilliseconds(position),
      [position]
    );
    const formattedDuration = useMemo(
      () => formatMilliseconds(duration),
      [duration]
    );
    const imageSource = useMemo(
      () =>
        currentTrack?.image
          ? { uri: currentTrack.image }
          : require("@/assets/icons/default-song.png"),
      [currentTrack?.image]
    );

    return (
      <View
        style={[styles.playerContainer, { backgroundColor: colors.background }]}
      >
        <View style={styles.imageContainer}>
          <Image source={imageSource} style={styles.albumImage} />
        </View>
        {Platform.OS === "ios" && (
          <TouchableOpacity
            onPress={handleToggle}
            style={styles.iosCloseButton}
          >
            <Ionicons name="chevron-down" size={30} color={colors.text} />
          </TouchableOpacity>
        )}
        <View
          style={[styles.sliderContainer, { marginTop: 38, marginBottom: 48 }]}
        >
          <Text style={[styles.text, { color: colors.text }]}>
            {formattedPosition}
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onSlidingComplete={handleSeek}
            thumbTintColor={colors.primary}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.primary}
          />
          <Text style={[styles.text, { color: colors.text }]}>
            {formattedDuration}
          </Text>
        </View>

        <Text style={[styles.text, styles.trackTitle, { color: colors.text }]}>
          {currentTrack?.name ?? "Desconhecida"}
        </Text>
        <Text
          style={[styles.text, { fontSize: 16, color: colors.textSecondary }]}
        >
          {currentTrack?.artist ?? "Desconhecido"}
        </Text>

        <View style={styles.addToandFavoriteView}>
          <TouchableOpacity onPress={() => router.push("/choosePlaylist")}>
            <Ionicons name="list-outline" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleFavorite}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={nextRepeatMode}>
            <Ionicons
              name={repeatMode === "all" ? "infinite" : "repeat"}
              size={24}
              color={colors.text}
              style={{ opacity: repeatMode === "off" ? 0.5 : 1 }}
            />
          </TouchableOpacity>
          <View style={styles.controls}>
            <TouchableOpacity onPress={togglePreviousSong}>
              <Ionicons name="play-skip-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={togglePlayPause}>
              <Ionicons
                name={isPlaying ? "pause-circle" : "play-circle"}
                size={70}
                color={colors.text}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleNextSong}>
              <Ionicons
                name="play-skip-forward"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={toggleShuffle}>
            <Ionicons
              name="shuffle"
              size={24}
              color={colors.text}
              style={{ opacity: isShuffleEnabled ? 1 : 0.5 }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.sliderContainer}>
          <Ionicons name="volume-low-outline" size={24} color={colors.text} />
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={volume}
            onValueChange={handleVolumeChange}
            thumbTintColor={colors.primary}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.primary}
          />
          <Ionicons name="volume-high-outline" size={24} color={colors.text} />
        </View>

        <TouchableOpacity
          onPress={() => router.push("/lyric")}
          style={[styles.touchableOpacity, { backgroundColor: colors.primary }]}
        >
          
          <Text style={{ color: colors.text }}>VER LETRA</Text>
        </TouchableOpacity>
      </View>
    );
  }
);

const MiniPlayer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [volume, setVolumeState] = useState(0.7);

  const currentTrack = useCurrentTrack();
  const isPlaying = useIsPlaying();
  const togglePlayPause = useTogglePlayPause();
  const togglePreviousSong = useTogglePreviousSong();
  const toggleNextSong = useToggleNextSong();
  const seekTo = useSeekTo();
  const position = usePosition();
  const duration = useDuration();
  const setVolume = useSetVolume();
  const { toggleShuffle, repeatMode, setRepeatMode, isShuffleEnabled } =
    usePlayerStore();
  const colors = useThemeColors();
  const database = useDatabase();
  const router = useRouter();
  const pathname = usePathname();

  const handleToggle = useCallback(() => setIsExpanded((prev) => !prev), []);
  const handleSeek = useCallback((value: number) => seekTo(value), [seekTo]);
  const handleVolumeChange = useCallback((value: number) => {
    setVolumeState(value);
    setVolume(value);
  }, []);

  const toggleFavorite = useCallback(async () => {
    if (!currentTrack?.id) return;
    const db = await database;
    if (isFavorite) {
      await db.removeFavoriteMusic(currentTrack.id);
      setIsFavorite(false);
    } else {
      await db.addFavoriteMusic(currentTrack.id);
      setIsFavorite(true);
    }
  }, [isFavorite, currentTrack?.id]);

  const nextRepeatMode = () => {
    const modes = ["off", "one", "all"] as const;
    const nextIndex = (modes.indexOf(repeatMode) + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  useEffect(() => {
    if (!isExpanded) return;
    const onBackPress = () => {
      setIsExpanded(false);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );
    return () => backHandler.remove();
  }, [isExpanded]);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      const checkFavorite = async () => {
        if (!currentTrack?.id) return;
        const db = await database;
        const isFav = await db.isFavoriteMusic(currentTrack.id);
        if (mounted) setIsFavorite(isFav);
      };
      checkFavorite();
      return () => {
        mounted = false;
      };
    }, [currentTrack?.id])
  );

  if (
    !currentTrack ||
    ["/player", "/lyric", "/choosePlaylist"].includes(pathname)
  )
    return null;

  return isExpanded ? (
    <ExpandedPlayer
      currentTrack={{
        ...currentTrack,
        name: currentTrack?.name ?? "Desconhecida",
      }}
      isPlaying={isPlaying}
      position={position}
      duration={duration}
      volume={volume}
      colors={colors}
      isFavorite={isFavorite}
      togglePlayPause={togglePlayPause}
      togglePreviousSong={togglePreviousSong}
      toggleNextSong={toggleNextSong}
      handleSeek={handleSeek}
      handleVolumeChange={handleVolumeChange}
      toggleFavorite={toggleFavorite}
      toggleShuffle={toggleShuffle}
      isShuffleEnabled={isShuffleEnabled}
      repeatMode={repeatMode}
      nextRepeatMode={nextRepeatMode}
      router={router}
      handleToggle={handleToggle}
    />
  ) : (
    <CollapsedMiniPlayer
      currentTrack={{
        ...currentTrack,
        name: currentTrack?.name ?? "Desconhecida",
      }}
      isPlaying={isPlaying}
      togglePlayPause={togglePlayPause}
      handleToggle={handleToggle}
      colors={colors}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 60,
    width: "100%",
    zIndex: 10,
  },
  miniImageWrapper: {
    width: 40,
    height: 40,
    backgroundColor: "#c1c1c1",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginRight: 10,
    marginLeft: 5,
  },
  miniImage: {
    width: 25,
    height: 25,
    borderRadius: 5,
  },
  title: { fontWeight: "bold" },
  artist: { fontSize: 12 },
  playerContainer: {
    flex: 1,
    alignItems: "center",
    position: "absolute",
    height: "100%",
    paddingTop: 10,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 200,
    backgroundColor: "#c1c1c1",
    borderRadius: 35,
    marginTop: 40,
  },
  albumImage: { width: 150, height: 150, borderRadius: 10 },
  iosCloseButton: { position: "absolute", top: 30, right: 10 },
  sliderContainer: { flexDirection: "row", alignItems: "center", gap: 10 },
  slider: { width: 240 },
  text: { textAlign: "center" },
  trackTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  addToandFavoriteView: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 40,
    marginVertical: 20,
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 40,
    marginBottom: 40,
  },
  controls: { flexDirection: "row", alignItems: "center", gap: 10 },
  touchableOpacity: {
    paddingHorizontal: 23,
    paddingVertical: 10,
    borderRadius: 35,
    marginTop: 30,
    marginBottom: 20,
  },
});

export default MiniPlayer;
