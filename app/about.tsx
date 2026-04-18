import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Ionicons name="bag" size={60} color="#FFFFFF" />
        </View>
        <Text style={styles.appName}>SWIFTCART</Text>
        <Text style={styles.version}>Version 1.0.0</Text>

        <Text style={styles.description}>
          SwiftCart is your premium destination for modern ecommerce shopping.
          Designed with elegance and simplicity in mind to provide you with the
          best experience.
        </Text>

        <Text style={styles.copyright}>
          © 2026 SwiftCart Inc. All rights reserved.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FAF9F6" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  backBtn: {
    padding: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1A1A1A" },
  content: { flex: 1, alignItems: "center", padding: 40, paddingTop: 60 },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  appName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: 2,
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
    color: "#718096",
    fontWeight: "600",
    marginBottom: 40,
  },
  description: {
    fontSize: 14,
    color: "#4A5568",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  copyright: {
    fontSize: 12,
    color: "#A0AEC0",
    position: "absolute",
    bottom: 40,
  },
});
