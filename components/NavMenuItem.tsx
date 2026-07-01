import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Link, usePathname } from "expo-router";
import type { LinkProps } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const NavMenuItem = ({ icon, text, route }: { icon: keyof typeof Ionicons.glyphMap; text: string; route: LinkProps["href"] }) => {
  const colors = useThemeColors();
  const pathname = usePathname();
  const cleanPath = (path: string) => path.replace("/(tabs)", "");
  const isActive = cleanPath(pathname) === cleanPath(typeof route === "string" ? route : "");
    return (
    <Link href={route} asChild style={{ flex: 1 }}>
    <TouchableOpacity style={styles.button}>
      <Ionicons
        style={[styles.image, isActive && styles.activeImage]}
        name={icon}
        size={20}
        color={isActive ? colors.primary : colors.text}
      />
      <Text style={isActive ? [styles.text, {color: colors.text}] : {display: "none"}}>{text}</Text>
    </TouchableOpacity>
    </Link>
  );
};
export default NavMenuItem;

const styles = StyleSheet.create({
  button: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#FFF",
    fontSize: 12,
    textAlign: "center",
    display: "flex",
  },
  image: {
    width: 20,
    height: 20,
    marginBottom: 5,
    opacity: 0.5,
  },
  activeImage: {
    transform: [{ scale: 1.3 }],
    opacity: 1,
  }
});