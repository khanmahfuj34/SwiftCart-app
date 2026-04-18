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
import { useAuth } from "../src/context/AuthContext";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  // Animations
  const logoAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const btnScale = useRef(new Animated.Value(1)).current;
  const googleScale = useRef(new Animated.Value(1)).current;
  const appleScale = useRef(new Animated.Value(1)).current;

  const emailScale = useRef(new Animated.Value(1)).current;
  const passScale = useRef(new Animated.Value(1)).current;
  const errorShake = useRef(new Animated.Value(0)).current;

  // Background Blob Animations
  const blob1Anim = useRef(new Animated.Value(0)).current;
  const blob2Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Screen Fade-in & Blob floating
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
            toValue: 20,
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
            toValue: -30,
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

  const isFormValid = email.length > 0 && password.length > 0;

  const onLoginPress = async () => {
    if (!isFormValid) {
      triggerShake();
      return;
    }
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch (error) {
      triggerShake();
      console.log("Login error:", error);
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
          {/* Colorful Gradient Background */}
          <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
            <LinearGradient
              colors={["#fdfcfb", "#e2f0eb", "#e9e6ff"]}
              style={StyleSheet.absoluteFillObject}
            />
          </View>

          {/* Floating Blobs for aesthetics */}
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
                <Text style={styles.logoEmoji}>🛍️</Text>
              </View>
              <Text style={styles.appName}>SwiftCart</Text>
              <Text style={styles.tagline}>Shop Smart. Live Better.</Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.formContainer,
                { opacity: fadeAnim, transform: [{ translateX: errorShake }] },
              ]}
            >
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
                  placeholder="Password"
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

              <TouchableOpacity style={styles.forgotPassBtn}>
                <Text style={styles.forgotPassText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPressIn={() => handleScaleIn(btnScale)}
                onPressOut={() => handleScaleOut(btnScale)}
                onPress={onLoginPress}
                disabled={
                  !isFormValid && password.length === 0 && email.length === 0
                } // Only disabled physically if empty, else shaky error handles it
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
                      <Text style={styles.loginButtonText}>SIGN IN 🛒</Text>
                    </LinearGradient>
                  ) : (
                    <View
                      style={[
                        styles.loginButtonGradient,
                        styles.loginButtonDisabled,
                      ]}
                    >
                      <Text style={styles.loginButtonDisabledText}>
                        SIGN IN
                      </Text>
                    </View>
                  )}
                </Animated.View>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Logins */}
              <View style={styles.socialContainer}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPressIn={() => handleScaleIn(googleScale)}
                  onPressOut={() => handleScaleOut(googleScale)}
                  style={styles.socialBtnBase}
                >
                  <Animated.View
                    style={[
                      styles.socialBtnLight,
                      { transform: [{ scale: googleScale }] },
                    ]}
                  >
                    <Ionicons name="logo-google" size={20} color="#db4437" />
                    <Text style={styles.socialBtnTextDark}>Google</Text>
                  </Animated.View>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPressIn={() => handleScaleIn(appleScale)}
                  onPressOut={() => handleScaleOut(appleScale)}
                  style={styles.socialBtnBase}
                >
                  <Animated.View
                    style={[
                      styles.socialBtnDark,
                      { transform: [{ scale: appleScale }] },
                    ]}
                  >
                    <Ionicons name="logo-apple" size={20} color="#fff" />
                    <Text style={styles.socialBtnTextLight}>Apple</Text>
                  </Animated.View>
                </TouchableOpacity>
              </View>

              {/* Bottom Text */}
              <View style={styles.bottomTextContainer}>
                <Text style={styles.bottomText}>New to SwiftCart? </Text>
                <TouchableOpacity onPress={() => router.push("/signup")}>
                  <Text style={styles.bottomTextHighlight}>
                    Create Account ✨
                  </Text>
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
    left: -width * 0.2,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: "rgba(233, 213, 255, 0.4)", // subtle lavender
  },
  blob2: {
    position: "absolute",
    bottom: -height * 0.05,
    right: -width * 0.3,
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: "rgba(167, 243, 208, 0.3)", // subtle mint
  },
  inner: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
    zIndex: 10,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0f766e",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.9)",
  },
  logoEmoji: {
    fontSize: 38,
  },
  appName: {
    fontSize: 34,
    fontWeight: "800",
    color: "#022c22",
    letterSpacing: 0.5,
    marginBottom: 6,
    textShadowColor: "rgba(0, 0, 0, 0.05)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 15,
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
    height: 64,
    borderRadius: 32,
    paddingHorizontal: 22,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.8)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  inputWrapperFocused: {
    borderColor: "#0f766e",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#0f766e",
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  inputEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
    fontWeight: "500",
  },
  eyeBtn: {
    padding: 10,
  },
  forgotPassBtn: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  forgotPassText: {
    fontSize: 14,
    color: "#065f46",
    fontWeight: "700",
  },
  loginButtonWrapper: {
    shadowColor: "#0369a1",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
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
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 35,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    color: "#374151",
    letterSpacing: 1,
    fontWeight: "700",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  socialBtnBase: {
    flex: 1,
  },
  socialBtnLight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    height: 58,
    borderRadius: 29,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    gap: 10,
  },
  socialBtnDark: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
    height: 58,
    borderRadius: 29,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    gap: 10,
  },
  socialBtnTextDark: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
  },
  socialBtnTextLight: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
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
