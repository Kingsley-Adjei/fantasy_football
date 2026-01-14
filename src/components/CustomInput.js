import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

/**
 * Custom Input Component
 * A reusable text input with label and error message support
 *
 * @component
 * @param {Object} props
 * @param {string} props.label - Label text displayed above input
 * @param {string} props.value - Current input value
 * @param {function} props.onChangeText - Callback when text changes
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.secureTextEntry - Whether to hide input (for passwords)
 * @param {string} props.error - Error message to display
 * @param {string} props.keyboardType - Keyboard type (default, email-address, etc.)
 * @param {string} props.autoCapitalize - Auto capitalization setting
 * @param {function} props.onBlur - Callback when input loses focus
 */
const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error = "",
  keyboardType = "default",
  autoCapitalize = "none",
  onBlur,
}) => {
  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Input Field */}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError, // Apply error styling if error exists
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        onBlur={onBlur}
      />

      {/* Error Message */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputError: {
    borderColor: COLORS.error, // Red border for errors
  },
  errorContainer: {
    marginTop: 6,
  },
  errorText: {
    fontSize: 13,
    color: COLORS.error,
    letterSpacing: 0.1,
  },
});

export default CustomInput;
