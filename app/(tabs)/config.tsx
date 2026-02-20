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
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.surface }]}
          onPress={() => router.push("/configPages/personalization")}
          activeOpacity={0.8}
        >
          <Ionicons
            name="brush"
            color={colors.text}
            size={30}
            />
          <Text style={[styles.text, { color: colors.text }]}>PERSONALIZAÇÃO</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.surface }]} activeOpacity={0.8}>
          <Ionicons name="musical-note" color={colors.text} size={24} />
          <Text style={[styles.text, { color: colors.text }]}>EQUALIZADOR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.surface }]} activeOpacity={0.8}>
          <Ionicons name="musical-notes" color={colors.text} size={24} />
          <Text style={[styles.text, { color: colors.text }]}>ÁUDIO</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.surface }]} activeOpacity={0.8}>
          <Ionicons name="options" color={colors.text} size={24} />
          <Text style={[styles.text, { color: colors.text }]}>OUTROS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.surface }]} activeOpacity={0.8}>
          <Ionicons name="cloud-upload" color={colors.text} size={24} />
          <Text style={[styles.text, { color: colors.text }]}>BACKUP & RESTAURAÇÃO</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.surface }]}
          onPress={() => router.push("/configPages/about")}
          activeOpacity={0.8}
        >
          <Ionicons name="information-circle" color={colors.text} size={24} />
          <Text style={[styles.text, { color: colors.text }]}>SOBRE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    width: "100%",
    paddingTop: "5%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
  buttons: {
    width: "90%",
    flex: 1,
    gap: 12,
  },
  button: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
});