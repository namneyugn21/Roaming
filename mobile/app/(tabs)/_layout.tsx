import { Tabs, useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import theme from "../../constants/theme";

export default function TabLayout() {
  const router = useRouter(); // get the navigation object

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: theme.secondary, // active tab color (white)
        tabBarInactiveTintColor: theme.primary,  // inactive tab color (gray)
        tabBarShowLabel: false, // hide the tab labels
        headerStyle: {
          backgroundColor: theme.background,
          shadowColor: theme.accent,
        },
        headerTintColor: "white",
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="home"
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
      {/* Search */}
      <Tabs.Screen
        name="search"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
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
          headerTitleStyle: { color: theme.textColor, fontWeight: "bold" },
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={"add-outline"}
              size={30}
              color={theme.background}
              style={{
                backgroundColor: focused ? theme.secondary : theme.primary,
                borderRadius: 10,
                width: 40,
                height: 35,
                paddingHorizontal: 5.5,
                paddingVertical: 2.5,
              }}
            />
          ),
          headerLeft: () => (
            router.canGoBack() ? ( // show back button only if there's a previous screen
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="close-outline" size={35} color={theme.primary} />
              </TouchableOpacity>
            ) : null
          ),
        }}
      />
      {/* Map Screen */}
      <Tabs.Screen
        name="map"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "map" : "map-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />
      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
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
    marginLeft: 10,
  },
});