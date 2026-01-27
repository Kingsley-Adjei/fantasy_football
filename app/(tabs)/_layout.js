import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
// Note: If COLORS.primary isn't defined yet, I'll use the FPL Purple (#37003C)
const PRIMARY_COLOR = "#37003C";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#00FF85", // FPL Green for active
        tabBarInactiveTintColor: "gray",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F0F0F0",
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      {/* Hide the index if it exists but isn't used */}
      <Tabs.Screen name="index" options={{ href: null }} />

      <Tabs.Screen
        name="my-team"
        options={{
          title: "My Team",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shirt" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="leagues" // This matches your leagues.js file name
        options={{
          title: "Leagues",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="create-team"
        options={{
          title: "Setup",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen name="player-details" options={{ href: null }} />
    </Tabs>
  );
}
