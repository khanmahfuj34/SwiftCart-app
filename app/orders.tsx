import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useOrders } from "../src/context/OrdersContext";

const statusColors = {
  Pending: "#F59E0B",
  Processing: "#3B82F6",
  Shipped: "#8B5CF6",
  Delivered: "#10B981",
  Cancelled: "#EF4444",
};

const statusIcons = {
  Pending: "time",
  Processing: "sync",
  Shipped: "send",
  Delivered: "checkmark-circle",
  Cancelled: "close-circle",
};

const paymentMethodIcons = {
  "Cash on Delivery": "cash",
  "Credit/Debit Card": "card",
  bKash: "wallet",
  Nagad: "wallet",
};

export default function OrdersScreen() {
  const router = useRouter();
  const { orders, loading, error } = useOrders();

  const handleOrderDetail = (orderId) => {
    router.push({
      pathname: "/orders/[id]",
      params: { id: orderId },
    });
  };

  const handleBack = () => {
    router.back();
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate?.() || new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateDeliveryDate = (createdAt) => {
    const date = createdAt?.toDate?.() || new Date(createdAt);
    const deliveryDate = new Date(date.getTime() + 5 * 24 * 60 * 60 * 1000);
    return deliveryDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "৳0";
    return "৳" + parseFloat(amount).toFixed(2);
  };

  const calculateTotalSpent = () => {
    return orders.reduce((sum, order) => sum + (order.total || 0), 0);
  };

  const renderOrderCard = ({ item }) => {
    const itemCount = item.items?.length || 0;
    const deliveryDate = calculateDeliveryDate(item.createdAt);
    const addressPreview = item.address?.fullAddress || item.address?.address || "N/A";

    return (
      <TouchableOpacity
        onPress={() => handleOrderDetail(item.id)}
        style={styles.orderCard}
        activeOpacity={0.7}
      >
        {/* Premium Header Section */}
        <View style={styles.orderHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.orderIdBadge}>
              <Text style={styles.orderId}>#{item.id?.slice(0, 8).toUpperCase()}</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
              <Text style={styles.itemCount}>{itemCount} item{itemCount !== 1 ? "s" : ""}</Text>
            </View>
          </View>
          <View style={styles.statusBadgeContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusColors[item.status] || statusColors.Pending },
              ]}
            >
              <Ionicons
                name={statusIcons[item.status] || "help-circle"}
                size={14}
                color="#FFFFFF"
                style={styles.statusIcon}
              />
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        </View>

        {/* Items Preview - Enhanced */}
        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>Items</Text>
          <View style={styles.itemsPreview}>
            {item.items && item.items.length > 0 && (
              <>
                {item.items.slice(0, 2).map((product, idx) => (
                  <View key={idx} style={styles.itemRow}>
                    {product.image && (
                      <Image
                        source={{ uri: product.image }}
                        style={styles.itemImage}
                      />
                    )}
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemTitle} numberOfLines={2}>
                        {product.title}
                      </Text>
                      <View style={styles.itemMeta}>
                        <Text style={styles.itemQuantity}>Qty: {product.quantity}</Text>
                        {product.selectedSize && (
                          <Text style={styles.itemSize}>Size: {product.selectedSize}</Text>
                        )}
                      </View>
                    </View>
                    <Text style={styles.itemPrice}>
                      {formatCurrency(product.price)}
                    </Text>
                  </View>
                ))}
                {itemCount > 2 && (
                  <View style={styles.moreItemsContainer}>
                    <View style={styles.moreItemsDot} />
                    <Text style={styles.moreItems}>
                      +{itemCount - 2} more item{itemCount > 3 ? "s" : ""}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>

        {/* Order Summary - New Professional Section */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(item.subtotal || item.total - (item.deliveryFee || 0))}
            </Text>
          </View>
          {item.deliveryFee > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>{formatCurrency(item.deliveryFee)}</Text>
            </View>
          )}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>{formatCurrency(item.total)}</Text>
          </View>
        </View>

        {/* Delivery & Payment Info - Professional Layout */}
        <View style={styles.detailsSection}>
          {/* Delivery Address */}
          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="location" size={16} color="#2563EB" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Delivery To</Text>
              <Text style={styles.detailValue} numberOfLines={1}>
                {addressPreview}
              </Text>
            </View>
          </View>

          {/* Payment Method */}
          {item.paymentMethod && (
            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <Ionicons
                  name={paymentMethodIcons[item.paymentMethod] || "wallet"}
                  size={16}
                  color="#2563EB"
                />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Payment</Text>
                <Text style={styles.detailValue}>{item.paymentMethod}</Text>
              </View>
            </View>
          )}

          {/* Estimated Delivery */}
          {item.status !== "Cancelled" && (
            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <Ionicons name="calendar" size={16} color="#2563EB" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Est. Delivery</Text>
                <Text style={styles.detailValue}>{deliveryDate}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.viewDetailsBtn}
          onPress={() => handleOrderDetail(item.id)}
        >
          <Text style={styles.viewDetailsText}>View Full Details</Text>
          <Ionicons name="arrow-forward" size={16} color="#2563EB" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="bag" size={60} color="#CBD5E1" />
      </View>
      <Text style={styles.emptyTitle}>No Orders Yet</Text>
      <Text style={styles.emptyDesc}>Start shopping to see your orders here</Text>
      <TouchableOpacity
        onPress={() => router.push("/(tabs)")}
        style={styles.shopBtn}
      >
        <Ionicons name="home" size={18} color="#FFFFFF" />
        <Text style={styles.shopBtnText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle" size={60} color="#EF4444" />
      <Text style={styles.errorTitle}>Failed to Load Orders</Text>
      <Text style={styles.errorDesc}>{error}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      ) : error ? (
        renderErrorState()
      ) : orders.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View>
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="receipt" size={20} color="#2563EB" />
                  </View>
                  <View>
                    <Text style={styles.statLabel}>Total Orders</Text>
                    <Text style={styles.statValue}>{orders.length}</Text>
                  </View>
                </View>
                <View style={styles.statCard}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="wallet" size={20} color="#10B981" />
                  </View>
                  <View>
                    <Text style={styles.statLabel}>Total Spent</Text>
                    <Text style={styles.statValue}>
                      {formatCurrency(calculateTotalSpent())}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={styles.ordersListTitle}>Recent Orders</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FAF9F6" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
  },
  backBtn: {
    padding: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EDF2F7",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: 0.3,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#718096",
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#EDF2F7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 11,
    color: "#718096",
    fontWeight: "500",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  ordersListTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EDF2F7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    flex: 1,
  },
  orderIdBadge: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  orderId: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  headerInfo: {
    justifyContent: "center",
  },
  orderDate: {
    fontSize: 12,
    color: "#718096",
    fontWeight: "500",
    marginBottom: 2,
  },
  itemCount: {
    fontSize: 11,
    color: "#A0AEC0",
    fontWeight: "500",
  },
  statusBadgeContainer: {
    marginLeft: 8,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusIcon: {
    marginRight: 2,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  itemsSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  itemsPreview: {
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    padding: 10,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 8,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: "#F0F0F0",
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
    lineHeight: 16,
  },
  itemMeta: {
    flexDirection: "row",
    gap: 8,
  },
  itemQuantity: {
    fontSize: 10,
    color: "#718096",
    fontWeight: "500",
  },
  itemSize: {
    fontSize: 10,
    color: "#718096",
    fontWeight: "500",
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
    marginLeft: 8,
  },
  moreItemsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 4,
  },
  moreItemsDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#A0AEC0",
  },
  moreItems: {
    fontSize: 11,
    color: "#718096",
    fontStyle: "italic",
    fontWeight: "500",
  },
  summarySection: {
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 11,
    color: "#718096",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 11,
    color: "#4B5563",
    fontWeight: "600",
  },
  totalRow: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  totalAmount: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
  },
  detailsSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 10,
    marginBottom: 12,
    gap: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  detailIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  detailContent: {
    flex: 1,
    justifyContent: "center",
  },
  detailLabel: {
    fontSize: 10,
    color: "#A0AEC0",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "600",
  },
  viewDetailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
    letterSpacing: 0.2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  shopBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
  },
  shopBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 16,
    marginBottom: 8,
  },
  errorDesc: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
  },
});
