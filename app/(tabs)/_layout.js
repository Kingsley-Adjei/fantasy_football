import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Built into Expo
import { COLORS } from "../../src/constants/colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopWidth: 1,
          borderTopColor: "#e5e5e5",
          height: 60,
          paddingBottom: 8,
        },
        headerShown: true,
      }}
    >
      {/* 1. Create Team - Only shown if user hasn't finished setup */}
      <Tabs.Screen
        name="create-team"
        options={{
          title: "Setup Squad",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="football" size={size} color={color} />
          ),
        }}
      />

      {/* 2. My Team - The main dashboard */}
      <Tabs.Screen
        name="my-team"
        options={{
          title: "My Team",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />

      {/* 3. Profile - Settings and Logout */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />

      {/* 4. Player Details - Hidden from the bottom bar */}
      <Tabs.Screen
        name="player-details"
        options={{
          href: null, // This hides the tab button while keeping the route accessible
          title: "Player Info",
        }}
      />
    </Tabs>
  );
}
