import React, { useEffect, useRef, useState } from "react";
import {
  View, TouchableOpacity, Animated, StyleSheet, PanResponder, TouchableWithoutFeedback, Text, TextInput, Image, ScrollView, KeyboardAvoidingView, Platform
} from "react-native";
import theme from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { User } from "@/constants/types";

interface EditModalProps {
  visible: boolean;
  onClose: () => void;
  user: User;
}

export default function EditModal({ visible, onClose, user }: EditModalProps) {
  const translateY = useRef(new Animated.Value(800)).current; // start below the screen
  const [isVisible, setIsVisible] = useState(visible);

  // user input states
  const [username, setUsername] = useState(user.username);
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [bio, setBio] = useState(user.bio);

  useEffect(() => {
    if (visible) {
      setIsVisible(true); // show the modal first
      // reset the user input states
      setUsername(user.username);
      setName(user.name);
      setAvatar(user.avatar);
      setBio(user.bio);
      // smoothly animate modal up
      Animated.timing(translateY, {
        toValue: 0, // move up smoothly
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

          {/* form content */}
          <View style={{ flex: 1 }}>
            {/* title */}
            <Text style={styles.formHeader}>Edit profile</Text>

            <KeyboardAvoidingView 
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
              keyboardVerticalOffset={Platform.OS === "ios" ? 110 : 0}
            >
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <TouchableOpacity style={styles.avatar}>
                  <Image source={{ uri: avatar }} style={styles.avatar} />
                  <Ionicons name="camera" size={15} color={theme.primary} style={styles.editAvatar} />
                </TouchableOpacity>
                <TextInput
                  placeholder="Username"
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                />
                <TextInput
                  placeholder="Name"
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                />
                <TextInput
                  placeholder="Bio"
                  multiline
                  style={styles.bioInput}
                  value={bio || ""}
                  onChangeText={setBio}
                />
                <TouchableOpacity style={{ backgroundColor: theme.accent, padding: 15, borderRadius: 10 }}>
                  <Text style={{ color: theme.textColor, textAlign: "center", fontWeight: "bold" }}>Save changes</Text>
                </TouchableOpacity>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
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
  bioInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: theme.primary,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 15,
    color: theme.textColor,
    height: 100,
    textAlignVertical: "top",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 20,
  },
  editAvatar: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.accent,
    padding: 5,
    borderRadius: 15,
  },
});
