import { User } from "@/constants/types";
import { api } from "./api"

export const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    let response = await api.get("/users/me");
    return response.data;
  } catch (error) {
    console.log("Error fetching current user:", error);
    return null;
  }
}