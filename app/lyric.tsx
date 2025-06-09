import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useCurrentTrack } from "@/store/playerSelectors";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useThemeStore } from "@/store/themeStore";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import LoadingAnimationContainer from "@/components/LoadingAnimationContainer";

const { height: screenHeight } = Dimensions.get("window");

export default function Lyric() {
    const [lyric, setLyric] = useState<string[] | string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const currentTrack = useCurrentTrack();
    const colors = useThemeColors();
    const router = useRouter();
    const translateY = useSharedValue(0);
    const theme = useThemeStore((state) => state.theme);
    const gradientColors: [string, string, ...string[]] = theme === "dark"
      ? ["#0E0E10", "#1DB95422", "#1DB95455", "#1C1C1F"]
      : ["#F4F4F6", "#E0F7EC", "#D0F0E0", "#FFFFFF"];

     useEffect(() => {
       translateY.value = withTiming(-screenHeight, {
         duration: 100000,
       });
     }, []);

     const animatedStyle = useAnimatedStyle(() => ({
       transform: [{ translateY: translateY.value }],
     }));
    const fetchLyric = async () => {
        try {
            setIsLoading(true);
            const artist = currentTrack?.artist !== "Desconhecido(a)" ? currentTrack?.artist :currentTrack?.name?.split(" - ")[0];
            const title = currentTrack?.artist !== "Desconhecido(a)" ? currentTrack?.name :  currentTrack?.name?.split(" - ")[1];
            const response = axios.get(`https://api.lyrics.ovh/v1/${artist}/${title}`)
            const data = await response;
            setLyric(data.data.lyrics);
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                console.log("Letra não encontrada para a música:", currentTrack?.name);
            }
            console.log("Error fetching lyrics:", error);
        }
        setIsLoading(false);
    };
    useEffect(() => {
        fetchLyric();
    }, [currentTrack]);
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.8, y: 1.2 }}
          style={styles.background}
        >
          <View style={styles.header}>
            <View style={styles.imageContainer}>
              <Image
                source={
                  currentTrack?.image
                    ? { uri: currentTrack.image }
                    : require("@/assets/icons/default-song.png")
                }
                style={{
                  width: currentTrack?.image ? 40 : 30,
                  height: currentTrack?.image ? 40 : 30,
                  borderRadius: currentTrack?.image ? 5 : 0,
                  borderWidth: currentTrack?.image ? 1 : 0,
                  borderColor: colors.text,
                }}
              />
            </View>
            <View style={styles.songDataView}>
              <Text style={[styles.songName, { color: colors.text }]}>
                {currentTrack?.name?.split(" - ")[0] || currentTrack?.name}
              </Text>
              <Text style={[styles.songArtist, { color: colors.secondary }]}>
                {currentTrack?.name?.split(" - ")[1] ||
                  currentTrack?.artist ||
                  "Desconhecido"}
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={25} color={colors.text} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: screenHeight * 5,
              overflow: "scroll",
              marginTop: 20,
            }}
          >
            <Animated.View style={[styles.lyricView, lyric && animatedStyle]}>
                <Text style={[styles.lyric, { color: colors.text }]}>
                  {lyric ?? "Desculpe, a letra da música não pode ser encontrada. 😓"}
                </Text>
            </Animated.View>
          </View>
        </LinearGradient>
        {isLoading && <LoadingAnimationContainer />}
      </View>
    );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    alignContent: "center",
  },
  background: {
    paddingTop: "5%",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    backgroundColor: "#c1c1c1",
    borderStyle: "solid",
    borderColor: "#171C27",
    borderWidth: 1,
    borderRadius: 5,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    paddingHorizontal: 20,
    marginTop: 15,
  },
  songDataView: {
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",
  },
  songName: {
    color: "#fff",
    fontSize: 18,
  },
  songArtist: {
    color: "#fff",
    fontSize: 14,
  },
  lyricView: {
    width: "100%",
    height: "100%",
    padding: 20,
  },
  lyric: {
    fontSize: 22,
    textAlign: "center",
    lineHeight: 30,   
  },
});