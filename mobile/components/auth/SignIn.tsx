import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet
} from "react-native";
import theme from "@/constants/theme";
import { signIn } from "@/services/auth";

interface SignInProps {
  isSignUp: boolean;
  switchMode: () => void;
}

export default function SignIn({ switchMode }: SignInProps) {
  // user info for data entry
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const result = await signIn({ email, password });
    if (!result.success && result.message) {
      setError(result.message); 
    }
  }

  return (
    <View style={styles.overlay}>
      {/* title */}
      <Text style={styles.formHeader}>Welcome back!</Text>

      <TextInput
        value={email.toLowerCase()}
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

      {/* display error message */}
      {error ?         
        <Text style={{ color: theme.warning_background, marginTop: -5, marginBottom: 15, marginLeft: 5 }}>{error}</Text>
        : null
      }
    
      {/* switch between sign up and sign in */}
      <TouchableOpacity onPress={switchMode} activeOpacity={0.9}>
        <Text style={styles.switchText}>
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} activeOpacity={0.9} onPress={() => handleSignIn()}>
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
    backgroundColor: theme.accent,
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
