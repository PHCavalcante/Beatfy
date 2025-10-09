import { View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useRef } from "react";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider"; 
import { Sound } from "expo-av/build/Audio";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

export default function Radio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Sound | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const colors = useThemeColors();
  const volume = useRef(0.5);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1,
      true
    );
     opacity.value = withRepeat(
       withSequence(
         withTiming(0.5, { duration: 500 }),
         withTiming(1, { duration: 500 })
       ),
       -1,
       true
     );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
      };
    }
  );

  const playAudio = async () => {
    setIsLoading(true);
    try {
      const { sound } = await Audio.Sound.createAsync({
        uri: "https://stream.zeno.fm/qnozhn4xig7uv",
      });
      setSound(sound);
      setIsPlaying(true);
      await sound.playAsync();
    } catch (error) {
      console.error("Erro ao reproduzir áudio:", error);
    }
    setIsLoading(false);
  };
  const stopAudio = async () => {
    try {
      await sound?.stopAsync();
      setIsPlaying(false);
      await sound?.unloadAsync();
    } catch (error) {
      console.error("Erro ao parar áudio:", error);
    }
  };
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Animated.View
        style={
          isPlaying ? [styles.radioImage, animatedStyle] : styles.radioImage
        }
      >
        <Ionicons name="radio-outline" size={70} color={colors.text} />
      </Animated.View>
      <View style={styles.controlsButtons}>
        {!isLoading ? (
          <TouchableOpacity onPress={isPlaying ? stopAudio : playAudio}>
            <Ionicons
              name={isPlaying ? "pause-circle" : "play-circle"}
              size={80}
              color={colors.text}
            />
          </TouchableOpacity>
        ) : (
          <LottieView
            source={require("@/assets/animations/loading-to-radio.json")}
            autoPlay
            loop={true}
            style={{ width: 80, height: 80 }}
            colorFilters={[
              { keypath: "Shape Layer 1.Ellipse 1.Fill 1", color: colors.text },
              { keypath: "Shape Layer 2.Ellipse 1.Fill 1", color: colors.text },
              { keypath: "Shape Layer 3.Ellipse 1.Fill 1", color: colors.text },
              { keypath: "Shape Layer 4.Ellipse 1.Fill 1", color: colors.text },
              { keypath: "Shape Layer 5.Ellipse 1.Fill 1", color: colors.text },
            ]}
          />
        )}
        <View style={styles.sliderView}>
          <Ionicons name="volume-low-outline" size={24} color={colors.text} />
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            thumbTintColor={colors.primary}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.primary}
            value={volume.current}
            step={0.01}
            onValueChange={(value) => {
              volume.current = value;
              if (sound) {
                sound.setVolumeAsync(value);
              }
            }}
          />
          <Ionicons name="volume-high-outline" size={24} color={colors.text} />
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    alignItems: "center",
  },
  radioImage: {
    marginTop: 50,
  },
  controlsButtons: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  sliderView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
  },
  slider: {
    width: 230,
    height: 40,
    transform: [{ scaleY: 1.3 }, { scaleX: 1.1 }],
  },
});
