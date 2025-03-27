import React, { useEffect, useRef, useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Animated, TextInput, PanResponder, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import theme from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import Constants from 'expo-constants';

const GEOAPIFY_API_KEY = Constants.expoConfig?.extra?.GEOAPIFY_API_KEY;

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
  onLocationSelect: (latitude: string, longitude: string, location: string) => void;
}
export default function LocationModal({ visible, onClose, onLocationSelect}: LocationModalProps) {
  // modal visibility state
  const [isVisible, setIsVisible] = useState(visible);

  // location search state
  const [query, setQuery] = useState("");
  interface LocationFeature {
    properties: {
      formatted: string; // e.g. "New York, USA"
      lat: number; 
      lon: number;
      city?: string;
      country?: string;
    };
  }
  
  const [result, setResult] = useState<LocationFeature[]>([]);

  // animation values
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(800)).current;

  // query useEffect
  useEffect(() => {
    if (query.length >= 2) {
      const fetchLocations = async () => {
        try {
          const response = await fetch(
            `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${GEOAPIFY_API_KEY}`
          ); // we use encodeURIComponent to encode the query string to be URL safe (e.g. replace spaces with %20)
          const data = await response.json();
          setResult(data.features);
        } catch (error) {
          console.log("Error fetching location search:", error);
        }
      };
      fetchLocations();
    }
  }, [query]);

  // animation effect
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

      // reset the query
      setQuery("");
      setResult([]);
    }
  }, [visible]);

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
      if (!location) return;

      const { coords } = location;
      const { latitude, longitude } = coords;

      // get the city and country names from the latitude and longitude
      let address = await Location.reverseGeocodeAsync({ latitude, longitude });
      const city = address[0].city || address[0].name || "";
      const country = address[0].country || "";

      // create a location string
      const locationString = city + ", " + country;

      // close the modal and pass the location data
      onLocationSelect(latitude.toString(), longitude.toString(), locationString);
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
      <TouchableWithoutFeedback>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          <Animated.View 
            style={[styles.modal, { transform: [{ translateY }] }]}
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
                value={query}
                onChangeText={setQuery}
              />
            </View>

            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
              keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
              >
                {/* current location */}
                <TouchableOpacity style={styles.currentLocation} activeOpacity={0.9} onPress={() => getCurrentLocation()}>
                  <Ionicons name="navigate" size={20} color={theme.textColor} />
                  <Text style={styles.currentLocationText}>Get my current location</Text>
                </TouchableOpacity>
                
                {/* search results */}
                {result.map((location, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.queryResult} 
                    activeOpacity={0.9} 
                    onPress={() => {
                      onLocationSelect(
                        location.properties.lat.toString(), 
                        location.properties.lon.toString(), 
                        location.properties.formatted.split(',')[0]
                      );
                      onClose();
                    }}
                  >
                    <Text style={styles.queryText}>{location.properties.formatted.split(',')[0]}</Text>
                    <Text numberOfLines={1} style={styles.querySubtext}>{location.properties.formatted.split(', ').slice(1).join(', ')}</Text>              
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </KeyboardAvoidingView>
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
  }, 
  queryResult: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 5,
  },
  queryText: {
    color: theme.textColor,
    fontSize: 15,
  },
  querySubtext: {
    color: theme.primary,
    fontSize: 13,
  }
});