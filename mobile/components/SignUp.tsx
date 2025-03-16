import React, { useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from "react-native";
import theme from "@/constants/theme";
import { Dimensions } from "react-native";
import { signUp } from "@/services/auth";

interface SignUpProps {
  isSignUp: boolean;
  switchMode: () => void;
}

const width = Dimensions.get("window").width; // get the screen width
const totalSteps = 3; // total steps for sign up

export default function SignUp({ switchMode }: SignUpProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const [steps, setSteps] = useState(0);

  // add user info for data entry
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");

  // button navigations
  const moveRight = () => {
    if (steps < totalSteps) {
      setSteps(steps + 1);
      Animated.timing(translateX, {
        toValue: -width * (steps + 1),
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const moveLeft = () => {
    if (steps > 0) {
      setSteps(steps - 1);
      Animated.timing(translateX, {
        toValue: -width * (steps - 1),
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={styles.overlay}>
      {/* title */}
      <Text style={styles.formHeader}>Let's get started</Text>

      <Animated.View style={[styles.formContainer, { transform: [{ translateX }] }]}>
        <View style={styles.stepsContainer}>
          <TextInput
            placeholder="Name"
            placeholderTextColor={theme.primary}
            style={styles.input}
            autoFocus={true}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Username"
            placeholderTextColor={theme.primary}
            style={styles.input}
            value={username.toLowerCase()}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.stepsContainer}>
          <TextInput
            placeholder="Email"
            placeholderTextColor={theme.primary}
            style={styles.input}
            value={email.toLowerCase()}
            onChangeText={setEmail}
            autoFocus={true}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor={theme.primary}
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.stepsContainer}>
          <TextInput
            placeholder="Add some quirkiness to your bio!"
            placeholderTextColor={theme.primary}
            style={styles.bioInput}
            multiline={true}
            value={bio}
            onChangeText={setBio}
            autoFocus={true}
          />
        </View>
      </Animated.View>

      {/* switch between sign up and sign in */}
      <TouchableOpacity onPress={switchMode}>
        <Text style={styles.switchText}>
          Already have an account? Sign In
        </Text>
      </TouchableOpacity>


      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity style={styles.navButton} onPress={moveLeft} disabled={steps === 0}>
          <Text style={styles.buttonText} >Back</Text>
        </TouchableOpacity>
        {(steps + 1) < totalSteps ? (
          <TouchableOpacity style={styles.navButton} onPress={moveRight}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.navButton} onPress={() => signUp({ name, username, email, password, bio })}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  formContainer: {
    flexDirection: "row",
    width: width * totalSteps,
  },
  stepsContainer: {
    width: width,
    height: "100%",
  },
  formHeader: {
    fontSize: 35,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 25,
    color: theme.textColor,
  },
  input: {
    width: width - 40, // subtract the padding (of the parent container) from the width
    borderWidth: 1,
    borderColor: theme.primary,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 15,
    fontSize: 15,
    color: theme.textColor,
  },
  bioInput: {
    width: width - 40, // subtract the padding (of the parent container) from the width
    borderWidth: 1,
    borderColor: theme.primary,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 15,
    fontSize: 15,
    height: 115,
    textAlignVertical: "top",
    color: theme.textColor,
  },
  button: {
    backgroundColor: theme.background,
    opacity: 0.8,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginTop: 20,
  },
  navButton: {
    backgroundColor: theme.background,
    opacity: 0.8,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginTop: 20,
    width: "48%",
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
