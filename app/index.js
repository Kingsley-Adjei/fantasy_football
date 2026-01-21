import { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "../src/constants/colors";
import * as SecureStore from "expo-secure-store"; // 1. Add this import

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");

        setTimeout(() => {
          if (token) {
            router.replace("/(tabs)");
          } else {
            router.replace("/(auth)/login");
          }
        }, 2000);
      } catch (error) {
        console.error("Auth check failed", error);
        router.replace("/(auth)/login");
      }
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
