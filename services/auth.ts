import { auth } from "@/config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user; // get the user from the userCredential
    await AsyncStorage.setItem("user", JSON.stringify(user)); // save the user to the AsyncStorage
    console.log("Signed up successfully:", user);
    return user;
  } catch (error) {
    console.error("Failed to sign up:", error);
    throw error;
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user; // get the user from the userCredential
    await AsyncStorage.setItem("user", JSON.stringify(user)); // save the user to the AsyncStorage
    console.log("Signed in successfully:", user);
    return user;
  } catch (error) {
    console.error("Failed to sign in:", error);
    throw error;
  }
}

export const signOutUser = async () => {
  try {
    await signOut(auth);
    await AsyncStorage.removeItem("user"); // remove the user from the AsyncStorage
    console.log("Signed out successfully");
  } catch (error) {
    console.error("Failed to sign out:", error);
    throw error;
  }
}
