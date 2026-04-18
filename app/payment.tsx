import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function PaymentScreen() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState("card_1");

  const methods = [
    {
      id: "card_1",
      type: "Credit Card",
      name: "Mastercard",
      detail: "**** 4022",
      expiry: "12/26",
      icon: "card",
    },
    {
      id: "bkash",
      type: "Mobile Banking",
      name: "bKash",
      detail: "+880 171* *** **1",
      icon: "phone-portrait",
    },
    {
      id: "nagad",
      type: "Mobile Banking",
      name: "Nagad",
      detail: "+880 191* *** **2",
      icon: "phone-portrait",
    },
    {
      id: "rocket",
      type: "Mobile Banking",
      name: "Rocket",
      detail: "+880 181* *** **3",
      icon: "phone-portrait",
    },
    {
      id: "upay",
      type: "Mobile Banking",
      name: "Upay",
      detail: "+880 161* *** **4",
      icon: "phone-portrait",
    },
    {
      id: "cod",
      type: "Cash on Delivery",
      name: "Pay with Cash",
      detail: "Pay when receiving the order",
      icon: "cash",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {methods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.card,
              selectedMethod === method.id && styles.cardSelected,
            ]}
            onPress={() => setSelectedMethod(method.id)}
          >
            <View
              style={[
                styles.iconWrapper,
                selectedMethod === method.id && styles.iconWrapperSelected,
              ]}
            >
              <Ionicons
                name={method.icon}
                size={24}
                color={selectedMethod === method.id ? "#FFFFFF" : "#4A5568"}
              />
            </View>
            <View style={styles.details}>
              <Text style={styles.name}>{method.name}</Text>
              <Text style={styles.info}>{method.detail}</Text>
              {method.expiry && (
                <Text style={styles.expiry}>Exp: {method.expiry}</Text>
              )}
            </View>
            <View style={styles.radio}>
              {selectedMethod === method.id && (
                <View style={styles.radioInner} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add New Method</Text>
        </TouchableOpacity>
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
  list: { padding: 20 },
  card: {
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
    borderWidth: 1,
    borderColor: "transparent",
  },
  cardSelected: { borderColor: "#1A1A1A" },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#F7FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconWrapperSelected: { backgroundColor: "#1A1A1A" },
  details: { flex: 1 },
  name: { fontSize: 16, fontWeight: "700", color: "#1A1A1A", marginBottom: 4 },
  info: { fontSize: 14, color: "#718096" },
  expiry: { fontSize: 12, color: "#A0AEC0", marginTop: 4 },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#CBD5E0",
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1A1A1A",
  },
  footer: { padding: 20, backgroundColor: "#FAF9F6" },
  addBtn: {
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
});
