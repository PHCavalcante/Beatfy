import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import MiniPlayer from "@/components/MiniPlayer";
import { MusicProvider } from "@/Context/musicContext";
import { ToastProvider } from "@/context/ToastContext";
import { useThemeStore } from "@/store/themeStore";
import { useSystemUI } from "@/hooks/useSystemUI";
import { useEffect, useState } from "react";
import { useDatabase } from "@/database/useDatabase";

export default function RootLayout() {
  const theme = useThemeStore((state) => state.theme);
  const [dbReady, setDbReady] = useState(false);

  useSystemUI();

  useEffect(() => {
    useDatabase().then(() => setDbReady(true)).catch(console.error);
  }, []);

  if (!dbReady) return null;

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <MusicProvider>
          <StatusBar style={theme === "dark" ? "light" : "dark"} />
        <Stack screenOptions={{ headerShown: false, animation: "fade_from_bottom" }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="radio" />
          <Stack.Screen name="player" />
          <Stack.Screen name="lyric" />
          <Stack.Screen name="choosePlaylist" />
        </Stack>
        <MiniPlayer />
        </MusicProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
