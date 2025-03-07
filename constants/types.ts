import { FieldValue } from "firebase/firestore";

export interface User {
  uid: string; // user id
  avatar: string; // user avatar
  username: string; // username
  email: string; // email
  name: string; // name
  bio: string | null; // bio
}

export interface Post {
  pid: string;
  uid: string; // user id
  image: string[];
  description: string | null;
  city: string | null;
  country: string | null;
  createdAt: Date | FieldValue; // timestamp
  username: string; // username
  avatar: string; // user avatar
}