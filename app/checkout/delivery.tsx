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
import StepIndicator from "../../src/components/StepIndicator";
import { useCart } from "../../src/context/CartContext";
import { useCheckout } from "../../src/context/CheckoutContext";

const deliveryOptions = [
  {
    id: 1,
    name: "Standard Delivery",
    days: "3-5 days",
    fee: 5,
    description: "Free on orders above $50",
  },
  {
    id: 2,
    name: "Express Delivery",
    days: "1-2 days",
    fee: 15,
    description: "Get your items faster",
  },
];

export default function CheckoutDeliveryScreen() {
  const router = useRouter();
  const {
    selectedDelivery,
    setSelectedDelivery,
    setCurrentStep,
    addresses,
    selectedAddress,
  } = useCheckout();
  const { cartItems } = useCart();

  const selectedAddr = addresses.find((a) => a.id === selectedAddress);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0,
  );
  const selectedDeliveryOption = deliveryOptions.find(
    (d) => d.id === selectedDelivery,
  );

  const handleContinue = () => {
    if (selectedDelivery) {
      setCurrentStep(3);
      router.push("/checkout/payment");
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Options</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <StepIndicator
          currentStep={2}
          steps={["Address", "Delivery", "Payment", "Review"]}
        />

        {/* Selected Address Summary */}
        <View style={styles.addressSummary}>
          <View>
            <Text style={styles.summaryLabel}>Delivering to</Text>
            <Text style={styles.summaryName}>{selectedAddr?.name}</Text>
            <Text style={styles.summaryAddress}>{selectedAddr?.address}</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="pencil" size={20} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        {/* Delivery Options */}
        <Text style={styles.sectionTitle}>Choose Delivery Option</Text>

        {deliveryOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => setSelectedDelivery(option.id)}
            style={[
              styles.deliveryCard,
              selectedDelivery === option.id && styles.deliveryCardSelected,
            ]}
          >
            <View style={styles.cardLeft}>
              <View
                style={[
                  styles.radio,
                  selectedDelivery === option.id && styles.radioSelected,
                ]}
              >
                {selectedDelivery === option.id && (
                  <View style={styles.radioDot} />
                )}
              </View>
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryName}>{option.name}</Text>
                <Text style={styles.deliveryDays}>{option.days}</Text>
                <Text style={styles.deliveryDesc}>{option.description}</Text>
              </View>
            </View>
            <Text style={styles.deliveryFee}>${option.fee.toFixed(2)}</Text>
          </TouchableOpacity>
        ))}

        {/* Price Summary */}
        <View style={styles.priceSummary}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Delivery</Text>
            <Text style={styles.priceValue}>
              ${selectedDeliveryOption?.fee.toFixed(2) || "0.00"}
            </Text>
          </View>
          <View style={[styles.priceRow, styles.priceRowBorder]}>
            <Text style={styles.priceTotal}>Total</Text>
            <Text style={styles.priceTotalValue}>
              ${(subtotal + (selectedDeliveryOption?.fee || 0)).toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedDelivery}
          style={[
            styles.continueBtn,
            !selectedDelivery && styles.continueBtnDisabled,
          ]}
        >
          <Text style={styles.continueBtnText}>Continue to Payment</Text>
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
  addressSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#EDF2F7",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#718096",
    fontWeight: "500",
    marginBottom: 4,
  },
  summaryName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  summaryAddress: { fontSize: 13, color: "#4A5568" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  deliveryCard: {
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
  deliveryCardSelected: {
    borderColor: "#1A1A1A",
    backgroundColor: "#F8F9FF",
  },
  cardLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
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
    marginTop: 2,
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
  deliveryInfo: { flex: 1 },
  deliveryName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  deliveryDays: {
    fontSize: 13,
    color: "#718096",
    fontWeight: "600",
    marginBottom: 2,
  },
  deliveryDesc: { fontSize: 12, color: "#A0AEC0" },
  deliveryFee: { fontSize: 16, fontWeight: "700", color: "#1A1A1A" },
  priceSummary: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  priceRowBorder: {
    borderTopWidth: 1,
    borderTopColor: "#EDF2F7",
    paddingTop: 12,
    marginTop: 4,
  },
  priceLabel: { fontSize: 14, color: "#718096", fontWeight: "500" },
  priceValue: { fontSize: 14, color: "#1A1A1A", fontWeight: "600" },
  priceTotal: { fontSize: 16, color: "#1A1A1A", fontWeight: "700" },
  priceTotalValue: { fontSize: 18, color: "#1A1A1A", fontWeight: "800" },
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
