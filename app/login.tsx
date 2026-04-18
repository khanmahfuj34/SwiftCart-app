import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { BorderRadius, Colors, Shadows, Spacing } from "../constants/theme";
import { PremiumButton, PremiumInput, useToast } from "../src/components/ui";
import { useAuth } from "../src/context/AuthContext";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const { show: showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!email.includes("@")) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      triggerShake();
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      showToast("✅ Login Successful", {
        message: "Welcome back to SwiftCart",
        type: "success",
        duration: 2000,
      });
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 500);
    } catch (error: any) {
      showToast("❌ Login Failed", {
        message: error.message || "Invalid credentials. Please try again.",
        type: "error",
        duration: 3000,
      });
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={["#FFFFFF", Colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={28} color={Colors.accent} />
            </TouchableOpacity>
            <View />
          </View>

          {/* Logo Section */}
          <Animated.View
            style={[
              styles.logoSection,
              {
                opacity: logoAnim,
                transform: [
                  {
                    scale: logoAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="bag-check" size={48} color={Colors.accent} />
            </View>
            <Text style={styles.brandName}>SwiftCart</Text>
          </Animated.View>

          {/* Form Section */}
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateX: shakeAnim }],
              },
            ]}
          >
            <Text style={styles.formTitle}>Welcome Back</Text>
            <Text style={styles.formSubtitle}>
              Sign in to your account to continue shopping
            </Text>

            {/* Email Input */}
            <PremiumInput
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              keyboardType="email-address"
              icon="mail"
              error={errors.email}
              required
              style={{ marginTop: Spacing.xl }}
            />

            {/* Password Input */}
            <PremiumInput
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password)
                  setErrors({ ...errors, password: undefined });
              }}
              secureTextEntry
              icon="lock-closed"
              error={errors.password}
              required
            />

            {/* Forgot Password Link */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <PremiumButton
              title={isLoading ? "Signing in..." : "Sign In"}
              onPress={handleLogin}
              isLoading={isLoading}
              disabled={isLoading}
              variant="primary"
              size="lg"
              fullWidth
              style={{ marginTop: Spacing.xl }}
            />

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={20} color={Colors.accent} />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-apple" size={20} color={Colors.accent} />
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/signup")}>
                <Text style={styles.signupLink}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing["2xl"],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  logoSection: {
    alignItems: "center",
    marginVertical: Spacing["2xl"],
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.lg,
    marginBottom: Spacing.lg,
  },
  brandName: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.accent,
    letterSpacing: 0.5,
  },
  formContainer: {
    paddingHorizontal: Spacing.xl,
    marginVertical: Spacing.lg,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.accent,
    marginBottom: Spacing.sm,
  },
  formSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: Spacing["2xl"],
    lineHeight: 20,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: Colors.accent,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing["2xl"],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontSize: 12,
    color: Colors.muted,
    fontWeight: "600",
  },
  socialContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing["2xl"],
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.lighter,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.accent,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.xl,
  },
  signupText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: "400",
  },
  signupLink: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: "700",
  },
});
