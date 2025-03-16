import { api } from './api';
import { Post } from '@/constants/types';
import { UploadApiResponse } from "cloudinary-react-native/lib/typescript/src/api/upload/model/params/upload-params"
import { upload } from "cloudinary-react-native"
import { cld } from "@/config/cloudinary"

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

interface PostData {
  uid: string;
  image: string[];
  description: string;
  latitude: string;
  longitude: string;
  username: string;
  avatar: string;
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

export const createPost = async ({ uid, image, description, latitude, longitude, username, avatar }: PostData) => {
  // upload the image to the cloud storage
  const imageURLs: string[] = [];
  for (const img of image) {
    const response = await uploadImage(img);
    if (response) {
      imageURLs.push(response.secure_url);
    }
  }

  try {
    // send post request to backend
    let response = await api.post("/posts", {
      uid,
      image: imageURLs, // Send Base64 images
      description,
      latitude,
      longitude,
      username,
      avatar,
    });

    console.log("Post created:", response.data);
    return response.data; // Return API response
  } catch (error) {
    console.log("Error creating post:", error);
  }
};