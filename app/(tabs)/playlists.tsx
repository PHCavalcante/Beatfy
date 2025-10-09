import { useCallback, useState } from "react";
import { View, StyleSheet, Text, ScrollView, TouchableOpacity,TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import Music from "@/components/Music";
import { useFocusEffect } from "expo-router";
import { useDatabase } from "@/database/useDatabase";
import ModalPlaylistDetails from "@/components/ModalPlaylistDetails";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColor";

export type MusicInfo = {
  id: string;
  name: string;
  artist?: string;
  url?: string;
  path: string;
  duration?: number;
};

export default function PlayLists() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const database = useDatabase();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisibleAdd, setModalVisibleAdd] = useState(false);

  const [playlistMusics, setPlaylistMusics] = useState<MusicInfo[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);
  const [playlistName, setPlaylistName] = useState("");

  const fetchPlaylists = async () => {
    try {
      const db = await database;
      const data = await db.queryAllPlaylists();
      setPlaylists(data);
    } catch (error) {
      console.log("Erro ao buscar playlists:", error);
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

  const loadPlaylists = async () => {
    try {
      const db = await database;
      const allPlaylists = await db.queryAllPlaylists();
      setPlaylists(allPlaylists);
    } catch (error) {
      console.error("Erro ao buscar playlists:", error);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!playlistName.trim()) return;
    try {
      const db = await database;
      await db.createPlaylist(playlistName.trim());
      setPlaylistName("");
      setModalVisibleAdd(false);
      await loadPlaylists();
    } catch (error) {
      console.error("Erro ao criar playlist:", error);
    }
  };

  const handleDeletePlaylist = async (playlistId: number) => {
    try {
      const db = await database;
      await db.deletePlaylist(playlistId);
      setSelectedPlaylistId(null);
      setPlaylistMusics([]);
      await loadPlaylists();
    } catch (error) {
      console.log("Erro ao deletar playlist:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPlaylists();
    }, [])
  ); 
  const colors = useThemeColors();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header />
      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={{ alignItems: "center", paddingTop: 10 }}>

            <TouchableOpacity
              onPress={() => setModalVisibleAdd(true)}
              style={{
                backgroundColor: "#1A1A1A",
                padding: 12,
                width: 170,
                borderRadius: 15,
                alignItems: "center",
                marginBottom: 50,
              }}
            >
              <Text style={{ color: "#FFF", fontSize: 16 }}>Nova Playlist</Text>
            </TouchableOpacity>
          </View>
          <ModalPlaylistDetails
            visible={isModalVisible}
            onClose={() => setModalVisible(false)}
            playlistMusics={playlistMusics}
          />


          {playlists.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma playlist criada.</Text>
          ) : (
            <View style={styles.grid}>
              {playlists.map((playlist) => (
                <View
                  key={playlist.id}
                  style={{
                    alignItems: "center",
                    padding: 5,
                    borderRadius: 10,
                  }}
                >
                  <Music
                    mode="grid"
                    name={playlist.name}
                    artist="Minha Playlist"
                    url={require("../../assets/icons/default-song.png")}
                    path={`/playlist/${playlist.id}`}
                    onPress={() => togglePlaylist(playlist.id)}
                  />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeletePlaylist(playlist.id)}
                  >
                    <View style={{flexDirection:"row", padding:10, borderWidth:1, justifyContent:"space-between", borderRadius:10, borderColor:"white"}}>
                      <Ionicons name="trash-outline" size={20} color="white" />
                      <Text style={{ color: "white" }}>Deletar</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

        </ScrollView>

      </View>
      {isModalVisibleAdd && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <View style={{ width: "100%", alignItems: "flex-end" }}>
              <TouchableOpacity onPress={() => setModalVisibleAdd(false)}>
                <Ionicons name="close" size={25} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={{ width: "100%", gap: 30, alignItems: "center" }}>
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 18,
                  marginBottom: 15,
                  textAlign: "center",
                }}
              >
                Criar nova Playlist
              </Text>
              <TextInput
                placeholder="Nome da Playlist"
                placeholderTextColor={"#5C5C5C"}
                style={{
                  borderBottomWidth: 1,
                  borderColor: "white",
                  width: "100%",
                  color: "white",
                  padding: 0,
                }}
                value={playlistName}
                onChangeText={setPlaylistName}
              />
              <TouchableOpacity
                onPress={handleCreatePlaylist}
                style={{
                  backgroundColor: "#2F2A2A",
                  padding: 12,
                  width: 170,
                  borderRadius: 15,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#FFF", fontSize: 16 }}>
                  Criar Playlist
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  content: {
    flex: 1,
    width: "100%",
  },
  scroll: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  emptyText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  deleteButton: {
    marginLeft: 10,
    padding: 4,
  },
  modal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1A1A1A",
    padding: 20,
    borderRadius: 15,
    width: "80%",
    alignItems: "center",
  },
});
