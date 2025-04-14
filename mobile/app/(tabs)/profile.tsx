import React, { useEffect } from "react";
import { TouchableOpacity, Text, Image, View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import theme from "@/constants/theme";
import { useFocusEffect, useRouter } from "expo-router";
import { fetchCurrentUser } from "@/services/user";
import { Post, User } from "@/constants/types";
import PostItem from "@/components/post/PostItem";
import { auth } from "@/config/firebase";
import { fetchUserPosts } from "@/services/post";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EditModal from "@/components/user/EditModal";
import EditPostModal from "@/components/post/ActionModal";

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = React.useState<User>();
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [postModalVisible, setPostModalVisible] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);

  // refresh when the user deletes a post or updates their profile
  useEffect(() => {
    if (refresh) {
      const fetchData = async () => {
        if (!user) return;

        const postsData = await fetchUserPosts(user?.uid); // retrieve the posts
        if (postsData) {
          setPosts(postsData);
        }
      };
      fetchData();
      setRefresh(false);
    }
  }, [refresh, user]);
  
  // load the user and posts when the screen is loaded
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const cachedUser = await AsyncStorage.getItem("user"); // get the user from async storage if available
        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
        }

        const userData = await fetchCurrentUser(); // fetch the user data
        if (userData) {
          setUser(userData);
          await AsyncStorage.setItem("user", JSON.stringify(userData)); // update the cached user if applicable
          const userPosts = await fetchUserPosts(userData.uid); // fetch the user posts
          setPosts(userPosts);
        }
      };
      fetchData();
      setPostModalVisible(false);
      setModalVisible(false);
    }, [])
  );

  // handle sign out
  const handleSignOut = async () => {
    try {
      // sign out from firebase and clear the AsyncStorage
      await auth.signOut();
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");

      // redirect to the welcome screen
      console.log("Signed out successfully! Goodbye :)");
      router.replace("/");
    } catch (error) {
      alert("Failed to sign out. Please try again :(");
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.name}>{user?.name}</Text>
          <View style={styles.subContainer}>
            <Image
              style={styles.avatar}
              source={{ uri: typeof user?.avatar === "string" ? user.avatar : user?.avatar?.url }}
            />
            <View style={styles.infoContainer}>
              <Text style={styles.username}>{user?.username}</Text>
              <Text style={styles.bio}>{user?.bio}</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.actionButton}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.actionButtonText}>Edit profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
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
              avatar={typeof post.avatar === "string" ? post.avatar : post.avatar.url}
              username={post.username}
              post={post}
              key={post.pid}
              onEditPress={(post) => {
                setSelectedPost(post)
                setPostModalVisible(true)
              }}
            />
          ))}
        </ScrollView>
        {/* edit Modal */}
        {user && (
          <EditModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            user={user}
            onUpdate={(updatedUser) => setUser(updatedUser)} // update the user in the parent component
          />
        )}
      </SafeAreaView>
      {selectedPost &&
        <EditPostModal
          post={selectedPost}
          visible={postModalVisible}
          onClose={() => setPostModalVisible(false)}
          onUpdate={() => setRefresh(true)}
        >
        </EditPostModal>
      }
    </>
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
    marginTop: 5,
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