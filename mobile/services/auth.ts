import { api } from "./api"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebase";

interface SignUpProps {
  email: string;
  password: string;
  name: string;
  username: string;
  bio: string;
}
export const signUp = async ({ name, username, email, password, bio }: SignUpProps) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password); // create the user
    const user = userCredential.user; // get the user object
    const token = await user.getIdToken(); // get the user's auth token
    const uid = user.uid; // get the user's id

    let response = await api.post("/users/register", {
      uid,
      name,
      username,
      email,
      password,
      bio,
    });
    
    // fetch the user data and token from the response
    const { userData } = response.data;
    await AsyncStorage.setItem("user", JSON.stringify(userData));
    await AsyncStorage.setItem("token", token);

    router.push("/(tabs)/home");
  } catch (error) {
    console.log("Error signing up:", error);
  }
}

interface SignInProps {
  email: string;
  password: string;
}
export const signIn = async ({ email, password }: SignInProps): Promise<{ success: boolean, message?: string}> => {
  try {
    const userCredentiall = await signInWithEmailAndPassword(auth, email, password); // sign in the user
    const user = userCredentiall.user; // get the user object

    const token = await user.getIdToken(); // get the user's auth token
    await AsyncStorage.setItem("token", token); // store the token in async storage
    
    // send the token to the server to verify the user
    let reponse = await api.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("User signed in:", reponse.data);
    await AsyncStorage.setItem("user", JSON.stringify(reponse.data));
    router.push("/(tabs)/home");
    return { success: true };
  } catch (error) {
    console.log("Error signing in:", error);
    return { success: false, message: "Invalid email or password." };
  }
}