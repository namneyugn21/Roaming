import React from "react";
import { TouchableOpacity, Text, Image, View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import theme from "@/constants/theme";
import { useFocusEffect } from "expo-router";
import { loadUser, loadPosts } from "@/services/storage";
import { User, Post } from "@/constants/types";
import PostItem from "@/components/PostItem";

export default function ProfileScreen() {
  const [user, setUser] = React.useState<User | null>(null);
  const [posts, setPosts] = React.useState<Post[]>([]);

  // load the user and posts when the screen is loaded
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const userData = await loadUser();
        const postsData = await loadPosts();
        
        if (userData) {
          setUser(userData);
          // filter the posts by the user's id
          setPosts(postsData.filter((post) => post.uid === userData.uid));
        }
      };
      fetchData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
        <View style={styles.subContainer}>
          <Image
            style={styles.avatar}
            source={{ uri: user?.avatar }}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.username}>{user?.username}</Text>
            <Text style={styles.bio}>{user?.bio}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {}}
            >
              <Text style={styles.editButtonText}>Edit profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* display the user's posts */}
        {posts.map((post) => (
          <PostItem key={post.pid} item={post} user={user} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  subContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: theme.primary,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  infoContainer: {
    marginLeft: 15,
    flex: 1,
  },
  name: {
    fontSize: 25,
    color: theme.textColor,
    fontWeight: "bold",
    marginTop: 10,
    marginLeft: 15,
  },
  username: {
    fontSize: 15,
    color: theme.textColor,
    marginTop: 2,
    fontWeight: "bold",
  },
  bio: {
    fontSize: 15,
    color: theme.textColor,
    marginTop: 10,
    lineHeight: 20,
  },
  editButton: {
    backgroundColor: "transparent",
    borderRadius: 5,
    marginTop: 15,
    paddingVertical: 8,
    width: 150,
    borderWidth: 1,
    borderColor: theme.primary,
  },
  editButtonText: {
    color: theme.textColor,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
  },
});