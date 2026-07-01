import { useRouter, usePathname } from "expo-router";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColor";
import Logo from "../components/Logo";

const Header = () => {
    const router = useRouter();
    const colors = useThemeColors();
    const pathname = usePathname();
    return (
        <View style={[styles.header, { backgroundColor: colors.background }]}>
            {pathname !== "/explore" && pathname !== "/choosePlaylist" && <TouchableOpacity onPress={() => router.push("/searchMusicLocal")}>
                <Ionicons name="search" size={24} color={colors.text} />
            </TouchableOpacity>
            }
            <Logo />
            {pathname !== "/explore" && pathname !== "/choosePlaylist" && <TouchableOpacity onPress={() => router.push("/config")}>
                <Ionicons name="settings-sharp" size={24} color={colors.text} />

                    </TouchableOpacity>
                    }
                </View>
                );
};
                export default Header;

                const styles = StyleSheet.create({
                    header: {
                    width: "90%",
                marginTop: 15,
                padding: 2,
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
                alignContent: "center",
    },
});