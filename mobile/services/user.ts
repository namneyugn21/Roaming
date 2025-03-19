import { User } from "@/constants/types";
import { api } from "./api"
import { Axios, AxiosResponse } from "axios";

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
  username: string;
  name: string;
  bio: string | "";
}
export const updateCurrentUser = async ({ username, name, bio }: UpdateProps) => {
  try {
    let response = await api.put("/users/me", { 
      username,
      name,
      bio
    });
    return response.data;
  } catch (error) {
    console.log("Error updating user:", error);
    return null;
  }
}