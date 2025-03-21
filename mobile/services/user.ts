import { User } from "@/constants/types";
import { api } from "./api"
import { UploadApiResponse } from "cloudinary-react-native/lib/typescript/src/api/upload/model/params/upload-params";
import { upload } from "cloudinary-react-native";
import { cld } from "@/config/cloudinary";

export const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    let response = await api.get("/users/me");
    return response.data;
  } catch (error) {
    console.log("Error fetching current user:", error);
    return null;
  }
}

interface UpdateProps {
  userId: string,
  username: string;
  name: string;
  bio: string | "";
  avatar: string; // uri
  public_id: string | null;
}
const uploadAvatar = async (avatar: string) => {
  // check if there's an image to upload
  if (!avatar) {
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
      file: avatar,
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
export const updateCurrentUser = async ({ userId, username, name, bio, avatar, public_id }: UpdateProps) => {
  // delete the old avatar if it's hosted on Cloudinary
  if (public_id) {
    try {
      await api.delete(`/posts/images/${public_id}`);
    } catch (error) {
      console.log("Error deleting old avatar:", error);
      return null;
    }
  }

  // upload the new avatar to Cloudinary and get the url
  const reponse = await uploadAvatar(avatar);
  if (!reponse) {
    console.log("Error uploading new avatar");
    return null;
  } 

  try {
    let response = await api.put("/users/me", { 
      username,
      name,
      bio,
      avatar: {url: reponse.secure_url, public_id: reponse.public_id }, // new avatar
    });

    // update the user post's avatar
    await api.put(`/users/${userId}/posts`, { avatar: reponse.secure_url });

    console.log("User updated successfully!");
    return response.data;
  } catch (error) {
    console.log("Error updating user:", error);
    return null;
  }
}