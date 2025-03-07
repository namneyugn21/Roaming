import { auth } from "@/config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { router } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

// handle sign up
interface SignUpProps {
  email: string;
  password: string;
  name: string;
  username: string;
  bio: string;
}
export const signUp = async ({ email, password, name, username, bio }: SignUpProps) => {
  if (!email || !password || !name || !username) {
    alert("Please fill in all fields");
    return;
  }

  try {
    // create user in firebase authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user) {
      // create user entry in firestore
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: name,
          username: username,
          email: email,
          bio: bio,
          avatar: "https://miro.medium.com/v2/resize:fit:720/1*W35QUSvGpcLuxPo3SRTH4w.png",
        });
      } catch (error) {
        alert("An error occurred. Please try again :(");
        return;
      }

      // push the user data to async storage
      try {
        await AsyncStorage.setItem("user", JSON.stringify({
          name: name,
          username: username,
          email: email,
          bio: bio,
          avatar: "https://miro.medium.com/v2/resize:fit:720/1*W35QUSvGpcLuxPo3SRTH4w.png",
        }));
      } catch (error) {
        alert("An error occurred. Please try again :(");
        return;
      }

      router.push("/");
    }
  } catch (error) {
    console.error("Error signing up: ", error);
    alert("An error occurred. Please try again.");
  }
};

// handle sign in
interface SignInProps {
  email: string;
  password: string;
}
export const signIn = async ({ email, password }: SignInProps) => {
  if (!email || !password) {
    alert("Please fill in all fields");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // try to get the user document
    const userDoc = await getDoc(doc(db, "users", user.uid));

    // if user document exists, store the user data in async storage and redirect to home
    if (userDoc.exists()) {
      const userData = userDoc.data();
      await AsyncStorage.setItem("user", JSON.stringify(userData));
    } else {
      alert("User not found");
    }
    router.push("/(tabs)/home");
  } catch (error) {
    alert("Invalid email or password");
  }
}

// handle sign out
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
