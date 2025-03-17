export interface User {
  uid: string; // user id
  avatar: string; // user avatar
  username: string; // username
  email: string; // email
  name: string; // name
  bio: string | null; // bio
  createdAt: any; // timestamp
}

export interface Post {
  pid: string;
  uid: string; // user id
  image: {url: string, public_id: string}[]; // image url and public id
  description: string | null;
  latitude: string | null;
  longitude: string | null;
  createdAt: any; // timestamp
  username: string; // username
  avatar: string; // user avatar
}