import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { COLORS } from "../constants/colors";

/**
 * Custom Button Component
 * A reusable button with loading and disabled states
 *
 * @component
 * @param {Object} props
 * @param {string} props.title - Button text
 * @param {function} props.onPress - Callback when button is pressed
 * @param {boolean} props.loading - Whether to show loading spinner
 * @param {boolean} props.disabled - Whether button is disabled
 */
const CustomButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, (disabled || loading) && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8} // Subtle press feedback
    >
      {loading ? (
        <ActivityIndicator color={COLORS.text} size="small" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    minHeight: 56, // Ensure consistent height
    // Subtle shadow for depth
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6, // Android shadow
  },
  buttonDisabled: {
    backgroundColor: COLORS.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    letterSpacing: 0.5,
  },
});

export default CustomButton;
