import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { COLORS } from "../constants/colors";
import { validateEmail } from "../utils/validation";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";

/**
 * Authentication Screen
 * Main screen for user login/signup with email and password
 *
 * Features:
 * - Email validation on blur
 * - Real-time error feedback
 * - Loading state during submission
 * - Auto-creates account if user doesn't exist
 *
 * @component
 */
const AuthScreen = () => {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  /**
   * Handles email validation when input loses focus
   * Only shows error if field has been touched
   */
  const handleEmailBlur = () => {
    setEmailTouched(true);
    if (email && !validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  /**
   * Handles email input changes
   * Clears error if email becomes valid
   */
  const handleEmailChange = (text) => {
    setEmail(text);
    // Clear error in real-time if email becomes valid
    if (emailTouched && emailError && validateEmail(text)) {
      setEmailError("");
    }
  };

  /**
   * Handles form submission
   * Validates form and calls authentication API
   */
  const handleContinue = async () => {
    // Final validation check
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      setEmailTouched(true);
      return;
    }

    if (!password) {
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with actual authentication API call
      // Example: await authService.signIn(email, password);

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Authentication successful:", { email });
      // Navigate to home screen or handle success
    } catch (error) {
      console.error("Authentication error:", error);
      // Handle error (show error message, etc.)
    } finally {
      setLoading(false);
    }
  };

  // Check if form is valid for button state
  const isFormValid = email && password && !emailError;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to your Fantasy Premier League
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            <CustomInput
              label="Email"
              value={email}
              onChangeText={handleEmailChange}
              placeholder="Enter your email"
              keyboardType="email-address"
              error={emailError}
              onBlur={handleEmailBlur}
            />

            <CustomInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />

            <CustomButton
              title="Continue"
              onPress={handleContinue}
              loading={loading}
              disabled={!isFormValid}
            />

            {/* Info Message */}
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                Don't have an account? We'll create one for you automatically.
              </Text>
            </View>
          </View>

          {/* Footer Section */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms & Privacy Policy
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  formContainer: {
    flex: 1,
  },
  infoContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    textAlign: "center",
  },
  footer: {
    marginTop: "auto",
    paddingTop: 24,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
});

export default AuthScreen;
