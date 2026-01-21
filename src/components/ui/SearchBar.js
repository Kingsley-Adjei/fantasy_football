import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

/**
 * Search Bar Component
 * Search input with icon
 */
const SearchBar = ({
  value,
  onChangeText,
  placeholder = "Search players...",
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});

export default SearchBar;
