import { Tabs } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { Ionicons }  from '@expo/vector-icons';
import React from 'react';
import theme from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitle: "",
        headerLeft: () => (
          <Text style={{ color: "white", fontSize: 30, marginLeft: 20, fontFamily: theme.titleFont }}>Roaming</Text>
        ),
        headerStyle: { backgroundColor: theme.background, height: 100, borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 },
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "white", // active tab color (white)
        tabBarInactiveTintColor: "gray",  // inactive tab color (gray)
        tabBarShowLabel: false, // hide the tab labels
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
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
  }
});