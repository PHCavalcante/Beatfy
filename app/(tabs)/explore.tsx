import { View, StyleSheet, Text, TextInput, ScrollView, TouchableOpacity, Image, FlatList} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import GetTrendingSongs from "@/utils/GetTrendings";
import { usePlaySelectedTrack } from "@/store/playerSelectors";
import { useThemeColors } from "@/hooks/useThemeColor";
import axios from "axios";
import LoadingAnimationContainer from "@/components/LoadingAnimationContainer";

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const playSelectedTrack = usePlaySelectedTrack();
  const colors = useThemeColors();

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = axios.get(
          `https://discoveryprovider.audius.co/v1/tracks/search?query=${searchQuery}`
        );
        const data = (await response).data.data;
        if (data && Array.isArray(data)) {
          setSearchResults(data);
        } else {
          console.warn("Resposta inesperada:", data);
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Erro ao buscar resultados da pesquisa:", error);
      }
    };
    if (searchQuery.length > 0) fetchSearchResults();
  }, [searchQuery]);

  if (searchQuery) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Header />
        <TextInput
          placeholder="Oque você está procurando?"
          placeholderTextColor={colors.text}
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          style={{
            backgroundColor: colors.surface,
            width: "90%",
            height: 40,
            borderRadius: 10,
            paddingLeft: 10,
            color: colors.text,
            marginTop: 20,
          }}
        />
        <FlatList
          style={{ marginTop: 30, backgroundColor: colors.background }}
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                marginBottom: 20,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
              onPress={() =>
                playSelectedTrack(
                  item.id,
                  item.title,
                  item.user.name,
                  item.artwork["150x150"]
                )
              }
            >
              <Image
                source={{ uri: item.artwork["150x150"] }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 5,
                }}
              />
              <View>
                <Text style={{ color: colors.text }}>{item.title}</Text>
                <Text style={{ color: colors.textSecondary }}>{item.user.name}</Text>
              </View>
            </TouchableOpacity>
          )}
          />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Header />
      <TextInput
        placeholder="Oque você está procurando?"
        placeholderTextColor={colors.text}
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        style={{
          backgroundColor: colors.surface,
          width: "90%",
          height: 40,
          borderRadius: 10,
          paddingLeft: 10,
          color: colors.text,
          marginTop: 20,
        }}
      />
      <ScrollView
        style={{ marginTop: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>Populares no momento</Text>
          <GetTrendingSongs type={"trending"} colors={colors} setMusicLoading={setIsLoading} />
        </View>
        <View>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>Populares este mês</Text>
          <GetTrendingSongs type={"monthly"} colors={colors} setMusicLoading={setIsLoading} />
        </View>
        <View>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>As mais populares</Text>
          <GetTrendingSongs type={"allTime"} colors={colors} setMusicLoading={setIsLoading} />
        </View>
        <View>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>Playlists populares</Text>
          <GetTrendingSongs type={"playlists"} colors={colors} setMusicLoading={setIsLoading} />
        </View>
      </ScrollView>
       {isLoading && <LoadingAnimationContainer />}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        alignSelf: "flex-start",
        textAlign: "left",
        marginLeft: 10,
    }
});
