import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function NotificationsScreen() {
  const router = useRouter();
  const [toggles, setToggles] = React.useState({
    orders: true,
    promotions: false,
    app: true,
  });

  const toggleSwitch = (key: "orders" | "promotions" | "app") =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        <View style={styles.card}>
          <View style={styles.item}>
            <View>
              <Text style={styles.title}>Order Updates</Text>
              <Text style={styles.subtitle}>
                Get notified about your delivery status
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#CBD5E0", true: "#1A1A1A" }}
              thumbColor={"#FFF"}
              onValueChange={() => toggleSwitch("orders")}
              value={toggles.orders}
            />
          </View>
          <View style={styles.divider} />

          <View style={styles.item}>
            <View>
              <Text style={styles.title}>Promotions</Text>
              <Text style={styles.subtitle}>
                Sales, discounts, and exclusive offers
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#CBD5E0", true: "#1A1A1A" }}
              thumbColor={"#FFF"}
              onValueChange={() => toggleSwitch("promotions")}
              value={toggles.promotions}
            />
          </View>
          <View style={styles.divider} />

          <View style={styles.item}>
            <View>
              <Text style={styles.title}>App Notifications</Text>
              <Text style={styles.subtitle}>
                Updates features and account alerts
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#CBD5E0", true: "#1A1A1A" }}
              thumbColor={"#FFF"}
              onValueChange={() => toggleSwitch("app")}
              value={toggles.app}
            />
          </View>
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
    paddingVertical: 12,
  },
  divider: { height: 1, backgroundColor: "#EDF2F7", marginVertical: 4 },
  title: { fontSize: 16, fontWeight: "600", color: "#1A1A1A", marginBottom: 4 },
  subtitle: { fontSize: 12, color: "#718096", maxWidth: 220 },
});
