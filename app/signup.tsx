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
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { useAuth } from "../src/context/AuthContext";

const { width, height } = Dimensions.get("window");

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const [confirmPassFocused, setConfirmPassFocused] = useState(false);

  // Animations
  const logoAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const btnScale = useRef(new Animated.Value(1)).current;
  const nameScale = useRef(new Animated.Value(1)).current;
  const emailScale = useRef(new Animated.Value(1)).current;
  const passScale = useRef(new Animated.Value(1)).current;
  const confirmPassScale = useRef(new Animated.Value(1)).current;
  const errorShake = useRef(new Animated.Value(0)).current;

  const blob1Anim = useRef(new Animated.Value(0)).current;
  const blob2Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoAnim, {
            toValue: -12,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(logoAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(blob1Anim, {
            toValue: -20,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(blob1Anim, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(blob2Anim, {
            toValue: 30,
            duration: 5000,
            useNativeDriver: true,
          }),
          Animated.timing(blob2Anim, {
            toValue: 0,
            duration: 5000,
            useNativeDriver: true,
          }),
        ]),
      ),
    ]).start();
  }, []);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(errorShake, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(errorShake, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(errorShake, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(errorShake, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleFocus = (setter, animRef) => {
    setter(true);
    Animated.spring(animRef, { toValue: 1.02, useNativeDriver: true }).start();
  };

  const handleBlur = (setter, animRef) => {
    setter(false);
    Animated.spring(animRef, { toValue: 1, useNativeDriver: true }).start();
  };

  const handleScaleIn = (animRef) => {
    Animated.spring(animRef, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handleScaleOut = (animRef) => {
    Animated.spring(animRef, { toValue: 1, useNativeDriver: true }).start();
  };

  const isFormValid =
    name.length > 0 &&
    email.length > 0 &&
    password.length > 5 &&
    password === confirmPassword;

  const onSignupPress = async () => {
    if (!isFormValid) {
      triggerShake();
      return;
    }
    try {
      await signup(email, password, name);
      router.replace("/(tabs)");
    } catch (e: any) {
      triggerShake();
      alert(e.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
            <LinearGradient
              colors={["#fdfcfb", "#e2f0eb", "#e9e6ff"]}
              style={StyleSheet.absoluteFillObject}
            />
          </View>
          <Animated.View
            pointerEvents="none"
            style={[styles.blob1, { transform: [{ translateY: blob1Anim }] }]}
          />
          <Animated.View
            pointerEvents="none"
            style={[styles.blob2, { transform: [{ translateX: blob2Anim }] }]}
          />

          <View pointerEvents="box-none" style={styles.inner}>
            <Animated.View
              style={[
                styles.headerContainer,
                { opacity: fadeAnim, transform: [{ translateY: logoAnim }] },
              ]}
            >
              <View style={styles.logoCircle}>
                <Text style={styles.logoEmoji}>✨</Text>
              </View>
              <Text style={styles.appName}>Create Account</Text>
              <Text style={styles.tagline}>Join SwiftCart today.</Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.formContainer,
                { opacity: fadeAnim, transform: [{ translateX: errorShake }] },
              ]}
            >
              {/* Name Input */}
              <Animated.View
                style={[
                  styles.inputWrapper,
                  nameFocused && styles.inputWrapperFocused,
                  { transform: [{ scale: nameScale }] },
                ]}
              >
                <Text style={styles.inputEmoji}>👤</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#6b7280"
                  value={name}
                  onChangeText={setName}
                  onFocus={() => handleFocus(setNameFocused, nameScale)}
                  onBlur={() => handleBlur(setNameFocused, nameScale)}
                />
              </Animated.View>

              {/* Email Input */}
              <Animated.View
                style={[
                  styles.inputWrapper,
                  emailFocused && styles.inputWrapperFocused,
                  { transform: [{ scale: emailScale }] },
                ]}
              >
                <Text style={styles.inputEmoji}>✉️</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#6b7280"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => handleFocus(setEmailFocused, emailScale)}
                  onBlur={() => handleBlur(setEmailFocused, emailScale)}
                />
              </Animated.View>

              {/* Password Input */}
              <Animated.View
                style={[
                  styles.inputWrapper,
                  passFocused && styles.inputWrapperFocused,
                  { transform: [{ scale: passScale }] },
                ]}
              >
                <Text style={styles.inputEmoji}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Password (min. 6 char)"
                  placeholderTextColor="#6b7280"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => handleFocus(setPassFocused, passScale)}
                  onBlur={() => handleBlur(setPassFocused, passScale)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#888"
                  />
                </TouchableOpacity>
              </Animated.View>

              {/* Confirm Password Input */}
              <Animated.View
                style={[
                  styles.inputWrapper,
                  confirmPassFocused && styles.inputWrapperFocused,
                  { transform: [{ scale: confirmPassScale }] },
                ]}
              >
                <Text style={styles.inputEmoji}>🛡️</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#6b7280"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  onFocus={() =>
                    handleFocus(setConfirmPassFocused, confirmPassScale)
                  }
                  onBlur={() =>
                    handleBlur(setConfirmPassFocused, confirmPassScale)
                  }
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeBtn}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-outline" : "eye-off-outline"
                    }
                    size={20}
                    color="#888"
                  />
                </TouchableOpacity>
              </Animated.View>

              <View style={styles.errorContainer}>
                {password.length > 0 &&
                  password !== confirmPassword &&
                  confirmPassword.length > 0 && (
                    <Text style={styles.errorText}>
                      Passwords do not match.
                    </Text>
                  )}
              </View>

              {/* Signup Button */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPressIn={() => handleScaleIn(btnScale)}
                onPressOut={() => handleScaleOut(btnScale)}
                onPress={onSignupPress}
              >
                <Animated.View
                  style={[
                    styles.loginButtonWrapper,
                    { transform: [{ scale: btnScale }] },
                  ]}
                >
                  {isFormValid ? (
                    <LinearGradient
                      colors={["#0f766e", "#0369a1"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.loginButtonGradient}
                    >
                      <Text style={styles.loginButtonText}>
                        CREATE ACCOUNT ✨
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View
                      style={[
                        styles.loginButtonGradient,
                        styles.loginButtonDisabled,
                      ]}
                    >
                      <Text style={styles.loginButtonDisabledText}>
                        CREATE ACCOUNT
                      </Text>
                    </View>
                  )}
                </Animated.View>
              </TouchableOpacity>

              <View style={styles.bottomTextContainer}>
                <Text style={styles.bottomText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/login")}>
                  <Text style={styles.bottomTextHighlight}>Sign In 🚀</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  blob1: {
    position: "absolute",
    top: -height * 0.1,
    right: -width * 0.2,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: "rgba(233, 213, 255, 0.4)",
  },
  blob2: {
    position: "absolute",
    bottom: -height * 0.05,
    left: -width * 0.3,
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: "rgba(167, 243, 208, 0.3)",
  },
  inner: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
    zIndex: 10,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 35,
  },
  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0f766e",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,1)",
  },
  logoEmoji: {
    fontSize: 34,
  },
  appName: {
    fontSize: 30,
    fontWeight: "800",
    color: "#022c22",
    letterSpacing: 0.5,
    marginBottom: 6,
    textShadowColor: "rgba(0, 0, 0, 0.05)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 14,
    color: "#0f172a",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  formContainer: {
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.65)",
    height: 60,
    borderRadius: 30,
    paddingHorizontal: 22,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.8)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  inputWrapperFocused: {
    borderColor: "#0f766e",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#0f766e",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  inputEmoji: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#000000",
    fontWeight: "600",
  },
  eyeBtn: {
    padding: 10,
  },
  errorContainer: {
    height: 20,
    marginBottom: 6,
    paddingHorizontal: 12,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    fontWeight: "700",
  },
  loginButtonWrapper: {
    shadowColor: "#0369a1",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    marginTop: 8,
  },
  loginButtonGradient: {
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonDisabled: {
    backgroundColor: "rgba(200, 210, 210, 0.8)",
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  loginButtonDisabledText: {
    color: "#f0f0f0",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 35,
  },
  bottomText: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "500",
  },
  bottomTextHighlight: {
    fontSize: 15,
    color: "#065f46",
    fontWeight: "800",
  },
});
