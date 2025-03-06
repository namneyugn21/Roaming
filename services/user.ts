import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/constants/types";
import { auth } from "@/config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

// retrieve the user from the AsyncStorage
// they are either exist or not
export const loadUser = async (): Promise<User | null> => {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      return {
        uid: user.uid,
        avatar: userData.avatar,
        username: userData.username,
        email: userData.email,
        name: userData.name,
        bio: userData.bio,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to load the user:", error);
  }
  return null;
};

// // save the user to the AsyncStorage
// export const saveUser = async (user: User) => {
//   try {
//     await AsyncStorage.setItem("user", JSON.stringify(user));
//   } catch (error) {
//     console.error("Failed to save the user:", error);
//   }
// }



