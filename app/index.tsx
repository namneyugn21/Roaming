import { View, Image, Text, StyleSheet, SafeAreaView, Button } from "react-native";
import { useRouter } from "expo-router";
import theme from "@/constants/theme";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={ styles.subContainer }>
        <Image 
          source={require("../assets/images/roaming-logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Roaming</Text>
      </View>
      <View style={styles.button}>
          <Button
            title="Get Started"
            onPress={() => router.replace("/(tabs)")} // navigate to the tabs screen
            color={theme.titleColor}
          />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  subContainer: {
    position: "absolute", // position absolutely to break normal layout flow
    top: "50%", // move it down by 50% of the screen height
    transform: [{ translateY: -60 }], // adjust centering
    alignItems: "center", // center content horizontally
    width: "100%", // take up the full width
  },
  title: {
    fontSize: 32,
    fontFamily: theme.titleFont,
    color: theme.titleColor,
    marginTop: -35,
  },
  logo: {
    paddingRight: 5,
    width: 150,
    height: 120,
  },
  button: {
    position: "absolute",
    bottom: 50,
    backgroundColor: theme.secondary,
    borderRadius: 50,
    width: 200,
    paddingVertical: 5,
  }
});