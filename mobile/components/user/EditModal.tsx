import React, { useEffect, useRef, useState } from "react";
import {
  View, TouchableOpacity, Animated, StyleSheet, PanResponder, TouchableWithoutFeedback, Text, TextInput, Image, ScrollView, KeyboardAvoidingView, Platform,
  Alert,
  ActivityIndicator
} from "react-native";
import theme from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/constants/types";
import { updateCurrentUser } from "@/services/user";
import * as ImagePicker from "expo-image-picker";

interface EditModalProps {
  visible: boolean;
  onClose: () => void;
  user: User;
  onUpdate: (updatedUser: User) => void;
}

export default function EditModal({ visible, onClose, user, onUpdate }: EditModalProps) {
  const translateY = useRef(new Animated.Value(800)).current; // start below the screen
  const overlayOpacity = useRef(new Animated.Value(0)).current; // start with no opacity
  const [isVisible, setIsVisible] = useState(visible);
  const [isEditing, setIsEditing] = useState(false);

  // user input states
  const [username, setUsername] = useState(user.username);
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [bio, setBio] = useState(user.bio);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsVisible(true); // show the modal first
      
      // reset the user input states
      setUsername(user.username);
      setName(user.name);
      setAvatar(user.avatar);
      setBio(user.bio);

      // reset the editing state
      setIsEditing(false);

      // smoothly animate modal up
      Animated.timing(translateY, {
        toValue: 0, // move up smoothly
        duration: theme.animationDuration,
        useNativeDriver: true,
      }).start();

      // fade in the overlay
      Animated.timing(overlayOpacity, {
        toValue: 1, // fade in
        duration: theme.animationDuration,
        useNativeDriver: true,
      }).start();
    } else {
      setIsLoading(false); // show loading indicator
      // smoothly animate modal down before hiding
      Animated.timing(translateY, {
        toValue: 800, // Move back down
        duration: theme.animationDuration,
        useNativeDriver: true,
      }).start(() => setIsVisible(false)); // hide modal after animation completes

      // fade out the overlay
      Animated.timing(overlayOpacity, {
        toValue: 0, // fade out
        duration: theme.animationDuration,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // swipe down gesture to close modal
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },

      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150) { // improved sensitivity for swipe
          onClose();
        } else {
          Animated.timing(translateY, {
            toValue: 0,
            duration: theme.animationDuration,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (!isVisible) return null;

  // handle form submission
  const handleSave = async () => {
    setIsLoading(true); // show loading indicator
    // check if the current user pfp is hosted on Cloudinary
    const public_id = typeof user.avatar === "string" ? null : user.avatar.public_id; // null if not Cloudinary, otherwise we will pass the public_id for deletion

    const response = await updateCurrentUser({ 
      userId: user.uid,
      username, 
      name, 
      bio: bio || "", 
      avatar: typeof avatar === "string" ? avatar : avatar.url,
      public_id, // pass the public_id to delete the old avatar if it's hosted on Cloudinary
    });

    if (response) {
      const updatedUser = { ...user, username, name, bio, avatar };

      try {
        AsyncStorage.setItem("user", JSON.stringify(updatedUser)); // update the cached user
        onUpdate(updatedUser); // update the user in the parent component
        setIsLoading(false); // hide loading indicator
        onClose(); // close the modal
      } catch (error) {
        setIsLoading(false); // hide loading indicator
        console.error("Error updating AsyncStorage:", error);
      }
    }
  };

  // open image picker
  const handleImagePicker = async () => {
    // Define a helper function to request permissions
    const requestPermission = async () => {
      const status = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status;
    }
    
    const hasPermission = await requestPermission();
    
    if (!hasPermission) {
      Alert.alert("Permission Required", "Allow the app to access the images to select photos!");
      return;
    }

    let pfp = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      aspect: [1, 1],
      selectionLimit: 1,
      quality: 0.5,
      allowsEditing: true,
    });

    if (!pfp.canceled) {
      setAvatar(pfp.assets[0].uri);
      setIsEditing(true);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <Animated.View
          style={[styles.formContainer, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
          {/* close button */}
          <TouchableOpacity                   
            activeOpacity={0.9}
            style={{ position: "absolute", top: 20, right: 20, zIndex: 1000 }} 
            onPress={onClose}
          >
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
              <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity 
                  activeOpacity={0.9}
                  style={styles.avatar}  
                  onPress={handleImagePicker}
                >
                  <Image source={{ uri: typeof avatar === "string" ? avatar : avatar.url }} style={styles.avatar} />
                  <Ionicons name="camera" size={15} color={theme.primary} style={styles.editAvatar} />
                </TouchableOpacity>
                <TextInput
                  placeholder="Username"
                  style={styles.input}
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    setIsEditing(user.username !== text);
                  }}
                />
                <TextInput
                  placeholder="Name"
                  style={styles.input}
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    setIsEditing(user.name !== text);
                  }}
                />
                <TextInput
                  placeholder="Bio"
                  multiline
                  style={styles.bioInput}
                  value={bio || ""}
                  onChangeText={(text) => {
                    setBio(text);
                    setIsEditing(user.bio !== text);
                  }}
                />
                {isLoading ? (
                  <View style={{ backgroundColor: theme.accent, padding: 14, borderRadius: 10, opacity: 0.5 }}>
                    <ActivityIndicator size="small" color={theme.textColor} />
                  </View>
                )
                : (
                  <TouchableOpacity 
                    activeOpacity={0.9}
                    style={{ backgroundColor: theme.accent, padding: 15, borderRadius: 10, opacity: isEditing ? 1 : 0.5 }} 
                    onPress={() => handleSave() }
                    disabled={!isEditing}
                  >
                    <Text style={{ color: theme.textColor, textAlign: "center", fontWeight: "bold" }}>Save changes</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </Animated.View>
      </Animated.View>
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
