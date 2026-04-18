import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCart } from "../src/context/CartContext";

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    getTotalPrice,
  } = useCart();

  const renderCartItem = ({ item }: { item: any }) => {
    const imageUrl = item.images?.[0] || item.image;
    return (
      <View style={styles.cartItem}>
        {/* Product Image */}
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.productImage}
            resizeMode="cover"
          />
        )}

        {/* Product Details */}
        <View style={styles.itemDetails}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {item.title}
          </Text>
          {/* Show unit info if available (grocery item) */}
          {item.selectedUnit && (
            <Text style={styles.unitInfo}>
              {item.selectedUnit}
              {item.selectedUnitType &&
                ` • ৳${item.unitPrice?.toFixed(0) || item.price.toFixed(0)}/${item.selectedUnitType}`}
            </Text>
          )}
          <Text style={styles.productPrice}>
            ৳
            {typeof item.price === "number"
              ? item.price.toFixed(0)
              : parseFloat(item.price).toFixed(0)}
          </Text>
        </View>

        {/* Quantity Controls */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => decreaseQuantity(item.id)}
          >
            <Text style={styles.buttonText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.quantityText}>{item.quantity}</Text>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => increaseQuantity(item.id)}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Item Total */}
        <View style={styles.itemTotal}>
          <Text style={styles.totalText}>
            ৳
            {(item.unitPrice
              ? item.unitPrice * item.quantity
              : item.price * item.quantity
            ).toFixed(0)}
          </Text>
        </View>

        {/* Remove Button */}
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromCart(item.id)}
        >
          <Text style={styles.removeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Your cart is empty</Text>
      <Text style={styles.emptySubText}>Add items to get started!</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
      </View>

      {/* Cart Items List */}
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyCart}
        scrollEnabled={true}
      />

      {/* Total Price Section */}
      {cartItems.length > 0 && (
        <View style={styles.totalContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>৳{getTotalPrice().toFixed(0)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax (10%):</Text>
            <Text style={styles.totalValue}>
              ৳{(getTotalPrice() * 0.1).toFixed(0)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total:</Text>
            <Text style={styles.grandTotalValue}>
              ৳{(getTotalPrice() * 1.1).toFixed(0)}
            </Text>
          </View>

          {/* Checkout Button */}
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => router.push("/checkout/address")}
          >
            <Ionicons name="bag-check" size={18} color="#FFFFFF" />
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexGrow: 1,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "center",
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#10B981",
  },
  unitInfo: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
    fontWeight: "500",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
    marginHorizontal: 8,
    paddingHorizontal: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: 8,
    color: "#333",
    minWidth: 20,
    textAlign: "center",
  },
  itemTotal: {
    width: 60,
    justifyContent: "center",
    alignItems: "flex-end",
    marginHorizontal: 8,
  },
  totalText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ff6b6b",
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
  },
  totalContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  totalValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2ecc71",
  },
  checkoutButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
