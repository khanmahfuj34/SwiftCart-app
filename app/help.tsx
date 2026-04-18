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

export default function HelpScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <View style={styles.card}>
          {[
            "How to track my order?",
            "How to change shipping address?",
            "Return Policy",
            "Refund process",
          ].map((q, i) => (
            <React.Fragment key={i}>
              <TouchableOpacity style={styles.item}>
                <Text style={styles.title}>{q}</Text>
                <Ionicons name="chevron-down" size={20} color="#CBD5E0" />
              </TouchableOpacity>
              {i < 3 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Contact Us</Text>
        <TouchableOpacity style={styles.contactBtn}>
          <Ionicons name="chatbubbles" size={24} color="#4A5568" />
          <View style={styles.contactDetails}>
            <Text style={styles.contactTitle}>Live Chat</Text>
            <Text style={styles.contactSubtitle}>
              Typically replies in 5 minutes
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactBtn}>
          <Ionicons name="mail" size={24} color="#4A5568" />
          <View style={styles.contactDetails}>
            <Text style={styles.contactTitle}>Email Support</Text>
            <Text style={styles.contactSubtitle}>support@swiftcart.com</Text>
          </View>
        </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#718096",
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
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
  title: { fontSize: 15, fontWeight: "500", color: "#1A1A1A" },
  divider: { height: 1, backgroundColor: "#EDF2F7" },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  contactDetails: { marginLeft: 16 },
  contactTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  contactSubtitle: { fontSize: 13, color: "#718096" },
});
