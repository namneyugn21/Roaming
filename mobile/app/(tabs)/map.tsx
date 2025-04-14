import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import theme from "@/constants/theme";
import * as Location from "expo-location";
import MapView from "@/components/map/MapView";
import { fetchUserPosts } from "@/services/post";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchCurrentUser } from "@/services/user";
import { useFocusEffect } from "expo-router";
import { Post } from "@/constants/types";
import PostPreviewModal from "@/components/post/PostPreviewModal";


export default function MapScreen() {
  const [location, setLocation] = useState<{ lat: string; lng: string } | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  {/* handle the location */ }
  // get current location
  const requestPermission = async () => {
    try {
      let permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status === "granted") {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("Error getting location permission:", error);
    }
  };
  const getCurrentLocation = async () => {
    try {
      // ask for location permission
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        Alert.alert("Permission Required", "Allow the app to access the location to get your current location!");
        return
      }

      // get the location object
      let location = await Location.getCurrentPositionAsync({});
      if (!location) return;

      const { coords } = location;
      const { latitude, longitude } = coords;

      setLocation({ lat: latitude.toString(), lng: longitude.toString() });
    } catch (error) {
      console.log("Error getting current location:", error);
    }
  }

  {/* handle the post modal */ }
  const handlePostModal = async (pid: string) => {
    // get the current user id
    const selectedPost = posts.find((post) => post.pid === pid);
    if (!selectedPost) return;

    setSelectedPost(selectedPost);
    setPostModalVisible(true);
  }

  const handleClosePostModal = () => {
    setPostModalVisible(false);
    setSelectedPost(null);
  }

  {/* handle the map */ }
  useFocusEffect(
    React.useCallback(() => {
      getCurrentLocation();
      
      // get the current user id
      const fetchUserData = async () => {
        const user = await fetchCurrentUser();
        if (!user) { console.log("Error getting user id"); return; }

        // get the user posts
        const posts = await fetchUserPosts(user.uid);
        if (!posts) { console.log("Error getting user posts"); return; }

        setPosts(posts);
      };
      fetchUserData();
    }, [])
  );

  if (!location) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <MapView latitude={location.lat} longitude={location.lng} posts={posts} postClicked={(pid: string) => handlePostModal(pid)} />
      {postModalVisible && selectedPost && (
        <PostPreviewModal
          visible={postModalVisible}
          location={selectedPost.location}
          createdAt={selectedPost.createdAt}
          images={selectedPost.image}
          onClose={handleClosePostModal}
        />
      )}
    </View>
  );
}
