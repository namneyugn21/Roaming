import React, { useEffect, useRef, useState } from "react";
import {
  TouchableOpacity, Animated, StyleSheet, PanResponder, TouchableWithoutFeedback, Text, Alert
} from "react-native";
import theme from "@/constants/theme";
import { Post } from "@/constants/types";
import { deletePost } from "@/services/post";

interface EditModalProps {
  visible: boolean;
  onClose: () => void;
  post: Post;
  onUpdate: () => void;
}

export default function EditModal({ post, visible, onClose, onUpdate }: EditModalProps) {
  const translateY = useRef(new Animated.Value(800)).current; // start below the screen
  const overlayOpacity = useRef(new Animated.Value(0)).current; // start with no opacity
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    if (visible) {
      setIsVisible(true); // show the modal first

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
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150) { // improved sensitivity for swipe
          onClose();
        }
      },
    })
  ).current;

  if (!isVisible) return null;

  // handle delete post
  const handleDelete = () => {
    Alert.alert("Delete post", "Are you sure you want to delete this post?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          // delete post
          const response = await deletePost(post);
          if (response === 200) onUpdate(); // refresh the post
          onClose();
        },
      },
    ]);
  }

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <Animated.View
          style={[styles.formContainer, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
          <TouchableOpacity activeOpacity={0.9} style={styles.button} onPress={() => handleDelete()}>
            <Text style={styles.buttonText}>Delete post</Text> 
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute", // ensure it overlays everything
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)", // dim background
    justifyContent: "flex-end", // push modal to bottom
  },
  formContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
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
  button: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    fontSize: 18,
    padding: 15,
  },
  buttonText: {
    color: theme.warning_primary,
    fontSize: 15,
    textAlign: "center",
    fontWeight: "bold",
  }
});
