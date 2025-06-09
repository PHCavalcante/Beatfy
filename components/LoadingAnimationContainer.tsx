import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

export default function LoadingAnimationContainer() {
  return (
    <View style={styles.container}>
        <LottieView
            source={require("@/assets/animations/loading-lottie.json")}
            autoPlay
            loop={true}
            style={{ width: 150, height: 150 }}
        />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
});