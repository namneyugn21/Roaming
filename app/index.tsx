import React, { useState } from "react";
import { View, Image, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import theme from "@/constants/theme";
import { User } from "firebase/auth";
import AuthModal from "@/components/AuthModal";
import { auth } from "@/config/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WelcomeScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // check if user is already signed in
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);

        try {
          // check if the userData already exists in async storage
          const userData = await AsyncStorage.getItem("user");
          if (userData) {
            setIsLoading(false);
            router.push("/(tabs)/home");
            return;
          }

          // if the userData does not exist, get the user document from firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            await AsyncStorage.setItem("user", JSON.stringify(userData));
            setIsLoading(false);
            router.push("/(tabs)/home");
          } else {
            alert("User not found in system database :(");
            setIsLoading(false);
          }
        } catch (error) {
          alert("Oopp! An error occurred :(");
          setIsLoading(false);
        }
      } else {
        setUser(null);
        setIsLoading(false);
      }
      clearTimeout(timeout);
    });

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
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
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
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
    backgroundImage: "url(')",
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
