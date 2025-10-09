import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { RelativePathString, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

export default function HomeSection({ title, route, colors } : { title: string, route: RelativePathString, colors: any }) {
    const router = useRouter();
    return (
      <View style={styles.recentesTitle}>
        <Text style={[styles.recentsTitleText, { color: colors.text }]}>
          {title}
        </Text>
        <TouchableOpacity onPress={() => router.push(route)}>
          <AntDesign name="arrow-right" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>
    );
}
const styles = StyleSheet.create({
  recentesTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  recentsTitleText: {
    fontSize: 24,
  },
});
