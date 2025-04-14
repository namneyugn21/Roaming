import React, { useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Post } from '@/constants/types';
import theme from '@/constants/theme';
import * as Location from "expo-location";
import { Ionicons } from '@expo/vector-icons';
import { fetchCurrentUser } from '@/services/user';
import Constants from 'expo-constants';

// this is to ensure that the PostItem component receives the correct props
interface PostItemProps {
  avatar: string;
  username: string;
  post: Post;
  onEditPress?: (post: Post) => void;
}

const PostItem: React.FC<PostItemProps> = ({ avatar, username, post, onEditPress }) => {
  const [currentUser, setCurrentUser] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await fetchCurrentUser();
      setCurrentUser(currentUser?.username || null);
    };
    fetchUser();
  }, []);
  
  const formattedDate = post.createdAt
  ? new Date(post.createdAt._seconds * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  : "Unknown Date"; // Fallback if missing

  return (
    <View style={styles.post}>
      <View style={styles.avatarContainer}>
        <Image style={styles.avatar} source={{ uri: avatar }} />
        <View style={{ width: 2, height: "100%", backgroundColor: theme.accent, flex: 1 }}></View>
      </View>
      <View style={styles.infoContainer}>
        {/* display the name, location, and description */}
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center", justifyContent: "space-between" }}>
          <Text style={styles.name}>{username}</Text>
          {post.username === currentUser && (
            <TouchableOpacity onPress={() => onEditPress && onEditPress(post)} activeOpacity={0.9}>
              <Ionicons name="ellipsis-horizontal" size={20} color={theme.textColor} />
            </TouchableOpacity>
          )}
        </View>
        {(post.location) && (
          <Text style={styles.location}>
            {post.location}
          </Text> 
        )}
        {post.description && (
          <Text style={styles.description}>{post.description}</Text>
        )}
        {(post.image && post.image.length > 0) && (
          <FlatList
            data={post.image}
            renderItem={({ item }) => (
              <Image style={styles.image} source={{ uri: item.url }} />
            )}
            keyExtractor={(item, index) => `${item}-${index}`} // uri-0, uri-1, ... to avoid duplicate keys
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 5 }}
          />
        )}
        <Text style={{ color: theme.primary, paddingTop: 10 }}>{formattedDate}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  post: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#DCD7C910",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatarContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: 40,
  },
  infoContainer: {
    flexDirection: "column",
    flex: 1,
    paddingLeft: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
    color: theme.textColor,
  },
  image: {
    width: 200,
    height: 250,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.accent,
    marginTop: 10,
  },
  description: {
    fontSize: 15,
    color: theme.textColor,
    lineHeight: 20,
    marginTop: 3,
  },
  location: {
    fontSize: 13,
    color: theme.primary,
    marginTop: 2,
  },
});

export default PostItem;