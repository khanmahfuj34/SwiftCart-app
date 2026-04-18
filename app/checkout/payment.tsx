import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import StepIndicator from "../../src/components/StepIndicator";
import { useCheckout } from "../../src/context/CheckoutContext";

const paymentMethods = [
  { id: 1, name: "Cash on Delivery", icon: "cash", color: "#48BB78" },
  { id: 2, name: "Credit/Debit Card", icon: "card", color: "#3182CE" },
  { id: 3, name: "bKash", icon: "logo-bitcoin", color: "#EE5A24" },
  { id: 4, name: "Nagad", icon: "phone-portrait", color: "#F39C12" },
];

export default function CheckoutPaymentScreen() {
  const router = useRouter();
  const {
    selectedPayment,
    setSelectedPayment,
    setCurrentStep,
    cardDetails,
    setCardDetails,
  } = useCheckout();
  const [showCardForm, setShowCardForm] = useState(false);

  const handlePaymentSelect = (id) => {
    setSelectedPayment(id);
    if (id === 2) {
      setShowCardForm(true);
    } else {
      setShowCardForm(false);
    }
  };

  const handleContinue = () => {
    if (selectedPayment) {
      setCurrentStep(4);
      router.push("/checkout/review");
    }
  };

  const handleBack = () => {
    router.back();
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\D/g, "");
    const formatted = cleaned
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
    setCardDetails({ ...cardDetails, number: formatted });
  };

  const formatExpiry = (text) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      const formatted = cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
      setCardDetails({ ...cardDetails, expiry: formatted });
    } else {
      setCardDetails({ ...cardDetails, expiry: cleaned });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Method</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <StepIndicator
          currentStep={3}
          steps={["Address", "Delivery", "Payment", "Review"]}
        />

        <Text style={styles.sectionTitle}>Choose Payment Method</Text>

        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            onPress={() => handlePaymentSelect(method.id)}
            style={[
              styles.paymentCard,
              selectedPayment === method.id && styles.paymentCardSelected,
            ]}
          >
            <View style={styles.cardLeft}>
              <View
                style={[
                  styles.radio,
                  selectedPayment === method.id && styles.radioSelected,
                ]}
              >
                {selectedPayment === method.id && (
                  <View style={styles.radioDot} />
                )}
              </View>
              <View
                style={[
                  styles.methodIcon,
                  { backgroundColor: method.color + "20" },
                ]}
              >
                <Ionicons
                  name={method.icon as any}
                  size={24}
                  color={method.color}
                />
              </View>
              <Text style={styles.methodName}>{method.name}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={selectedPayment === method.id ? "#1A1A1A" : "#CBD5E0"}
            />
          </TouchableOpacity>
        ))}

        {/* Card Form */}
        {showCardForm && (
          <View style={styles.cardForm}>
            <Text style={styles.formTitle}>Card Details</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Card Number</Text>
              <TextInput
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#A0AEC0"
                value={cardDetails.number}
                onChangeText={formatCardNumber}
                style={styles.input}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 12 }]}>
                <Text style={styles.label}>Expiry</Text>
                <TextInput
                  placeholder="MM/YY"
                  placeholderTextColor="#A0AEC0"
                  value={cardDetails.expiry}
                  onChangeText={formatExpiry}
                  style={styles.input}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>CVV</Text>
                <TextInput
                  placeholder="123"
                  placeholderTextColor="#A0AEC0"
                  value={cardDetails.cvv}
                  onChangeText={(text) =>
                    setCardDetails({ ...cardDetails, cvv: text.slice(0, 3) })
                  }
                  style={styles.input}
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>
            </View>

            <View style={styles.saveCardRow}>
              <Ionicons name="checkbox" size={20} color="#1A1A1A" />
              <Text style={styles.saveCardText}>
                Save this card for future purchases
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedPayment}
          style={[
            styles.continueBtn,
            !selectedPayment && styles.continueBtnDisabled,
          ]}
        >
          <Text style={styles.continueBtnText}>Review Order</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
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
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
  },
  backBtn: {
    padding: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EDF2F7",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1A1A1A" },
  scrollContent: { paddingHorizontal: 20, paddingVertical: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  paymentCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: "#EDF2F7",
  },
  paymentCardSelected: {
    borderColor: "#1A1A1A",
    backgroundColor: "#F8F9FF",
  },
  cardLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#CBD5E0",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    borderColor: "#1A1A1A",
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1A1A1A",
  },
  methodIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  methodName: { fontSize: 15, fontWeight: "700", color: "#1A1A1A" },
  cardForm: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EDF2F7",
  },
  formTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  formGroup: { marginBottom: 16 },
  formRow: { flexDirection: "row", marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: "#1A1A1A", marginBottom: 6 },
  input: {
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#EDF2F7",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1A1A1A",
    fontFamily: "monospace",
  },
  saveCardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  saveCardText: {
    fontSize: 13,
    color: "#4A5568",
    marginLeft: 10,
    fontWeight: "500",
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EDF2F7",
  },
  continueBtn: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  continueBtnDisabled: {
    backgroundColor: "#CBD5E0",
    opacity: 0.5,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginRight: 8,
  },
});
