import { auth } from "@/config/firebaseConfig"
import { db } from "@/config/firebaseConfig"
import { Post } from "@/constants/types";
import { query, where, collection, getDocs, addDoc, serverTimestamp, Timestamp, orderBy, FieldValue } from "firebase/firestore"

// fetch the user's post 
export const fetchUserPosts = async () => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.warn("User not logged in");
      return [];
    }

    // Query Snapshots: /Documentation
    // A query snapshot captures a data query at a moment in time. 
    // The data in the snapshot will remain fixed even if the original source dataset is updated until/unless it is refreshed manually or automatically. Create a Query Snapshot.
    const postsQuery = query(collection(db, "posts"), where("uid", "==", userId), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(postsQuery);

    // Map the posts
    const posts = querySnapshot.docs.map((doc) => {
      const postData = doc.data();
      return {
        pid: doc.id,
        city: postData.city,
        country: postData.country,
        description: postData.description,
        image: Array.isArray(postData.image) ? postData.image : [postData.image], // Ensure image is an array
        uid: postData.uid,
        createdAt: postData.createdAt instanceof Timestamp
          ? postData.createdAt.toDate()
          : new Date(), // convert Firestore Timestamp to JS Date
        username: postData.username,
        avatar: postData.avatar
      };
    });
    return posts;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
};

// fetch all posts
export const fetchAllPosts = async () => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.warn("User not logged in");
      return [];
    }

    // query all posts and order them by createdAt in descending order
    const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(postsQuery);

    const posts = querySnapshot.docs.map((doc) => {
      const postData = doc.data();
      return {
        pid: doc.id,
        city: postData.city,
        country: postData.country,
        description: postData.description,
        image: Array.isArray(postData.image) ? postData.image : [postData.image],
        uid: postData.uid,
        createdAt: postData.createdAt instanceof Timestamp
          ? postData.createdAt.toDate()
          : new Date(),
        username: postData.username,
        avatar: postData.avatar
      };
    });
    return posts;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
};

// post a new post
interface PostData {
  uid: string;
  image: string[];
  description: string;
  city: string;
  country: string;
  createdAt: Date | FieldValue;
  username: string;
  avatar: string;
}

export const createPost = async ({ uid, image, description, city, country, createdAt, username, avatar }: PostData) => {
  // fetch the current user
  const user = auth.currentUser;
  if (!user) {
    alert("You need to sign in to post!");
    return;
  }

  try {
    await addDoc(collection(db, "posts"), {
      uid: uid,
      image: image,
      description: description,
      city: city,
      country: country,
      createdAt: createdAt,
      username: username,
      avatar: avatar
    });
  } catch (error) {
    console.error("Failed to create post:", error);
  }
}