import { api } from './api';
import { Post } from '@/constants/types';
import { UploadApiResponse } from "cloudinary-react-native/lib/typescript/src/api/upload/model/params/upload-params"
import { upload } from "cloudinary-react-native"
import { cld } from "@/config/cloudinary"

// fetch all posts of a user from the API
export const fetchUserPosts = async (userId: string): Promise<Post []> => {
  try {
    let response = await api.get(`/users/${userId}/posts`);

    if (response.data && Array.isArray(response.data.posts)) {
      return response.data.posts;
    } else {
      console.warn("Unexpected API response format:", response.data);
      return [];
    }
  } catch (error) {
    console.log("Error fetching user posts:", error);
    return [];
  }
}

// fetch all posts from the API
export const fetchAllPosts = async (): Promise<Post []> => {
  try {
    let response = await api.get("/posts");

    if (response.data && Array.isArray(response.data.posts)) {
      return response.data.posts;
    } else {
      console.warn("Unexpected API response format:", response.data);
      return [];
    }
  } catch (error) {
    console.log("Error fetching all posts:", error);
    return [];
  }
}

// create a new post
interface PostData {
  uid: string;
  image: string[];
  description: string;
  latitude: string;
  longitude: string;
  username: string;
  avatar: string;
  location: string;
}
const uploadImage = async (image: string) => {
  // check if there's an image to upload
  if (!image) {
    return;
  }

  // options for uploading the image
  const options = {
    upload_preset: "roaming-app",
    unsigned: true,
  }

  // upload the image to cloudinary
  // and return the response
  return new Promise<UploadApiResponse>(async (resolve, reject) =>{
    await upload(cld, {
      file: image,
      options: options,
      callback: (error: any, response: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      }
    })
  })
}
export const createPost = async ({ uid, image, description, latitude, longitude, username, avatar, location }: PostData) => {
  // upload the image to the cloud storage
  const cloudImage = [];
  for (const img of image) {
    const response = await uploadImage(img);
    if (response) {
      cloudImage.push({ url: response.secure_url, public_id: response.public_id });
    }
  }

  try {
    // send post request to backend
    let response = await api.post("/posts", {
      uid,
      image: cloudImage,
      description,
      latitude,
      longitude,
      username,
      avatar,
      location,
    });
    console.log(location);
    console.log(`Post ${response.data.pid} created successfully!`);
    return response.data; // Return API response
  } catch (error) {
    console.log("Error creating post:", error);
  }
};

// delete a post
export const deletePost = async (post: Post) => {
  // first we will delete all the image on cloudinary
  try {
    for (const img of post.image) {
      await api.delete(`/posts/images/${img.public_id}`);
    }
  } catch (error) {
    console.log("Error deleting images on Cloudinary:", error);
  }

  // then we will delete the post from the database
  try {
    let response = await api.delete(`/posts/${post.pid}`) ;
    console.log(`Post ${post.pid} deleted successfully!`);
    return response.status;
  } catch (error) {
    console.log("Error deleting post:", error);
  }
}