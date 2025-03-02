import React from "react";
import { useRef } from "react";
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView, Animated } from "react-native";
import theme from "@/constants/theme";

export default function HomeScreen() {
  // allow the header to collapse when scrolling
  // set up the reference to keep track of the scroll position
  const scrollOffsetY = useRef(new Animated.Value(0)).current; // intially, the scroll position is 0

  // interpolate the scroll position to change the header height
  const headerHeight = scrollOffsetY.interpolate({
    inputRange: [0, 100], // when the scrolling range from 0 to 100
    outputRange: [100, 50], // the header height changes from 100 to 50
    extrapolate: "clamp", // prevent the header height from going below 50 or above 100
  });

  // interpolate the scroll position to change the header opacity
  const headerOpacity = scrollOffsetY.interpolate({
    inputRange: [0, 80], // start fading out when the scrolling range from 0 to 80
    outputRange: [1, 0], // the header opacity changes from 1 to 0
    extrapolate: "clamp", // prevent the header opacity from going below 0 or above 1
  });

  // create each post object
  interface Post {
    pid: number;
    avatar: string;
    name: string;
    image: string[]; // array of image URLs
    description: string;
  }

  const postObject = ({ item }: { item: Post }) => (
    <View style={styles.post}>
      <View style={styles.avatarContainer}>
        <Image style={styles.avatar} source={{ uri: item.avatar }} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <FlatList
          data={item.image}
          renderItem={({ item }) => (
            <Image style={styles.image} source={{ uri: item }} />
          )}
          keyExtractor={(item, index) => `${item}-${index}`} // uri-0, uri-1, ... to avoid duplicate keys
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10 }}
        />
      </View>
    </View>
  );

  // create mock data
  const DATA: Post[] = [
    {
      pid: 1,
      avatar: "https://wallpapers.com/images/hd/caveman-cartoon-cute-cat-pfp-9fpmjcmi9v3vwy1w.jpg",
      name: "John Doe",
      image: [
        "https://i0.wp.com/theluxurytravelexpert.com/wp-content/uploads/2014/01/new-york-city-usa.jpg?ssl=1",
        "https://media.cntraveller.com/photos/64f4fc5f663208f83a21af16/16:9/w_2580,c_limit/New%20York%20City_GettyImages-1347979016.jpg",
        "https://i.pinimg.com/736x/89/e0/f3/89e0f3d73a1522e845c4cd2f283038a6.jpg",
        "https://images.unsplash.com/photo-1697645852743-533e7d3705a6?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bmV3JTIweW9yayUyMGFlc3RoZXRpY3xlbnwwfHwwfHx8MA%3D%3D",
      ],
      description: "Wandering through the streets of NYC, where every corner tells a story—sky-high dreams, yellow cabs, and endless energy!",
    },
    {
      pid: 2,
      avatar: "https://pics.craiyon.com/2023-10-11/3ffff0ccb64f41c9a85fbc0fe79bbc7e.webp",
      name: "Jane Doe",
      image: [
        "https://media.timeout.com/images/106148123/image.jpg",
      ],
      description: "Breathtaking mountain views meet vibrant city life—Vancouver is the perfect blend of nature and urban charm!",
    },
    {
      pid: 3,
      avatar: "https://i.pinimg.com/736x/8b/f3/e2/8bf3e286d71421d3e8f22e13aeddbdca.jpg",
      name: "Jim Doe",
      image: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/20190616154621%21Echo_Park_Lake_with_Downtown_Los_Angeles_Skyline.jpg/1200px-20190616154621%21Echo_Park_Lake_with_Downtown_Los_Angeles_Skyline.jpg",
      ],
      description: "Los Angeles is the city with the second biggest population in the United States after New York, overtaking Chicago in the 1970s",
    },
  ];

  return (
    <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
      {/* animated header */}
      {/* { height: headerHeight, opacity: headerOpacity } overwrites any conflicting properties. */}
      <Animated.View style={[styles.header, { height: headerHeight, opacity: headerOpacity }]}>
        <Text style={styles.title}>Roaming</Text>
      </Animated.View>
      <Animated.FlatList
        data={DATA}
        renderItem={postObject}
        keyExtractor={(item) => item.pid.toString()}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={{ paddingTop: 40 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.background,
    zIndex: 10,
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 30,
    paddingHorizontal: 20,
    fontWeight: "bold",
    color: theme.titleColor,
    textAlignVertical: "center",
    fontFamily: theme.titleFont,
  },
  post: {
    paddingHorizontal: 20,
    paddingVertical: 20,
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
    flexShrink: 1,
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
  },
  description: {
    fontSize: 15,
    color: theme.textColor,
    lineHeight: 20,
    paddingTop: 3,
    paddingBottom: 8,
  },
});