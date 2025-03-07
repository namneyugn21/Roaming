import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet
} from "react-native";
import theme from "@/constants/theme";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SignInProps {
  isSignUp: boolean;
  switchMode: () => void;
}

export default function SignIn({ switchMode }: SignInProps) {
  const router = useRouter();
  // user info for data entry
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // handle sign in
  const handleSignIn = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // try to get the user document
      const userDoc = await getDoc(doc(db, "users", user.uid));

      // if user document exists, store the user data in async storage and redirect to home
      if (userDoc.exists()) {
        const userData = userDoc.data();
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
      } else {
        alert("User not found");
      }
      router.push("/(tabs)/home");
    } catch (error) {
      alert("Invalid email or password");
    }
  }

  return (
    <View style={styles.overlay}>
      {/* title */}
      <Text style={styles.formHeader}>Welcome back!</Text>

      <TextInput
        value={email}
        placeholder="Email"
        placeholderTextColor={theme.primary}
        style={styles.input}
        autoFocus={true}
        onChangeText={setEmail}
      />

      <TextInput
        value={password}
        placeholder="Password"
        placeholderTextColor={theme.primary}
        secureTextEntry style={styles.input}
        onChangeText={setPassword}
      />

      {/* switch between sign up and sign in */}
      <TouchableOpacity onPress={switchMode}>
        <Text style={styles.switchText}>
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleSignIn()}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  formHeader: {
    fontSize: 35,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 25,
    color: theme.textColor,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: theme.primary,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 15,
    fontSize: 15,
    color: theme.textColor,
  },
  button: {
    backgroundColor: theme.background,
    opacity: 1,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginTop: 20,
  },
  buttonText: {
    color: theme.textColor,
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  switchText: {
    color: theme.textColor,
    fontSize: 14,
    textAlign: "right",
    marginTop: -5,
  },
});
