import React, { useEffect, useRef, useState } from "react";
import {
  View, TouchableOpacity, Animated, StyleSheet, PanResponder,
  TouchableWithoutFeedback
} from "react-native";
import theme from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import SignIn from "@/components/auth/SignIn";
import SignUp from "@/components/auth/SignUp";

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
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[styles.formContainer, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
          {/* close button */}
          <TouchableOpacity style={{ position: "absolute", top: 20, right: 20, zIndex: 1000 }} onPress={onClose}>
            <Ionicons name="close" size={35} color={theme.primary} />
          </TouchableOpacity>

          {/* render the sign in or sign up form */}
          {isSignUp ? (
            <SignUp switchMode={switchMode} isSignUp={isSignUp} />
          ) : (
            <SignIn switchMode={switchMode} isSignUp={isSignUp} />
          )}
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute", // ensure it overlays everything
    top: 0,
    left: 0,
    right: 0,
    bottom: 0, // covers full screen
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)", // dim background
    justifyContent: "flex-end", // push modal to bottom
  },
  formContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "90%",
    backgroundColor: theme.background,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  }
});
