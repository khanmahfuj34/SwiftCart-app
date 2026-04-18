import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { BorderRadius, Colors, Shadows, Spacing } from "../constants/theme";
import { useCart } from "../src/context/CartContext";
import { useProducts } from "../src/hooks/useProducts";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - Spacing.xl * 2 - Spacing.lg) / 2;

export default function OffersScreen() {
  const router = useRouter();
  const { products } = useProducts();
  const { cartItems, addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");

  // Get flash sale products (random selection with discounts)
  const offerProducts = products.slice(0, 12);

  const filteredProducts = offerProducts.filter((p: any) =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalItems = cartItems.reduce(
    (total: number, item: any) => total + item.quantity,
    0,
  );

  return (
    <LinearGradient
      colors={["#FFFFFF", Colors.background.softerBlue]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color={Colors.accent} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Flash Sale</Text>
          <TouchableOpacity onPress={() => router.push("/cart")}>
            <Ionicons name="cart" size={26} color={Colors.accent} />
            {totalItems > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {totalItems > 99 ? "99+" : totalItems}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Flash Sale Banner */}
          <LinearGradient
            colors={["#EF4444", "#DC2626"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.flashBanner}
          >
            <Ionicons name="flash" size={32} color="#FFFFFF" />
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Limited Time Offers</Text>
              <Text style={styles.bannerSubtitle}>Up to 50% OFF</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
          </LinearGradient>

          {/* Product Grid */}
          <View style={styles.gridContainer}>
            <View style={styles.productGrid}>
              {filteredProducts.map((product: any) => (
                <View key={product.id} style={styles.productCardWrapper}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.push(`/product/${product.id}`)}
                    style={styles.productCard}
                  >
                    <View style={styles.productImageContainer}>
                      {/* Discount Badge */}
                      <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>-30%</Text>
                      </View>

                      {product.images?.[0] ? (
                        <Image
                          source={{ uri: product.images[0] }}
                          style={styles.productImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <LinearGradient
                          colors={["#E0E7FF", "#B8D4FF"]}
                          style={styles.productImage}
                        />
                      )}
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => addToCart(product)}
                      >
                        <Ionicons name="add" size={24} color={Colors.accent} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.productInfo}>
                      <Text style={styles.productCategory} numberOfLines={1}>
                        {product.category?.name || "Sale"}
                      </Text>
                      <Text style={styles.productTitle} numberOfLines={2}>
                        {product.title}
                      </Text>
                      <View style={styles.priceRow}>
                        <View style={styles.priceContainer}>
                          <Text style={styles.productPrice}>
                            ${(product.price * 0.7).toFixed(2)}
                          </Text>
                          <Text style={styles.originalPrice}>
                            ${product.price?.toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {filteredProducts.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons
                name="alert-circle-outline"
                size={64}
                color={Colors.muted}
              />
              <Text style={styles.emptyText}>No offers found</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.secondary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.accent,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.full,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: Colors.secondary,
    fontSize: 10,
    fontWeight: "700",
  },
  flashBanner: {
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    ...Shadows.lg,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  bannerSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    opacity: 0.9,
    marginTop: Spacing.xs,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  gridContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  productCardWrapper: {
    width: CARD_WIDTH,
  },
  productCard: {
    overflow: "hidden",
  },
  productImageContainer: {
    width: "100%",
    height: CARD_WIDTH,
    backgroundColor: Colors.background.lighter,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    marginBottom: Spacing.md,
    position: "relative",
  },
  discountBadge: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: "#DC2626",
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    zIndex: 5,
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  addButton: {
    position: "absolute",
    bottom: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    padding: Spacing.sm,
    ...Shadows.md,
  },
  productInfo: {
    gap: Spacing.xs,
  },
  productCategory: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.accent,
  },
  originalPrice: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.muted,
    textDecorationLine: "line-through",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.muted,
    marginTop: Spacing.md,
  },
});
