import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, FlatList, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";
import theme from "@/constants/theme";
import { Post, User } from "@/constants/types";
import { loadUser, loadPosts, savePosts } from "@/services/storage";

const MAX_IMAGE_COUNT = 10; // the maximum number of images that can be uploaded

export default function CreateScreen() {
  const router = useRouter();
  const captionInputRef = React.useRef<TextInput>(null); // reference to the caption input field

  const [user, setUser] = React.useState<User | null>(null); // store the user

  // load the posts when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const userData = await loadUser(); // retrieve the user
        const postsData = await loadPosts(); // retrieve the posts
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
  const [city, setCity] = React.useState<string | null>(null); // store the city name
  const [country, setCountry] = React.useState<string | null>(null); // store the country name

  const handlePost = async () => {
    // retrieve user information from AsyncStorage or other source
    const userJson = await AsyncStorage.getItem("user");
    const user: User = userJson ? JSON.parse(userJson) : null;

    if (!user) {
      Alert.alert("Error", "User not found. Please log in again.");
      return;
    }

    // create new post object
    const newPost: Post = {
      pid: Date.now().toString(),
      uid: user.uid,
      image: image ? image : [],
      description: caption ? caption.trim() : null,
      city: city ? city : "",
      country: country ? country : "",
      createdAt: new Date(),
    }

    await savePosts(newPost); // save the post to the AsyncStorage
    router.replace("/(tabs)"); // navigate to the Home screen
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
      quality: 1,
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
    const hasPermission = await requestPermission("location");
    if (!hasPermission) {
      Alert.alert("Permission Required", "Allow the app to access the location to get your current location!");
      return
    }

    // get the location object
    let location = await Location.getCurrentPositionAsync({});
    if (location) {
      const { coords } = location;
      const { latitude, longitude } = coords;

      // get the city and country names from the latitude and longitude
      let address = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (address.length > 0) {
        setCity(address[0].city);
        setCountry(address[0].country);
      }
    }
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
      quality: 1,
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
        setCity(null);
        setCountry(null);
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
          source={{ uri: user?.avatar }}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{user?.username}</Text>
        {(city && country) && (
          <Text style={styles.location}>{city}, {country}</Text>
        )}
        <TextInput
          ref={captionInputRef}
          placeholder="What's on your mind?"
          placeholderTextColor={theme.tertiary}
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
            <Ionicons name="images-outline" size={22} color={theme.tertiary}></Ionicons>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCamera}>
            <Ionicons name="camera-outline" size={26} color={theme.tertiary}></Ionicons>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLocation}>
            <Ionicons name="location-outline" size={23} color={theme.tertiary}></Ionicons>
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
          style={[styles.postButton, ((caption?.length ?? 0) > 0 || image != null) ? styles.postButtonActive : {}]}
          onPress={handlePost}
          disabled={(caption?.length ?? 0) === 0 && image == null}
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
    color: theme.tertiary,
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
  postContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 20,
    backgroundColor: theme.background,
  },
  postButton: {
    backgroundColor: theme.tertiary,
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