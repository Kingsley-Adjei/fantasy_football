import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../src/constants/colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "gray",
        // This removes the white bar at the top of ALL screens
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F0F0F0",
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
          elevation: 0, // Removes shadow on Android
          shadowOpacity: 0, // Removes shadow on iOS
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      {/* 1. Setup Squad - Hidden from tab bar if you prefer, or kept as a start point */}
      <Tabs.Screen
        name="create-team"
        options={{
          title: "Setup",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="football" size={size} color={color} />
          ),
          // If you want to hide this tab completely once the team is made,
          // you can dynamically set href: null here later.
        }}
      />

      {/* 2. My Team - The Main Dashboard */}
      <Tabs.Screen
        name="my-team"
        options={{
          title: "My Team",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />

      {/* 3. Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />

      {/* 4. Player Details - Route accessible but no button in bottom bar */}
      <Tabs.Screen
        name="player-details"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
