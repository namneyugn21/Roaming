import React, { useEffect } from "react";
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, FlatList, Alert, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";
import theme from "../../constants/theme";
import { User } from "@/constants/types";
import { fetchCurrentUser } from "@/services/user";
import { createPost } from "@/services/post";
import LocationModal from "@/components/post/SearchLocationModal";

const MAX_IMAGE_COUNT = 10; // the maximum number of images that can be uploaded

export default function CreateScreen() {
  const router = useRouter();
  const captionInputRef = React.useRef<TextInput>(null); // reference to the caption input field
  const [isLoading, setIsLoading] = React.useState(false); // loading state
  const [user, setUser] = React.useState<User | null>(null); // store the user

  // load the user when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const userData = await fetchCurrentUser(); // retrieve the user
        setUser(userData);
      };
      fetchData();
    }, [])
  );

  // Handle the permission
  const requestPermission = async (type: "images" | "camera" | "location") => {
    let permission;
    switch (type) {
      case "images":
        permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        break;
      case "camera":
        permission = await ImagePicker.requestCameraPermissionsAsync();
        break;
      case "location":
        permission = await Location.requestForegroundPermissionsAsync();
        break;
      default:
        permission = { status: "denied" };
    }
    return permission.status === "granted";
  }

  // Caption
  const [caption, setCaption] = React.useState<string | null>(null);

  // Image state
  const [image, setImage] = React.useState<string[] | null>(null); // store the image uri

  // Location state
  const [toggleLocation, setToggleLocation] = React.useState<boolean>(false); // toggle the location
  const [latitude, setLatitude] = React.useState<string | null>(null); // store the latitude
  const [longitude, setLongitude] = React.useState<string | null>(null); // store the longitude
  const [location, setLocation] = React.useState<string | null>(null); // store the location

  const handlePost = async () => {
    setIsLoading(true); // set the loading state to true
    // retrieve user information 
    const user = await fetchCurrentUser();
    if (!user) {
      Alert.alert("User not found", "Please login to post!");
      setIsLoading(false); // set the loading state to false
      return;
    }

    // create new post object
    try {
      await createPost({ // pass the post "raw" gathered data to the createPost function in services/post.tsx
        uid: user.uid,
        image: image || [],
        description: caption || "",
        latitude: latitude || "",
        longitude: longitude || "",
        username: user.username,
        avatar: typeof user.avatar === "string" ? user.avatar : user.avatar.url,
        location: location || "",
      });
      router.replace("/(tabs)/home"); // navigate to the Home screen
    } catch (error) {
      console.error("Failed to create post:", error);
      setIsLoading(false); // set the loading state to false
      Alert.alert("Failed to create post", "Please try again later!");
    }
  };

  {/* open the image picker to select images */ }
  const handleImagePicker = async () => {
    const hasPermission = await requestPermission("images");
    if (!hasPermission) {
      Alert.alert("Permission Required", "Allow the app to access the images to select photos!");
      return;
    }

    if (image && image.length >= MAX_IMAGE_COUNT) {
      Alert.alert("Maximum Images", `You can only upload up to ${MAX_IMAGE_COUNT} images!`);
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      aspect: [4, 5],
      allowsMultipleSelection: true,
      selectionLimit: 10,
      quality: 0,
      orderedSelection: true,
    });

    if (!result.canceled) {
      if (image && image.length > 0) {
        if (image.length + result.assets.length > MAX_IMAGE_COUNT) {
          // only fill the remaining slots
          const remainingSlots = MAX_IMAGE_COUNT - image.length;
          image.unshift(...result.assets.slice(0, remainingSlots).map((asset) => asset.uri));
        } else {
          image.unshift(...result.assets.map((asset) => asset.uri));
        }
      } else {
        setImage(result.assets.map((asset) => asset.uri));
      }
    }
  };

  {/* remove the image from the image state */ }
  const handleRemoveImage = (uri: string) => {
    setImage((prevImages) => prevImages ? prevImages.filter((imageURI) => imageURI !== uri) : []);
    if (image && image.length === 1) {
      setImage(null);
    }
  }

  {/* handle the location */ }
  const handleLocation = async () => {
    setToggleLocation(true);
  }
  
  const promptLocation = async () => {
    Alert.alert("Remove location", "Do you want to remove the location?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          setLatitude(null);
          setLongitude(null);
          setLocation(null);
        },
      },
    ]);
  }

  {/* open the camera */ }
  const handleCamera = async () => {
    const hasPermission = await requestPermission("camera");
    if (!hasPermission) {
      Alert.alert("Permission Required", "Allow the app to access the camera to take cute photos!");
      return;
    }

    if (image && image.length >= MAX_IMAGE_COUNT) {
      Alert.alert("Maximum Images", `You can only upload up to ${MAX_IMAGE_COUNT} images!`);
      return;
    }

    // open the camera
    let photo = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      aspect: [4, 5],
      quality: 0,
    });

    if (!photo.canceled) {
      if (image && image.length > 0) {
        image.unshift(photo.assets[0].uri);
      } else {
        setImage((prev) => [...(prev || []), photo.assets[0].uri]);
      }
    }
    // focus the caption input field
    setTimeout(() => {
      captionInputRef.current?.focus();
    }, 100);
  }

  {/* clear the states when the screen is unfocused */ }
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setCaption("");
        setImage(null);
        setLatitude(null);
        setLongitude(null);
        setLocation(null);
        setToggleLocation(false);
        setIsLoading(false);
      };
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView>
          {/* top screen component */}
          <View style={styles.topContainer}>
            <View style={styles.avatarContainer}>
              <Image
                style={styles.avatar}
                source={{ uri: typeof user?.avatar === "string" ? user.avatar : user?.avatar?.url }}
              />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{user?.username}</Text>
              {(location) && (
                <TouchableOpacity onPress={() => promptLocation()} activeOpacity={0.9}>
                  <Text numberOfLines={1} style={styles.location}>{location}</Text>
                </TouchableOpacity>
              )}
              <TextInput
                ref={captionInputRef}
                placeholder="What's on your mind?"
                placeholderTextColor={theme.primary}
                multiline={true}
                autoFocus={true}
                style={styles.input}
                value={caption || ""} // bind the caption state to the input value
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
                        <TouchableOpacity 
                          onPress={() => handleRemoveImage(item)} 
                          style={{ position: "absolute", top: 10, right: 10 }}
                          activeOpacity={0.9}
                        >
                          <Ionicons name="close-circle" size={30} color={theme.primary}></Ionicons>
                        </TouchableOpacity>
                      </View>
                    )}
                    keyExtractor={(item, index) => `${item}-${index}`}
                    contentContainerStyle={{ gap: 5 }}
                  />
                </View>
              )}
              <View style={styles.actions}>
                <TouchableOpacity onPress={handleImagePicker} activeOpacity={0.9}>
                  <Ionicons name="images-outline" size={22} color={theme.primary}></Ionicons>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCamera} activeOpacity={0.9}>
                  <Ionicons name="camera-outline" size={26} color={theme.primary}></Ionicons>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLocation} activeOpacity={0.9}>
                  <Ionicons name="location-outline" size={23} color={theme.primary}></Ionicons>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* bottom screen component that is the post button */}
        <View style={styles.bottomContainer}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={styles.messageText}>Share at least one image!</Text>
          </View>
          {isLoading ? (
            <View
              style={styles.postButton}
            >
              <ActivityIndicator size="small" color={theme.background} />
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.postButton, (image != null) ? styles.postButtonActive : {}]}
              onPress={handlePost}
              activeOpacity={0.9}
              disabled={image == null}
            >
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          )}
        </View>
        <LocationModal visible={toggleLocation} onClose={() => setToggleLocation(false)} onLocationSelect={(latitude, longitude, location) => { setLatitude(latitude); setLongitude(longitude); setLocation(location) }} />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: "row",
    padding: 15,
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
  location: {
    fontSize: 13,
    color: theme.primary,
    marginTop: 2,
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
  bottomContainer: {
    padding: 20,
    backgroundColor: theme.background,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  messageText: {
    color: theme.primary,
    fontSize: 15,
  },
  postButton: {
    backgroundColor: theme.accent,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignItems: "center",
  },
  postButtonActive: {
    backgroundColor: theme.secondary,
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
    borderColor: theme.accent,
  },
});
