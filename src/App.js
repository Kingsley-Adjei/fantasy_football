import React from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import AuthScreen from "./screens/AuthScreen";
import { COLORS } from "./constants/colors";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <AuthScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
