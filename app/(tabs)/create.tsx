import { Button, Text, TextInput, View, StyleSheet, SafeAreaView, Image } from "react-native";
import theme from "@/constants/theme";

export default function CreateScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image style={styles.avatar} source={{ uri: "https://wallpapers.com/images/hd/caveman-cartoon-cute-cat-pfp-9fpmjcmi9v3vwy1w.jpg" }} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>John Doe</Text>
        <TextInput
          placeholder="What's on your mind?"
          placeholderTextColor={theme.titleColor}
          multiline={true}
          autoFocus={true}
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: theme.background,
    flex: 1,
  },
  avatarContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
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
  input: {
    fontSize: 15,
    color: theme.textColor,
  }
});