// Called in the MapView component

import React, { useRef } from "react";
import Carousel from "react-native-reanimated-carousel";
import { Modal, View, StyleSheet, TouchableWithoutFeedback, Animated, Image, Text } from "react-native";
import theme from "@/constants/theme";

interface PostProp {
  visible: boolean;
  location: string | null;
  createdAt: any;
  images: {url: string, public_id: string}[];
  onClose: () => void;
}
export default function PostPreviewModal({visible, location, createdAt, images, onClose}: PostProp) {
  const [isVisible, setIsVisible] = React.useState(false);
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const formattedDate = createdAt
  ? new Date(createdAt._seconds * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  : "Unknown Date"; // Fallback if missing

  const handleClose = () => {
    Animated.timing(modalOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  React.useEffect(() => {
    if (visible) {
      setIsVisible(true);
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      handleClose();
    }
  }, [visible]);

  return (
    <Modal 
      transparent={true} 
      animationType="none" 
      visible={isVisible}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[styles.overlay, { opacity: modalOpacity }]}>
          <TouchableWithoutFeedback>
            <View>
              <View style={styles.carouselContainer}>
                <Text style={{ color: theme.primary, marginBottom: 10 }}>
                  Swipe to see more images!
                </Text>
                <Carousel
                  loop={false}
                  width={300}
                  height={400}
                  autoPlay={false}
                  data={images}
                  scrollAnimationDuration={500}
                  renderItem={({ item }) => (
                    <Image
                      source={{ uri: item.url }}
                      style={{ width: "100%", height: "100%", borderRadius: 12 }}
                      resizeMode="cover"
                    />
                  )}
                />
                <Text style={{ color: theme.textColor, marginTop: 10, fontWeight: "bold" }}>
                  {location}
                </Text>
                <Text style={{ marginTop: 5, color: theme.textColor }}>
                  {formattedDate}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
  },
  carouselContainer: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});