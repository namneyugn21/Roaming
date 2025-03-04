export interface User {
  uid: string; // user id
  avatar: string; // user avatar
  username: string; // username
  firstName: string; // first name
  lastName: string; // last name
  bio: string | null; // bio
}

export interface Post {
  pid: string; // we will use the current timestamp as the post id
  uid: string; // user id
  image: string[] | null;
  description: string | null;
  city: string | null;
  country: string | null;
  createdAt: Date; // timestamp
}