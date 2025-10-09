import { useThemeColors } from "@/hooks/useThemeColor";
import Logo from "@/components/Logo";
import Music from "@/components/Music";
import { useMusics } from "@/Context/musicContext";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchMusicLocal() {
    const colors = useThemeColors();
    const router = useRouter();
    const { musics } = useMusics();
    const [search, setSearch] = useState("");

    const filteredMusics = musics?.assets.filter((music) =>
        music.filename.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <AntDesign
          name="arrow-left"
          size={22}
          color={colors.text}
          style={{ position: "absolute", left: 10, top: 40 }}
          onPress={() => router.push("../")}
        />
        <View
          style={{
            width: "90%",
            marginTop: 15,
            padding: 2,
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <Logo />
        </View>
        <View style={styles.content}>
          <TextInput
            style={[
              styles.textInput,
              { backgroundColor: colors.surface, color: colors.text },
            ]}
            placeholder="Músicas, artistas ou álbuns"
            placeholderTextColor={colors.text}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <View style={{ width: "100%" }}>
          {filteredMusics?.length! > 0 ? (
            <FlatList
            data={filteredMusics}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Music
                mode="local"
                url={require("../../assets/icons/default-song.png")}
                name={item.filename}
                path={item.uri}
                artist="Desconhecido(a)"
                colors={colors}
              />
            )}
          />
        ) : (
            <Text style={{ color: colors.text, textAlign: "center", marginTop: 20 }}>
              Nenhuma música encontrada
            </Text>
        )
        }
        </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    content: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginVertical:20
    },
    textInput: {
        width: "90%",
        padding: 5,
        borderRadius: 12,
        paddingHorizontal: 10,
    }
});
