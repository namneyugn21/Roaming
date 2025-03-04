import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, Post } from "@/constants/types";

// retrieve the user from the AsyncStorage
// they are either exist or not
export const loadUser = async (): Promise<User | null> => {
  try {
    const user = await AsyncStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Failed to get the users:", error);
    return null;
  }
};

// retrieve all posts from the AsyncStorage 
export const loadPosts = async (): Promise<Post[]> => {
  try {
    const posts = await AsyncStorage.getItem("posts");
    return posts ? JSON.parse(posts) : [];
  } catch (error) {
    console.error("Failed to get the posts:", error);
    return [];
  }
};

// save the user to the AsyncStorage
export const saveUser = async (user: User) => {
  try {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Failed to save the user:", error);
  }
}

// save the posts to the AsyncStorage
export const savePosts = async (posts: Post) => {
  try {
    const existingPosts = await loadPosts(); // retrieve the existing posts
    const newPosts = [posts, ...existingPosts]; // add the new posts to the existing posts
    await AsyncStorage.setItem("posts", JSON.stringify(newPosts)); // save the updated posts
  } catch (error) {
    console.error("Failed to save the posts:", error);
  }
};

// clear the AsyncStorage
export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error("Failed to clear the AsyncStorage:", error);
  }
}