export interface Post {
  pid: string; // we will use the current timestamp as the post id
  avatar: string;
  name: string;
  image: string[];
  description: string;
}