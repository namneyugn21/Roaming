import React from "react";
import { useRef } from "react";
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView, Animated } from "react-native";
import { useFocusEffect } from "expo-router";

import theme from "@/constants/theme";
import { Post, User } from "@/constants/types";
import { loadUser, loadPosts } from "@/services/storage";
import PostItem from "@/components/PostItem";

export default function HomeScreen() {
  const [posts, setPosts] = React.useState<Post[]>([]); // store the posts
  const [user, setUser] = React.useState<User | null>(null); // store the user

  // load the posts when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const userData = await loadUser(); // retrieve the user
        const postsData = await loadPosts(); // retrieve the posts
        setUser(userData);
        setPosts(postsData);
      };
      fetchData();
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

  return (
    <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
      {/* animated header */}
      {/* { height: headerHeight, opacity: headerOpacity } overwrites any conflicting properties. */}
      <Animated.View style={[styles.header, { height: headerHeight, opacity: headerOpacity }]}>
        <Text style={styles.title}>Roaming</Text>
      </Animated.View>
      <Animated.FlatList
        data={posts} // the data={posts} prop passes the posts array as input to renderPost, and each item from the posts array is passed as a parameter to renderPost through item in renderItem.
        renderItem={({ item }) => <PostItem key={item.pid} item={item} user={user} /> } // render the post item
        keyExtractor={(item) => item.pid}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={{ paddingTop: 40 }}
        showsVerticalScrollIndicator={false}
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
    paddingHorizontal: 15,
    fontWeight: "bold",
    color: theme.titleColor,
    textAlignVertical: "center",
    fontFamily: theme.titleFont,
  },
});