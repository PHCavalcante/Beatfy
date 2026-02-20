import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Music from "@/components/Music";
import { useRouter, RelativePathString } from "expo-router";
import Header from "@/components/Header";
import { useDatabase, type MusicInfo } from "@/database/useDatabase";
import ModalPlaylistDetails from "@/components/ModalPlaylistDetails";
import HomeSection from "@/components/HomeSection";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useToast } from "@/context/ToastContext";
import { Ionicons } from "@expo/vector-icons";
import { usePlayTrack } from "@/store/playerSelectors";
import { borderRadius, spacing } from "@/theme";

export default function Home() {
  const [recentPlays, setRecentPlays] = useState<MusicInfo[] | null>([]);
  const [suggestion, setSuggestion] = useState<MusicInfo[] | null>([]);
  const [favorite, setFavorite] = useState<MusicInfo[] | null>([]);
  const [playlists, setPlaylists] = useState<{ id: number; name: string }[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);
  const [playlistMusics, setPlaylistMusics] = useState<MusicInfo[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);

  const colors = useThemeColors();
  const router = useRouter();
  const database = useDatabase();
  const { showToast } = useToast();

  const playTrack = usePlayTrack();


  const suggestionSongs = async () => {
    try {
      if (suggestion !== null && suggestion.length > 0) return;
      const songs = (await database).queryRandomAllMusics();
      setSuggestion(await songs);
    } catch (error) {
      showToast("Erro ao carregar recomendações.", "error");
    }
  };
  const recentSongs = async () => {
    try {
      const songs = (await database).queryRecentPlaysMusics();
      if ((await songs).length === 0) {
        suggestionSongs();
      }
      setRecentPlays(await songs);
    } catch (error) {
      showToast("Erro ao carregar músicas recentes.", "error");
    }
  };
  const favoriteSongs = async () => {
    const favorite = (await database).queryFavoriteMusics();
    setFavorite(await favorite);
  };
  const loadPlaylists = async () => {
    try {
      const db = await database;
      const allPlaylists = await db.queryAllPlaylists();
      setPlaylists(allPlaylists);
    } catch (error) {
      showToast("Erro ao carregar playlists.", "error");
    }
  };
  const togglePlaylist = async (playlistId: number) => {
    if (selectedPlaylistId === playlistId) {
      setSelectedPlaylistId(null);
      setPlaylistMusics([]);
      setModalVisible(false);
    } else {
      try {
        const db = await database;
        const musics = await db.getMusicsFromPlaylist(playlistId);
        setSelectedPlaylistId(playlistId);
        setPlaylistMusics(musics);
        setModalVisible(true);
      } catch (error) {
        showToast("Erro ao carregar músicas da playlist.", "error");
      }
    }
  };

  useEffect(() => {
    recentSongs();
    favoriteSongs();
    loadPlaylists();
  }, []);
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <ModalPlaylistDetails
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          playlistMusics={playlistMusics}
        />

        <View style={styles.content}>
          <TouchableOpacity
            onPress={() => router.push("/radio")}
            style={[styles.radioCard, { backgroundColor: colors.surface }]}
            activeOpacity={0.8}
          >
            <View style={[styles.radioIconContainer, { backgroundColor: colors.surfaceElevated ?? colors.surface }]}>
              <Ionicons name="radio-outline" size={48} color={colors.primary} />
            </View>
            <Text style={[styles.radioTitle, { color: colors.text }]}>Rádio ao Vivo</Text>
            <Text style={[styles.radioSubtitle, { color: colors.textSecondary }]}>
              Ouça estações de rádio em tempo real
            </Text>
            <View style={[styles.radioButton, { backgroundColor: colors.primary }]}>
              <Text style={styles.radioButtonText}>OUVIR RÁDIO</Text>
            </View>
          </TouchableOpacity>

          {recentPlays?.length === 0 ? (
            <View style={styles.recents}>
              <View style={styles.recentesTitle}>
                <Text style={[styles.recentsTitleText, { color: colors.text }]}>
                  Recomendadas para Você</Text>
              </View >
              <ScrollView horizontal contentContainerStyle={styles.listMusicCarrosel} showsHorizontalScrollIndicator={false}>
                {suggestion?.map((value, index) => (
                  <Music
                    key={value.path ?? `${value.name} - ${index}`}
                    mode="grid"
                    name={value.name}
                    artist={value.artist ?? "Desconhecido(a)"}
                    url={value.url ?? require("../../assets/icons/default-song.png")}
                    path={value.path}
                    id={value.id}
                    onPress={() =>
                      playTrack(
                        {
                          id: value.id,
                          name: value.name,
                          uri: value.path ?? "",
                          artist: value.artist,
                        },)}
                  />
                ))}
              </ScrollView>
            </View>
          ) : (
            <View style={styles.recents}>
              <HomeSection title="Tocadas Recentemente" route={"/list/recent" as RelativePathString} colors={colors} />

              <ScrollView horizontal contentContainerStyle={styles.listMusicCarrosel} showsHorizontalScrollIndicator={false}>
                {recentPlays?.slice(0, 4).map((value, index) => (
                  <Music
                    key={value.path ?? `${value.name} - ${index}`}
                    mode="grid"
                    name={value.name}
                    artist={value.artist ?? "Desconhecido(a)"}
                    url={value.url ?? require("../../assets/icons/default-song.png")}
                    path={value.path}
                    id={value.id}
                    onPress={() =>
                      playTrack(
                        {
                          id: value.id,
                          name: value.name,
                          uri: value.path ?? "",
                          artist: value.artist,
                        },)}
                  />
                ))}

              </ScrollView>
            </View>
          )
          }

          {favorite?.length! > 0 && <View style={styles.favorite}>
            <HomeSection title="Favoritas" route={"/list/favorites" as RelativePathString} colors={colors} />
            <ScrollView horizontal contentContainerStyle={styles.listMusicCarrosel} showsHorizontalScrollIndicator={false}>
              {favorite?.slice(0, 4).map((value, index) => (
                <Music
                  key={value.path ?? `${value.name} - ${index}`}
                  mode="grid"
                  name={value.name}
                  artist={value.artist ?? "Desconhecido(a)"}
                  url={value.url ?? require("../../assets/icons/default-song.png")}
                  path={value.path}
                  id={value.id}
                  onPress={() =>
                    playTrack(
                      {
                        id: value.id,
                        name: value.name,
                        uri: value.path ?? "",
                        artist: value.artist,
                      },)}
                />
              ))}

            </ScrollView>
          </View>}
          {playlists.length > 0 && <View>
            <HomeSection title="PlayLists" route={"/playlists" as RelativePathString} colors={colors} />
            <View style={styles.albuns}>
              {playlists?.slice(0, 4).map((playlist) => (
                <Music
                  key={playlist.id}
                  mode="grid"
                  name={playlist.name}
                  artist="Minha Playlist"
                  url={require("../../assets/icons/default-song.png")}
                  path={`/playlist/${playlist.id}`}
                  onPress={() => togglePlaylist(playlist.id)}

                />
              ))}
            </View>
          </View>}
        </View >
      </ScrollView >
    </SafeAreaView >
  );

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  scroll: {
    width: "100%",
    paddingHorizontal: spacing.md,
    flexDirection: "column",
  },
  scrollContent: {
    paddingBottom: 120,
  },
  content: {
    gap: spacing.lg,
  },
  radioCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  radioIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  radioTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  radioSubtitle: {
    fontSize: 14,
    marginBottom: spacing.md,
  },
  radioButton: {
    borderRadius: borderRadius.full,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  radioButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },
  recents: {
    width: "100%",
  },
  recentesTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  recentsTitleText: {
    fontSize: 22,
    fontWeight: "700",
  },
  listMusicCarrosel: {
    height: 240,
    paddingBottom: spacing.md,
    alignItems: "baseline",
  },
  favorite: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    width: "100%",
  },
  albuns: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: spacing.sm,
  },
});
