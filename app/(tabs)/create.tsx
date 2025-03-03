import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "@react-navigation/native";

import theme from "@/constants/theme";
import { Post } from "@/constants/types";

export default function CreateScreen() {
  const router = useRouter();
  const [caption, setCaption] = React.useState("");
  const [image, setImage] = React.useState<string[] | null>(null); // store the image uri

  {/* handle the post creation */}
  const handlePost = async () => {
    if (caption.trim().length === 0) return;

    // create new post object
    const newPost: Post = {
      pid: Date.now().toString(),
      avatar: "https://wallpapers.com/images/hd/caveman-cartoon-cute-cat-pfp-9fpmjcmi9v3vwy1w.jpg",
      name: "John Doe",
      image: image ? image : [], 
      description: caption.trim(),
    }

    // save the new post to the AsyncStorage
    try {
      const uploadedPosts = await AsyncStorage.getItem("travelPosts"); // retrieve the uploaded posts, return null if not found, or an array of posts in JSON format
      const posts: Post[] = uploadedPosts ? JSON.parse(uploadedPosts) : []; // parse the JSON string to an array of posts

      posts.unshift(newPost); // add the new post to the posts array at the beginning

      await AsyncStorage.setItem("travelPosts", JSON.stringify(posts)); // save the updated posts array to the AsyncStorage

      // clear the input field
      setCaption("");
      // navigate back to the home screen
      router.navigate("/(tabs)");
    } catch (error) {
      console.error("Failed to upload the post:", error);
    }
  };

  {/* open the image picker to select images */}
  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      aspect: [4, 5],
      allowsMultipleSelection: true,
      selectionLimit: 10,
      quality: 1,
      orderedSelection: true,
    });

    if (!result.canceled) {
      setImage(result.assets.map((asset) => asset.uri));
    }
  };

  {/* remove the image from the image state */}
  const handleRemoveImage = (uri: string) => {
    setImage((prevImages) => prevImages ? prevImages.filter((imageURI) => imageURI !== uri) : []);
    if (image && image.length === 1) {
      setImage(null);
    }
  }

  {/* clear the caption and image state when the screen is unfocused */}
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setCaption("");
        setImage(null);
      };
    }, [])
  );

  return (
    <View 
      style={styles.container}
    >
      {/* top screen component */}
      <View style={styles.avatarContainer}>
        <Image 
          style={styles.avatar} 
          source={{ uri: "https://wallpapers.com/images/hd/caveman-cartoon-cute-cat-pfp-9fpmjcmi9v3vwy1w.jpg" }} 
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>John Doe</Text>
        <TextInput
          placeholder="What's on your mind?"
          placeholderTextColor={theme.titleColor}
          multiline={true}
          autoFocus={true}
          style={styles.input}
          value={caption} // bind the caption state to the input value
          onChangeText={setCaption} // update the caption state when the input changes
        />
        {image && (
          <View style={styles.previewImageContainer}>
            <FlatList
              data={image}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
              renderItem={({ item }) => (
                <View style={{ position: "relative" }}>
                  {/* the preview image component */}
                  <Image style={styles.previewImage} source={{ uri: item }} />

                  {/* the close button to remove the image */}
                  <TouchableOpacity onPress={() => handleRemoveImage(item)} style={{ position: "absolute", top: 10, right: 10 }}>
                    <Ionicons name="close-circle" size={30} color={"#FFFFFF80"}></Ionicons>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item, index) => `${item}-${index}`}
              contentContainerStyle={{ gap: 5 }}
            />
          </View>
        )}
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleImagePicker}>
            <Ionicons name="images-outline" size={22} color={theme.titleColor}></Ionicons>
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="camera-outline" size={26} color={theme.titleColor}></Ionicons>
          </TouchableOpacity>          
          <TouchableOpacity>
            <Ionicons name="location-outline" size={23} color={theme.titleColor}></Ionicons>
          </TouchableOpacity>        
        </View>
      </View>

      {/* bottom screen component that is the post button */}
      <KeyboardAvoidingView
      style={styles.postContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={110}
      >
        <TouchableOpacity
          style={[styles.postButton, caption.length > 0 || image != null ? styles.postButtonActive : {}]}
          onPress={handlePost}
          disabled={caption.length === 0}
        >
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: theme.background,
    flex: 1,
  },
  avatarContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    width: 40,
  },
  infoContainer: {
    flexDirection: "column",
    flexShrink: 1,
    paddingLeft: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
    color: theme.textColor,
  },
  input: {
    fontSize: 15,
    color: theme.textColor,
  },
  actions: {
    flexDirection: "row",
    gap: 20,
    marginTop: 15,
    alignItems: "center",
  },
  postContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 20,
    backgroundColor: theme.background,
  },
  postButton: {
    backgroundColor: theme.titleColor,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignItems: "center",
  },
  postButtonActive: {
    backgroundColor: "white",
  },
  postButtonText: {
    color: theme.background,
    fontSize: 16,
    fontWeight: "bold",
  },
  previewImageContainer: {
    flexDirection: "row",
    height: 250,
    marginTop: 10,
  },
  previewImage: {
    width: 200,
    height: 250,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.primary,
  }
});