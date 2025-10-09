import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Config() {
  const colors = useThemeColors();
  const router = useRouter();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
          name="arrow-back"
          color={colors.text}
          size={29}
          />
        </TouchableOpacity>
        <Text style={[styles.title, {color: colors.text}]}>Configurações</Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/configPages/personalization")}>
          <Ionicons
            name="brush"
            color={colors.text}
            size={30}
            />
          <Text style={[styles.text, {color: colors.text}]}>PERSONALIZAÇÃO</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Ionicons
            name="musical-note"
            color={colors.text}
            size={30}
            />
          <Text style={[styles.text, {color: colors.text}]}>
            EQUALIZADOR
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Ionicons
            name="musical-notes"
            color={colors.text}
            size={30}
            /> 
          <Text style={[styles.text, {color: colors.text}]}>
            ÁUDIO
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Ionicons
            name="options"
            color={colors.text}
            size={30}
            />
          <Text style={[styles.text, {color: colors.text}]}>
            OUTROS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Ionicons
            name="cloud-upload"
            color={colors.text}
            size={30}
            />
          <Text style={[styles.text, {color: colors.text}]}>
            BACKUP & RESTAURAÇÃO
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/configPages/about")}>
          <Ionicons
            name="information-circle"
            color={colors.text}
            size={30}
            />
          <Text style={[styles.text, {color: colors.text}]}>
            SOBRE
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  header: {
    width: "100%",
    paddingTop: "5%",
    flexDirection: "row",
    textAlign: "center",
    alignItems: "center",
    paddingHorizontal: 25,
    gap: 30
  },
  title: {
    fontSize: 24,
  },
  text: {
    fontSize: 20
  },
  buttons: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    gap: 30
  },
  button: {
    flexDirection: "row",
    gap: 9,
    alignItems: "center",
    padding: 10,
  }
});