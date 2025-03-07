import React from "react";
import { TouchableOpacity, Text, Image, View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import theme from "@/constants/theme";
import { useFocusEffect, useRouter } from "expo-router";
import { fetchCurrentUser } from "@/services/user";
import { Post, User } from "@/constants/types";
import PostItem from "@/components/PostItem";
import { auth } from "@/config/firebaseConfig";
import { fetchUserPosts } from "@/services/post";

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = React.useState<User>();
  const [posts, setPosts] = React.useState<Post[]>([]);

  // load the user and posts when the screen is loaded
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const userData = await fetchCurrentUser();
        const postsData = await fetchUserPosts();

        if (userData) {
          setUser(userData);
          // filter the posts by the user's id
          setPosts(postsData);
        }
      };
      fetchData();
    }, [])
  );

  // handle sign out
  const handleSignOut = async () => {
    try {
      // sign out from firebase and clear the AsyncStorage
      await auth.signOut();

      // redirect to the welcome screen
      router.replace("/");
    } catch (error) {
      alert("Failed to sign out. Please try again :(");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.name}>{user?.name}</Text>
        <View style={styles.subContainer}>
          <Image
            style={styles.avatar}
            source={{ uri: user?.avatar }}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.username}>{user?.username}</Text>
            <Text style={styles.bio}>{user?.bio}</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => { }}
              >
                <Text style={styles.actionButtonText}>Edit profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleSignOut()}
              >
                <Text style={styles.actionButtonText}>Sign out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* display the user's poss */}
        {user && posts?.map((post) => (
          <PostItem
            avatar={post.avatar}
            username={post.username}
            post={post}
            key={post.pid}
          />
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
    borderBottomWidth: 2,
    borderBottomColor: "#DCD7C910",
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
  actionButton: {
    backgroundColor: "transparent",
    borderRadius: 5,
    marginTop: 15,
    paddingVertical: 8,
    width: "48%",
    borderWidth: 1,
    borderColor: theme.accent,
  },
  actionButtonText: {
    color: theme.textColor,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
  },
});