import React, { useState, useEffect } from "react";
import { View, Image, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import theme from "../constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthModal from "../components/auth/AuthModal";
import { api } from "@/services/api";

export default function WelcomeScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // check if user is already signed in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // fetch token from async storage
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setIsLoading(false);
          return;
        }

        // verify token with server
        const response = await api.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) { // token is valid and user is signed in
          await AsyncStorage.setItem("user", JSON.stringify(response.data));
          router.navigate("/(tabs)/home");
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log("Error verifying user:", error);
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* logo and title */}
      <View style={styles.subContainer}>
        <Image source={require("../assets/images/roaming-logo.png")} style={styles.logo} />
        <Text style={styles.title}>Roaming</Text>
      </View>

      {isLoading ?
        <ActivityIndicator style={{ position: 'absolute', bottom: 100 }} size="large" color={theme.accent} />
        :
        <>
          {/* sign in button */}
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => setModalVisible(true)}
            activeOpacity={0.9}
          >
            <Text style={styles.buttonText}>Sign In with Email</Text>
          </TouchableOpacity>

          {/* auth Modal */}
          <AuthModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            isSignUp={isSignUp}
            switchMode={() => setIsSignUp(!isSignUp)}
          />
        </>
      }
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
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -100 }],
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 32,
    fontFamily: theme.titleFont,
    color: theme.textColor,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: "100%",
    marginBottom: 10,
  },
  button: {
    position: "absolute",
    bottom: 75,
    backgroundColor: theme.accent,
    borderRadius: 50,
    width: 200,
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    color: theme.textColor,
    fontSize: 15,
    fontWeight: "bold",
  },
});
