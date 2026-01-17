import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { COLORS } from "../../src/constants/colors";
import OTPInput from "../../src/components/ui/OTPInput";
import CustomButton from "../../src/components/ui/CustomButton";

/**
 * OTP Verification Screen
 * Allows user to enter 6-digit code sent to their email
 *
 * Features:
 * - Auto-focus on mount
 * - Smooth animations
 * - Resend OTP functionality
 * - Timer countdown
 * - Error handling
 */
export default function VerifyOTPScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const [otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Animated values
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fade in animation on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  /**
   * Shake animation for errors
   */
  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  /**
   * Handles OTP completion (when 6 digits entered)
   */
  const handleOTPComplete = async (code) => {
    setLoading(true);
    setError(false);

    try {
      // TODO: Replace with actual API call
      // const response = await authService.verifyOTP(email, code);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate success/failure (remove this in production)
      const isValid = code === "123456"; // For demo purposes

      if (isValid) {
        // ✅ Success - Navigate to main app
        router.replace("/(tabs)");
      } else {
        // ❌ Error - Show error state
        setError(true);
        setOTP("");
        triggerShake();

        Alert.alert(
          "Invalid Code",
          "The code you entered is incorrect. Please try again.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setError(true);
      setOTP("");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles resend OTP
   */
  const handleResend = async () => {
    if (!canResend) return;

    try {
      // TODO: Replace with actual API call
      // await authService.resendOTP(email);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setResendTimer(60);
      setCanResend(false);
      setOTP("");

      Alert.alert(
        "Code Sent",
        "A new verification code has been sent to your email.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Resend error:", error);
    }
  };

  /**
   * Handles back navigation
   */
  const handleBack = () => {
    router.back();
  };

  // Format email for display (mask middle part)
  const maskedEmail = email ? email.replace(/(.{2})(.*)(@.*)/, "$1***$3") : "";

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          <Text style={styles.title}>Enter Verification Code</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit code to{"\n"}
            <Text style={styles.email}>{maskedEmail}</Text>
          </Text>
        </View>

        {/* OTP Input with shake animation */}
        <Animated.View
          style={[
            styles.otpContainer,
            {
              transform: [{ translateX: shakeAnimation }],
            },
          ]}
        >
          <OTPInput
            value={otp}
            onChangeText={setOTP}
            onComplete={handleOTPComplete}
            error={error}
          />
        </Animated.View>

        {/* Verify Button */}
        <CustomButton
          title="Verify Code"
          onPress={() => handleOTPComplete(otp)}
          loading={loading}
          disabled={otp.length !== 6 || loading}
        />

        {/* Resend Section */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          {canResend ? (
            <Pressable onPress={handleResend}>
              <Text style={styles.resendButton}>Resend Code</Text>
            </Pressable>
          ) : (
            <Text style={styles.timerText}>Resend in {resendTimer}s</Text>
          )}
        </View>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            💡 Tip: Check your spam folder if you don't see the email
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 48,
  },
  backButton: {
    marginBottom: 24,
    alignSelf: "flex-start",
  },
  backText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  email: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  otpContainer: {
    marginBottom: 32,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  resendText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  resendButton: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "700",
  },
  timerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  helpContainer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  helpText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
