import { useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useMusics } from "@/Context/musicContext";
import { useThemeColors } from "@/hooks/useThemeColor";
import * as MediaLibrary from "expo-media-library";
import Header from "@/components/Header";
import { initializeDatabase } from "@/database/initializeDatabase";
import { useDatabase, type MusicInfo } from "@/database/useDatabase";
import { LocalMusicIcon } from "@/components/Music";
import { Track } from "@/store/playerStore";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { musics, setMusics } = useMusics();
  const [responsePermissions, requestPermissions] = MediaLibrary.usePermissions();
  const database = useDatabase();
  const colors = useThemeColors();

  const getPermissions = async () => {
    if(responsePermissions?.status !== "granted"){
      await requestPermissions();
    }
  }

  const getMusics = async () => {
    await getPermissions();
    const foundMusics = await MediaLibrary.getAssetsAsync({ mediaType: "audio", first: 300 });
    const songs = {
      ...foundMusics,
      assets: foundMusics.assets.filter((music) => music.duration && music.duration > 90),
    };
    setMusics(songs);
    insertAllMusics(songs.assets);
  }

  const insertAllMusics = async (songs : MediaLibrary.Asset[] | undefined) => {    
    try {
      const existsDataOnAllMusics = (await database).existsDataOnAllMusicTable();
      if(await existsDataOnAllMusics === false) {
        songs?.forEach(async item => {
          const musicInfo : MusicInfo = {
            id: item.id,
            name: item.filename,
            path: item.uri,
            duration: item.duration
          };
          
          (await database).insertInAllMusicsTable(musicInfo);                    
        });
      }
    } catch(error) {
      console.log("Erro ao transicionar dados na tabela all_musics: ", error);
    }
  };

  useEffect(() => {
    initializeDatabase();
    getMusics();
  }, []);

  const tracks: Track[] =
    musics?.assets.map((asset) => ({
      id: asset.id,
      uri: asset.uri,
      name: asset.filename.split(".")[0],
      artist: "Desconhecido(a)",
    })) ?? [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
     <Header/>
      <View style={{ width: "100%", height: "100%"}}>        
        <FlatList
          data = { tracks }
          keyExtractor={ item => item.id }
          renderItem ={({item }) => 
          <LocalMusicIcon 
            infoItem={item} 
            playlist={tracks} 
            colors={colors}     
          />     
          }
        />        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#2F2A2A"
  },
  recentsTitleText: {
    color: "#fff",
    fontSize: 24,
  },
});
