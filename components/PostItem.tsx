import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';

import { Post, User } from '@/constants/types';
import theme from '@/constants/theme';

// this is to ensure that the PostItem component receives the correct props
interface PostItemProps {
  item: Post;
  user: User | null;
}

const PostItem: React.FC<PostItemProps> = ({ item, user }) => {
  return (
    <View style={styles.post}>
      <View style={styles.avatarContainer}>
        <Image style={styles.avatar} source={{ uri: user?.avatar }} />
      </View>
      <View style={styles.infoContainer}>
        {/* display the name, location, and description */}
        <View style={{ flexDirection: "row", gap: 5, alignItems: "baseline", justifyContent: "space-between" }}>
          <Text style={styles.name}>{user?.username}</Text>
          <Text style={{ color: theme.titleColor }}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
        {(item.city && item.country) && (
          <Text style={styles.location}>
            {item.city}, {item.country}
          </Text>
        )}
        {item.description && (
          <Text style={styles.description}>{item.description}</Text>
        )}
        {(item.image && item.image.length > 0) && (
          <FlatList
            data={item.image}
            renderItem={({ item }) => (
              <Image style={styles.image} source={{ uri: item }} />
            )}
            keyExtractor={(item, index) => `${item}-${index}`} // uri-0, uri-1, ... to avoid duplicate keys
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 5 }}
          />
        )}
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
    flexDirection: "row",
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
    borderColor: theme.primary,
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
    color: theme.titleColor,
    marginTop: 2,
  },
});

export default PostItem;