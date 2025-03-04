import { View, Image, Text, StyleSheet, SafeAreaView, Button } from "react-native";
import { useRouter } from "expo-router";
import theme from "@/constants/theme";
import { User } from "@/constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

export default function WelcomeScreen() {
  const router = useRouter();

  const DEFAULT_USER: User = {
    uid: "0",
    avatar: "https://framerusercontent.com/images/dvrschHGP374SPK1HpDjWPcdFEk.png",
    username: "namnguyen02",
    firstName: "Nam",
    lastName: "Nguyen",
    bio: "I'm a software developer! I love to code and build cool apps. Also, I'm a huge fan of React Native, I guess :P",
  }

  const saveUserIfNotExists = async () => {
    try {
      const user = await AsyncStorage.getItem("user"); // retrieve the user, return null if not found, or a user object in JSON format
      if (!user) {
        await AsyncStorage.setItem("user", JSON.stringify(DEFAULT_USER)); // save the default user object to the AsyncStorage
      } else {
        console.log("User already exists:", user);
      }
    } catch (error) {
      console.error("Failed to save the user:", error);
    }
  };

  // when the app first, open we will load the mock user and save it to the AsyncStorage
  React.useEffect(() => {
    saveUserIfNotExists();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.subContainer}>
        <Image
          source={require("../assets/images/roaming-logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Roaming</Text>
      </View>
      <View style={styles.button}>
        <Button
          title="Get Started"
          onPress={() => router.replace("/(tabs)")} // navigate to the tabs screen
          color={theme.tertiary}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  subContainer: {
    position: "absolute", // position absolutely to break normal layout flow
    top: "50%", // move it down by 50% of the screen height
    transform: [{ translateY: -60 }], // adjust centering
    alignItems: "center", // center content horizontally
    width: "100%", // take up the full width
  },
  title: {
    fontSize: 32,
    fontFamily: theme.titleFont,
    color: theme.tertiary,
    marginTop: -35,
  },
  logo: {
    paddingRight: 5,
    width: 150,
    height: 120,
  },
  button: {
    position: "absolute",
    bottom: 50,
    backgroundColor: theme.secondary,
    borderRadius: 50,
    width: 200,
    paddingVertical: 5,
  }
});