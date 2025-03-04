export interface Post {
  pid: string; // we will use the current timestamp as the post id
  avatar: string;
  name: string;
  image: string[] | null;
  description: string | null;
  city: string | null;
  country: string | null;
}