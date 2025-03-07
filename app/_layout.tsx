import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import theme from "@/constants/theme"; // import the global theme

SplashScreen.preventAutoHideAsync(); // prevent splash screen from hiding too early

export default function RootLayout() {
  // load custom font
  const [fontsLoaded] = useFonts({
    "Monomakh": require("../assets/fonts/Monomakh.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync(); // hide splash screen when fonts are loaded
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false, animation: "fade", gestureEnabled: true }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
