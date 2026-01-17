import React, { useRef, useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Pressable, Animated } from "react-native";
import { COLORS } from "../../constants/colors";

/**
 * OTP Input Component
 * A beautiful 6-digit OTP input with animations
 *
 * @component
 * @param {Object} props
 * @param {string} props.value - Current OTP value (6 digits)
 * @param {function} props.onChangeText - Callback when OTP changes
 * @param {function} props.onComplete - Callback when all 6 digits are entered
 * @param {boolean} props.error - Whether there's an error state
 */
const OTPInput = ({ value = "", onChangeText, onComplete, error = false }) => {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  // Animated values for each digit box
  const animatedValues = useRef(
    Array(6)
      .fill(0)
      .map(() => new Animated.Value(1))
  ).current;

  // Focus the input when component mounts
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // Trigger completion callback when 6 digits entered
  useEffect(() => {
    if (value.length === 6) {
      onComplete?.(value);
    }
  }, [value]);

  // Animate digit boxes when value changes
  useEffect(() => {
    if (value.length > 0) {
      const index = value.length - 1;
      // Scale animation for the newly filled digit
      Animated.sequence([
        Animated.spring(animatedValues[index], {
          toValue: 1.1,
          useNativeDriver: true,
          friction: 3,
        }),
        Animated.spring(animatedValues[index], {
          toValue: 1,
          useNativeDriver: true,
          friction: 3,
        }),
      ]).start();
    }
  }, [value]);

  const handleChangeText = (text) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, "");

    // Limit to 6 digits
    if (numericText.length <= 6) {
      onChangeText(numericText);
    }
  };

  const handleBoxPress = () => {
    inputRef.current?.focus();
  };

  // Render individual digit boxes
  const renderDigitBoxes = () => {
    return Array(6)
      .fill(0)
      .map((_, index) => {
        const digit = value[index] || "";
        const isActive = isFocused && index === value.length;
        const isFilled = digit !== "";

        return (
          <Pressable
            key={index}
            onPress={handleBoxPress}
            style={styles.digitBoxWrapper}
          >
            <Animated.View
              style={[
                styles.digitBox,
                isActive && styles.digitBoxActive,
                isFilled && styles.digitBoxFilled,
                error && styles.digitBoxError,
                {
                  transform: [{ scale: animatedValues[index] }],
                },
              ]}
            >
              <Animated.Text
                style={[styles.digitText, isFilled && styles.digitTextFilled]}
              >
                {digit}
              </Animated.Text>

              {/* Blinking cursor */}
              {isActive && <Animated.View style={styles.cursor} />}
            </Animated.View>
          </Pressable>
        );
      });
  };

  return (
    <View style={styles.container}>
      {/* Hidden input field */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChangeText}
        keyboardType="number-pad"
        maxLength={6}
        style={styles.hiddenInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
      />

      {/* Visible digit boxes */}
      <View style={styles.digitContainer}>{renderDigitBoxes()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    height: 0,
    width: 0,
  },
  digitContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  digitBoxWrapper: {
    flex: 1,
  },
  digitBox: {
    aspectRatio: 1,
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  digitBoxActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.card,
  },
  digitBoxFilled: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.primary,
  },
  digitBoxError: {
    borderColor: COLORS.error,
  },
  digitText: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  digitTextFilled: {
    color: COLORS.text,
  },
  cursor: {
    position: "absolute",
    width: 2,
    height: 24,
    backgroundColor: COLORS.primary,
  },
});

export default OTPInput;
