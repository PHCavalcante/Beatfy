import { View, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "@/hooks/useThemeColor";
import NavMenuItem from "./NavMenuItem";

export default function NavMenu() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.surface,
          paddingBottom: Math.max(insets.bottom, Platform.OS === "ios" ? 25 : 15),
          borderTopColor: colors.border,
        }
      ]}
    >
      <NavMenuItem
        icon={"home"}
        text={"Início"}
        route="/(tabs)/home"
      />
      <NavMenuItem
        icon={"search"}
        text={"Explorar"}
        route="/(tabs)/explore"
      />
      <NavMenuItem
        icon={"musical-notes"}
        text={"Músicas"}
        route="/"
      />
      <NavMenuItem
        icon={"disc-sharp"}
        text={"Álbuns"}
        route="/(tabs)/albums"
      />
      <NavMenuItem
        icon={"people"}
        text={"Artistas"}
        route="/(tabs)/artists"
      />
      <NavMenuItem
        icon={"play-circle-sharp"}
        text={"Playlists"}
        route="/(tabs)/playlists"
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },
});
