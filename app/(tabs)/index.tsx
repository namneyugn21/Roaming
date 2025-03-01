import React from "react";
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView } from "react-native";
import theme from "@/constants/theme";

export default function HomeScreen() {
  // create each post object
  interface Post {
    avatar: string;
    name: string;
    image: string;
    description: string;
  }

  const postObject = ({ item }: { item: Post }) => (
    <View style={styles.post}>
      <View style={styles.info}>
        <Image style={styles.avatar} source={{ uri: item.avatar }} />
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <Image style={styles.image} source={{ uri: item.image }} />
    </View>
  );

  // create mock data
  const DATA: Post[] = [
    {
      avatar: "https://wallpapers.com/images/hd/caveman-cartoon-cute-cat-pfp-9fpmjcmi9v3vwy1w.jpg",
      name: "John Doe",
      image: "https://i0.wp.com/theluxurytravelexpert.com/wp-content/uploads/2014/01/new-york-city-usa.jpg?ssl=1",
      description: "Wandering through the streets of NYC, where every corner tells a story—sky-high dreams, yellow cabs, and endless energy!",
    },
    {
      avatar: "https://pics.craiyon.com/2023-10-11/3ffff0ccb64f41c9a85fbc0fe79bbc7e.webp",
      name: "Jane Doe",
      image: "https://media.timeout.com/images/106148123/image.jpg",
      description: "Breathtaking mountain views meet vibrant city life—Vancouver is the perfect blend of nature and urban charm!",
    },
    {
      avatar: "https://i.pinimg.com/736x/8b/f3/e2/8bf3e286d71421d3e8f22e13aeddbdca.jpg",
      name: "Jim Doe",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/20190616154621%21Echo_Park_Lake_with_Downtown_Los_Angeles_Skyline.jpg/1200px-20190616154621%21Echo_Park_Lake_with_Downtown_Los_Angeles_Skyline.jpg",
      description: "Los Angeles is the city with the second biggest population in the United States after New York, overtaking Chicago in the 1970s",
    },
  ];

  return (
    <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
      <FlatList
        data={DATA}
        renderItem={postObject}
        keyExtractor={(item) => item.name}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  post: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#DCD7C910",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    paddingLeft: 8,
    color: theme.textColor,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  description: {
    fontSize: 14,
    paddingVertical: 10,
    color: theme.textColor,
    lineHeight: 20,
  },
});