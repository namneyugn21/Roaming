import React, { useEffect, useRef, useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Animated, TextInput, PanResponder, Alert } from "react-native";
import theme from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
  onLocationSelect: (latitude: string, longitude: string, city: string, country: string) => void;
}
export default function LocationModal({ visible, onClose, onLocationSelect}: LocationModalProps) {
  // modal visibility state
  const [isVisible, setIsVisible] = useState(visible);

  // location state: long and lat is pass back to send to the database, while city and country is for display
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  // animation values
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(800)).current;

  useEffect(() => {
    if (visible) {
      setIsVisible(true); // show the modal first

      // fade in the overlay
      Animated.timing(overlayOpacity, {
        toValue: 1, // fade in
        duration: theme.animationDuration,
        useNativeDriver: true,
      }).start();

      // smoothly animate modal up
      Animated.timing(translateY, {
        toValue: 0, // move up smoothly
        duration: theme.animationDuration,
        useNativeDriver: true,
      }).start();
    } else {
      // fade out the overlay
      Animated.timing(overlayOpacity, {
        toValue: 0, // fade out
        duration: theme.animationDuration,
        useNativeDriver: true,
      }).start();

      // smoothly animate modal down before hiding
      Animated.timing(translateY, {
        toValue: 800, // move down smoothly
        duration: theme.animationDuration,
        useNativeDriver: true,
      }).start(() => setIsVisible(false));
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },

      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150) { // improved sensitivity for swipe
          onClose();
        } else {
          Animated.timing(translateY, {
            toValue: 0,
            duration: theme.animationDuration,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (!isVisible) return null;

  // get current location
  const requestPermission = async () => {
    try {
      let permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status === "granted") {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("Error getting location permission:", error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      // ask for location permission
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        Alert.alert("Permission Required", "Allow the app to access the location to get your current location!");
        return
      }

      // get the location object
      let location = await Location.getCurrentPositionAsync({});
      if (location) {
        const { coords } = location;
        const { latitude, longitude } = coords;
        setLatitude(latitude.toString());
        setLongitude(longitude.toString());

        // get the city and country names from the latitude and longitude
        let address = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (address.length > 0) {
          setCity(address[0].city || "");
          setCountry(address[0].country || "");
        }
      };

      // close the modal and pass the location data
      onLocationSelect(latitude, longitude, city, country);
      onClose();
    } catch (error) {
      console.log("Error getting current location:", error);
    }
  }

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          <Animated.View 
            style={[styles.modal, { transform: [{ translateY }] }]}
            {...panResponder.panHandlers}
          >
            {/* close button */}
            <TouchableOpacity                   
              activeOpacity={0.9}
              style={{ position: "absolute", top: 20, right: 20, zIndex: 1000 }} 
              onPress={onClose}
            >
              <Ionicons name="close" size={35} color={theme.primary} />
            </TouchableOpacity>
            
            <Text style={styles.header}>Location</Text>
            
            {/* searchBar */}
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color={theme.textColor} />
              <TextInput 
                placeholder="Search for a location"
                style={styles.input}
                autoFocus={true}
                placeholderTextColor={theme.textColor}
              />
            </View>
            <TouchableOpacity style={styles.currentLocation} activeOpacity={0.9} onPress={() => getCurrentLocation()}>
              <Ionicons name="navigate" size={20} color={theme.textColor} />
              <Text style={styles.currentLocationText}>Get my current location</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000080",
  },
  modal: {
    width: "100%",
    height: "90%",
    backgroundColor: theme.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    position: "absolute",
    bottom: 0,
  },
  header: {
    fontSize: 35,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 25,
    color: theme.textColor,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.accent,
    backgroundColor: theme.accent,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  input: {
    flex: 1, 
    marginLeft: 10, 
    fontSize: 15, 
    color: theme.textColor
  },
  currentLocation: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
  },
  currentLocationText: {
    marginLeft: 10,
    color: theme.textColor,
    fontSize: 15,
  }
});