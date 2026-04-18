import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
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

export default function CheckoutReviewScreen() {
  const router = useRouter();
  const {
    selectedAddress,
    selectedDelivery,
    selectedPayment,
    addresses,
    placeOrder,
    error,
    setError,
    loading,
  } = useCheckout();
  const { cartItems, clearCart } = useCart();

  const selectedAddr = addresses.find((a) => a.id === selectedAddress);

  const paymentMethodNames = {
    1: "Cash on Delivery",
    2: "Credit/Debit Card",
    3: "bKash",
    4: "Nagad",
  };

  const deliveryNames = {
    1: "Standard Delivery",
    2: "Express Delivery",
  };

  const deliveryFees = {
    1: 5,
    2: 15,
  };

  const paymentMethod = paymentMethodNames[selectedPayment];
  const deliveryType = deliveryNames[selectedDelivery];
  const deliveryFee = deliveryFees[selectedDelivery];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0,
  );
  const total = subtotal + deliveryFee;

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image
        source={{
          uri:
            item.image || item.images?.[0] || "https://via.placeholder.com/80",
        }}
        style={styles.itemImage}
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.itemPrice}>${item.price?.toFixed(2)}</Text>
      </View>
      <View style={styles.itemQuantity}>
        <Text style={styles.quantityText}>×{item.quantity || 1}</Text>
      </View>
      <Text style={styles.itemTotal}>
        ${(item.price * (item.quantity || 1)).toFixed(2)}
      </Text>
    </View>
  );

  const handlePlaceOrder = async () => {
    // Validate first
    if (!cartItems || cartItems.length === 0) {
      Alert.alert("Empty Cart", "Please add items before checkout.");
      return;
    }

    if (!selectedAddress) {
      Alert.alert("Missing Address", "Please select a delivery address.");
      return;
    }

    if (!selectedDelivery) {
      Alert.alert("Missing Delivery", "Please select a delivery method.");
      return;
    }

    if (!selectedPayment) {
      Alert.alert("Missing Payment", "Please select a payment method.");
      return;
    }

    const orderId = await placeOrder(cartItems, subtotal, deliveryFee, total);

    if (orderId) {
      await clearCart();
      router.push({
        pathname: "/checkout/success",
        params: { orderId },
      });
    } else if (error) {
      Alert.alert("Order Failed", error);
      setError(null);
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
        <Text style={styles.headerTitle}>Review Order</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <StepIndicator
          currentStep={4}
          steps={["Address", "Delivery", "Payment", "Review"]}
        />

        {/* Shipping Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={20} color="#1A1A1A" />
            <Text style={styles.sectionTitle}>Shipping Address</Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.addressName}>{selectedAddr?.name}</Text>
            <Text style={styles.addressPhone}>{selectedAddr?.phone}</Text>
            <Text style={styles.addressText}>{selectedAddr?.address}</Text>
          </View>
        </View>

        {/* Delivery Type */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="truck" size={20} color="#1A1A1A" />
            <Text style={styles.sectionTitle}>Delivery</Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.deliveryType}>{deliveryType}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="card" size={20} color="#1A1A1A" />
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.paymentType}>{paymentMethod}</Text>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bag" size={20} color="#1A1A1A" />
            <Text style={styles.sectionTitle}>
              Order Summary ({cartItems.length})
            </Text>
          </View>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.cartList}
          />
        </View>

        {/* Price Summary */}
        <View style={styles.priceSummary}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Delivery Fee</Text>
            <Text style={styles.priceValue}>${deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={[styles.priceRow, styles.priceRowBorder]}>
            <Text style={styles.priceTotal}>Total</Text>
            <Text style={styles.priceTotalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handlePlaceOrder}
          disabled={loading}
          style={[
            styles.placeOrderBtn,
            loading && styles.placeOrderBtnDisabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Ionicons name="bag-check" size={18} color="#FFFFFF" />
              <Text style={styles.placeOrderBtnText}>Place Order</Text>
            </>
          )}
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
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EDF2F7",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    marginLeft: 10,
  },
  sectionContent: { paddingVertical: 4 },
  addressName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  addressPhone: {
    fontSize: 13,
    color: "#718096",
    fontWeight: "500",
    marginBottom: 6,
  },
  addressText: { fontSize: 13, color: "#4A5568", lineHeight: 18 },
  deliveryType: { fontSize: 15, fontWeight: "600", color: "#1A1A1A" },
  paymentType: { fontSize: 15, fontWeight: "600", color: "#1A1A1A" },
  cartList: { gap: 12 },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: { flex: 1 },
  itemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  itemPrice: { fontSize: 13, color: "#718096", fontWeight: "500" },
  itemQuantity: { marginHorizontal: 12 },
  quantityText: { fontSize: 14, fontWeight: "600", color: "#1A1A1A" },
  itemTotal: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
    minWidth: 60,
    textAlign: "right",
  },
  priceSummary: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EDF2F7",
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
  placeOrderBtn: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  placeOrderBtnDisabled: {
    backgroundColor: "#CBD5E0",
    opacity: 0.7,
  },
  placeOrderBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 10,
  },
});
