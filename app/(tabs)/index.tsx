import React from "react";
import { useRef } from "react";
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView, Animated } from "react-native";
import { useFocusEffect } from "expo-router";

import theme from "@/constants/theme";
import { Post } from "@/constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const [posts, setPosts] = React.useState<Post[]>([]); // store the posts

  // load the posts from the AsyncStorage
  const loadPosts = async () => {
    try {
      const travelPosts = await AsyncStorage.getItem("travelPosts"); // retrieve the uploaded posts, return null if not found, or an array of posts in JSON format
      
      const posts: Post[] = travelPosts ? JSON.parse(travelPosts) : []; // parse the JSON string to an array of posts

      setPosts(posts); // update the posts state
    } catch (error) {
      console.error("Failed to load the posts:", error);
    }
  }

  // load the posts when the component mounts
  useFocusEffect( // useFocusEffect is a hook from @react-navigation/native that runs when the screen is focused
    React.useCallback(() => {
      loadPosts(); // reload posts when screen is focused
    }, [])
  );

  // allow the header to collapse when scrolling
  // set up the reference to keep track of the scroll position
  const scrollOffsetY = useRef(new Animated.Value(0)).current; // intially, the scroll position is 0

  // interpolate the scroll position to change the header height
  const headerHeight = scrollOffsetY.interpolate({
    inputRange: [0, 100], // when the scrolling range from 0 to 100
    outputRange: [100, 50], // the header height changes from 100 to 50
    extrapolate: "clamp", // prevent the header height from going below 50 or above 100
  });

  // interpolate the scroll position to change the header opacity
  const headerOpacity = scrollOffsetY.interpolate({
    inputRange: [0, 80], // start fading out when the scrolling range from 0 to 80
    outputRange: [1, 0], // the header opacity changes from 1 to 0
    extrapolate: "clamp", // prevent the header opacity from going below 0 or above 1
  });

  const postObject = ({ item }: { item: Post }) => (
    <View style={styles.post}>
      <View style={styles.avatarContainer}>
        <Image style={styles.avatar} source={{ uri: item.avatar }} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <FlatList
          data={item.image}
          renderItem={({ item }) => (
            <Image style={styles.image} source={{ uri: item }} />
          )}
          keyExtractor={(item, index) => `${item}-${index}`} // uri-0, uri-1, ... to avoid duplicate keys
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 5 }}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
      {/* animated header */}
      {/* { height: headerHeight, opacity: headerOpacity } overwrites any conflicting properties. */}
      <Animated.View style={[styles.header, { height: headerHeight, opacity: headerOpacity }]}>
        <Text style={styles.title}>Roaming</Text>
      </Animated.View>
      <Animated.FlatList
        data={posts}
        renderItem={postObject}
        keyExtractor={(item) => item.pid}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={{ paddingTop: 40 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.background,
    zIndex: 10,
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 30,
    paddingHorizontal: 20,
    fontWeight: "bold",
    color: theme.titleColor,
    textAlignVertical: "center",
    fontFamily: theme.titleFont,
  },
  post: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#DCD7C910",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatarContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
  image: {
    width: 200,
    height: 250,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.primary,
  },
  description: {
    fontSize: 15,
    color: theme.textColor,
    lineHeight: 20,
    paddingTop: 3,
    paddingBottom: 8,
  },
});