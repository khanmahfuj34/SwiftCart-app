import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.item}>
            <View style={styles.left}>
              <Ionicons name="key-outline" size={22} color="#1A1A1A" />
              <Text style={styles.title}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity style={styles.item}>
            <View style={styles.left}>
              <Ionicons
                name="document-text-outline"
                size={22}
                color="#1A1A1A"
              />
              <Text style={styles.title}>Data Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity style={styles.item}>
            <View style={styles.left}>
              <Ionicons name="trash-outline" size={22} color="#E53E3E" />
              <Text style={[styles.title, { color: "#E53E3E" }]}>
                Delete Account
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  list: { padding: 20 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  left: { flexDirection: "row", alignItems: "center" },
  divider: { height: 1, backgroundColor: "#EDF2F7", marginVertical: 4 },
  title: { fontSize: 16, fontWeight: "500", color: "#1A1A1A", marginLeft: 16 },
});
