import React, { useEffect, useRef, useState } from "react";
import { 
  View, TouchableOpacity, Animated, StyleSheet, PanResponder
} from "react-native";
import theme from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import SignIn from "@/components/SignIn";
import SignUp from "@/components/SignUp";

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  isSignUp: boolean;
  switchMode: () => void;
}

export default function AuthModal({ visible, onClose, isSignUp, switchMode }: AuthModalProps) {
  const translateY = useRef(new Animated.Value(800)).current; // start below the screen
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    if (visible) {
      setIsVisible(true); // show the modal first
      Animated.timing(translateY, {
        toValue: 50, // move up smoothly
        duration: 300, 
        useNativeDriver: true,
      }).start();
    } else {
      // smoothly animate modal down before hiding
      Animated.timing(translateY, {
        toValue: 800, // Move back down
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsVisible(false)); // hide modal after animation completes
    }
  }, [visible]);

  // swipe down gesture to close modal
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150) { // improved sensitivity for swipe
          onClose();
        }
      },
    })
  ).current;

  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View 
        style={[styles.formContainer, { transform: [{ translateY }] }]} 
        {...panResponder.panHandlers}
      >
        {/* close button */}
        <TouchableOpacity style={{ position: "absolute", top: 15, right: 20 }} onPress={onClose}>
          <Ionicons name="close" size={30} color={"#f7ffff50"} />
        </TouchableOpacity>

        {/* render the sign in or sign up form */}
        {isSignUp ? (
          <SignUp switchMode={switchMode} isSignUp={isSignUp} />
        ) : (
          <SignIn switchMode={switchMode} isSignUp={isSignUp} />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "95%",
    backgroundColor: theme.secondary,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  formHeader: {
    fontSize: 35,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 25,
    color: "#f7ffff",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: theme.tertiary,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 10,
    fontSize: 15,
  },
  button: {
    backgroundColor: theme.tertiary,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginTop: 20,
  },
  buttonText: {
    color: theme.background,
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  switchText: {
    color: theme.textColor,
    fontSize: 14,
    textAlign: "right",
  },
});
