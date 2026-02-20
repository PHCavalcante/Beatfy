import { useEffect, useRef } from "react";
import { AppState, Platform, StatusBar as RNStatusBar } from "react-native";
import * as SystemUI from "expo-system-ui";
import { useThemeStore } from "@/store/themeStore";

export function useSystemUI() {
  const theme = useThemeStore((state) => state.theme);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const configureSystemUI = async () => {
      if (Platform.OS === "android") {
        try {
          const backgroundColor = theme === "dark" ? "#0A0A0C" : "#F8F9FA";
          
          await SystemUI.setBackgroundColorAsync(backgroundColor);
          
          RNStatusBar.setBarStyle(theme === "dark" ? "light-content" : "dark-content", true);
          
          RNStatusBar.setTranslucent(false);
        } catch (error) {
          console.warn("Erro ao configurar SystemUI:", error);
        }
      }
    };

    configureSystemUI();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        setTimeout(() => {
          configureSystemUI();
        }, 100);
      }
      
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [theme]);
}
