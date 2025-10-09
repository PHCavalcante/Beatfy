import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Music from '../../components/Music'
import { useRouter, RelativePathString } from 'expo-router';
import Header from '@/components/Header';
import { useDatabase, type MusicInfo } from '@/database/useDatabase';
import ModalPlaylistDetails from '@/components/ModalPlaylistDetails';
import HomeSection from "@/components/HomeSection";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { usePlayTrack } from "@/store/playerSelectors";

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

  const playTrack = usePlayTrack();


  const suggestionSongs = async () => {
    try {
      if (suggestion !== null && suggestion.length > 0) return;
      const songs = (await database).queryRandomAllMusics();
      setSuggestion(await songs);
    } catch (error) {
      console.log("Erro ao consultar dados aleatórios da tabela all_musics: ", error);
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
      console.log("Erro ao transicionar dados no banco de dados: ", error);
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
      console.error("Erro ao buscar playlists:", error);
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
        console.log("Erro ao carregar músicas da playlist:", error);
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
        contentContainerStyle={{ paddingBottom: "10%" }}
        style={styles.scroll}
      >
        <ModalPlaylistDetails
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          playlistMusics={playlistMusics}
        />

        <View style={{ gap: 17 }}>
          <View style={styles.buttonRadio}>
            <Ionicons name="radio-outline" size={60} color={colors.text} />
            <TouchableOpacity
              onPress={() => router.push("/radio")}
              style={[styles.radioButton, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.text}>OUVIR RÁDIO</Text>
            </TouchableOpacity>
          </View>

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
    padding: "5%",
    flexDirection: "column",
  },
  radioButton: {
    borderRadius: 30,
    padding: 2,
    width: 183,
  },
  text: {
    fontSize: 24,
    textAlign: "center",
  },
  header: {
    width: "90%",
    marginTop: 15,
    padding: 2,
    marginBottom: "10%",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  recents: {
    width: "100%",
  },
  recentesTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  recentsTitleText: {
    fontSize: 24,
  },
  buttonRadio: {
    marginBottom: "20%",
    alignItems: "center",
    gap: 10,
  },
  listMusicCarrosel: {
    height: 230,
    paddingBottom: 20,
    alignItems: "baseline",
    alignContent: "flex-start",
    gap: 10,
  },
  favorite: {
    marginTop: 15,
    marginBottom: 28,
    width: "100%",
    flex: 1,
    justifyContent: "space-between",
  },
  favoritesList: {
    flexDirection: "column",
  },
  albuns: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginLeft: 0,
  },
});
