import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function CheckoutSuccessScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  const handleViewOrders = () => {
    router.push("/orders");
  };

  const handleContinueShopping = () => {
    router.push("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={80} color="#FFFFFF" />
          </View>

          <Text style={styles.successTitle}>Order Placed Successfully! 🎉</Text>
          <Text style={styles.successDesc}>
            Your order has been confirmed and will be delivered soon.
          </Text>

          <View style={styles.orderCard}>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Order ID</Text>
              <Text style={styles.orderId}>
                {orderId?.slice(0, 8).toUpperCase()}
              </Text>
            </View>
            <View style={[styles.orderRow, styles.orderRowBorder]}>
              <Text style={styles.orderLabel}>Status</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Pending</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="time" size={20} color="#1A1A1A" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Estimated Delivery</Text>
                <Text style={styles.infoValue}>3-5 business days</Text>
              </View>
            </View>
            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Ionicons name="mail" size={20} color="#1A1A1A" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Confirmation Email</Text>
                <Text style={styles.infoValue}>
                  Check your email for details
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleViewOrders}
          >
            <Ionicons name="bag" size={18} color="#FFFFFF" />
            <Text style={styles.primaryBtnText}>View Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={handleContinueShopping}
          >
            <Ionicons name="arrow-redo" size={18} color="#1A1A1A" />
            <Text style={styles.secondaryBtnText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FAF9F6" },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  successContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#48BB78",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#48BB78",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 10,
  },
  successDesc: {
    fontSize: 15,
    color: "#718096",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EDF2F7",
  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  orderRowBorder: {
    borderTopWidth: 1,
    borderTopColor: "#EDF2F7",
    paddingTop: 12,
    marginTop: 4,
  },
  orderLabel: {
    fontSize: 14,
    color: "#718096",
    fontWeight: "500",
  },
  orderId: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "monospace",
  },
  statusBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#92400E",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    borderWidth: 1,
    borderColor: "#EDF2F7",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  infoRowBorder: {
    borderTopWidth: 1,
    borderTopColor: "#EDF2F7",
    paddingTop: 12,
    marginTop: 4,
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: "#718096",
    fontWeight: "500",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  buttonsContainer: {
    gap: 12,
  },
  primaryBtn: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 10,
  },
  secondaryBtn: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#1A1A1A",
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginLeft: 10,
  },
});
