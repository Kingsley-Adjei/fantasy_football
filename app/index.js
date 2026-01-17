import { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "../src/constants/colors";

/**
 * Entry Point / Splash Screen
 * Checks auth status and redirects
 */
export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      // TODO: Replace with actual auth check
      const isAuthenticated = false;

      // Simulate loading
      setTimeout(() => {
        if (isAuthenticated) {
          router.replace("/(tabs)");
        } else {
          router.replace("/(auth)/login");
        }
      }, 2000);
    };

    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚽ Fantasy FPL</Text>
      <ActivityIndicator
        size="large"
        color={COLORS.primary}
        style={styles.loader}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 24,
  },
  loader: {
    marginTop: 16,
  },
});
