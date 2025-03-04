import { Tabs, useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons }  from '@expo/vector-icons';
import React from 'react';
import theme from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabLayout() {
  const router = useRouter(); // get the navigation object

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "white", // active tab color (white)
        tabBarInactiveTintColor: "gray",  // inactive tab color (gray)
        tabBarShowLabel: false, // hide the tab labels
        headerStyle: { 
          backgroundColor: theme.background,
          shadowColor: theme.titleColor,
        },
        headerTintColor: "white",
        headerLeft: () => (
          router.canGoBack() ? ( // show back button only if there's a previous screen
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="close-outline" size={35} color="white" />
            </TouchableOpacity>
          ) : null
        ),
        headerRight: () => {
          return <TouchableOpacity
            onPress={async () => {
              try {
                await AsyncStorage.clear(); // ✅ Clear storage properly
                router.replace("/"); // ✅ Navigate to Home screen
              } catch (error) {
                console.error("Failed to clear AsyncStorage:", error);
              }
            } }
            style={styles.backButton}
          >
            <Text style={{ paddingRight: 20, fontSize: 18, color: "white"}}>Clear</Text>
          </TouchableOpacity>;
        },
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={28} 
              color={color} 
            />
          ),
        }}
      />
      {/* Create Post */}
      <Tabs.Screen
        name="create"
        options={{
          title: "New post",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={"add-outline"} 
              size={30} 
              color={focused ? theme.primary : color}
              style={{
                backgroundColor: focused ? "white" : theme.primary,
                borderRadius: 10,
                width: 40,
                height: 35,
                paddingHorizontal: 5.5,
                paddingVertical: 2.5,
              }}
            />
          ),
        }}
      />
      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={28} 
              color={color} 
            />
          )
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.background,
    borderTopWidth: 0,
    height: 80,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    marginLeft: 15,
  },
});