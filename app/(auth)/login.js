import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { COLORS } from "../../src/constants/colors";
import { validateEmail } from "../../src/utils/validation";
import CustomInput from "../../src/components/ui/CustomInput";
import CustomButton from "../../src/components/ui/CustomButton";

/**
 * Login Screen
 * Modified to navigate to OTP verification after submission
 */
export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const handleEmailBlur = () => {
    setEmailTouched(true);
    if (email && !validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (emailTouched && emailError && validateEmail(text)) {
      setEmailError("");
    }
  };

  const handleContinue = async () => {
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
      const response = await fetch(
        "http://192.168.XXX.XXX:8082/api/auth/initiate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();
      console.log("DEBUG: Received message is ->", data.message); // ADD THIS

      if (response.ok) {
        // Use .trim() just in case there's a hidden space from the Java string
        if (data.message && data.message.trim() === "NEW_USER_OTP_SENT") {
          console.log("About to navigate...");
          router.push({
            pathname: "/(auth)/verify-otp",
            params: { email: email },
          });
        } else if (data.message === "LOGIN_SUCCESS") {
          console.log("JWT Token received for returning user");

          // Save the token immediately
          if (data.token) {
            await SecureStore.setItemAsync("userToken", data.token);
          }

          // Use replace so they can't "Go Back" to the login screen
          router.replace("/create-team");
        }
      } else {
        alert(data.error || "Authentication failed");
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Cannot connect to server. Check IP and Wi-Fi.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = email && password && !emailError;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Sign in to your Fantasy Premier League
        </Text>

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

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Don't have an account? We'll create one for you automatically.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 48,
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
    textAlign: "center",
    lineHeight: 20,
  },
});
