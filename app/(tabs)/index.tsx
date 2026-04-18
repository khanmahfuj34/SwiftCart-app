import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BorderRadius, Colors, Shadows, Spacing } from "../../constants/theme";
import CategoryList from "../../src/components/CategoryList";
import SearchBar from "../../src/components/SearchBar";
import SideDrawer from "../../src/components/SideDrawer";
import { PremiumCard } from "../../src/components/ui";
import { useCart } from "../../src/context/CartContext";
import { useDrawer } from "../../src/context/DrawerContext";
import { useWishlist } from "../../src/context/WishlistContext";
import { useProducts } from "../../src/hooks/useProducts";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - Spacing.xl * 2 - Spacing.lg) / 2;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { products, categories, loading: productsLoading } = useProducts();
  const { cartItems, addToCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const { drawerVisible, setDrawerVisible } = useDrawer();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  const totalItems = useMemo(
    () => cartItems.reduce((total, item) => total + (item.quantity || 1), 0),
    [cartItems],
  );

  // Optimized product filtering
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    return products.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !activeCategory || p.category?.id === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, activeCategory]);

  const heroProducts = filteredProducts.slice(0, 3);
  const trendingProducts = filteredProducts.slice(3, 12);
  const allProducts = filteredProducts; // Show all filtered products

  // Check if item is in cart
  const isItemInCart = (productId) => {
    return cartItems.some((item) => item.id === productId);
  };

  // Check if item is in wishlist
  const isItemInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  // Handle wishlist toggle
  const handleWishlistToggle = (e, product) => {
    e.stopPropagation();
    if (isItemInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Handle add to cart
  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
  };

  const renderProductCard = (product) => {
    const inCart = isItemInCart(product.id);
    const inWishlist = isItemInWishlist(product.id);

    return (
      <TouchableOpacity
        key={product.id}
        style={styles.productCardWrapper}
        onPress={() => router.push(`/product/${product.id}`)}
        activeOpacity={0.85}
      >
        <PremiumCard style={styles.productCard}>
          {/* Image Container with Wishlist Button */}
          <View style={styles.productImageContainer}>
            <Image
              source={{ uri: product.images?.[0] || product.image }}
              style={styles.productImage}
              resizeMode="cover"
            />

            {/* Wishlist Button - Top Right */}
            <TouchableOpacity
              style={styles.wishlistButton}
              onPress={(e) => handleWishlistToggle(e, product)}
            >
              <Ionicons
                name={inWishlist ? "heart" : "heart-outline"}
                size={22}
                color={inWishlist ? "#EF4444" : "#FFFFFF"}
              />
            </TouchableOpacity>

            {/* Add to Cart Button - Bottom Right */}
            <TouchableOpacity
              style={[styles.addButton, inCart && styles.addButtonActive]}
              onPress={(e) => handleAddToCart(e, product)}
              disabled={inCart}
            >
              <Ionicons
                name={inCart ? "checkmark-circle" : "add-circle"}
                size={28}
                color={inCart ? "#10B981" : Colors.accent}
              />
            </TouchableOpacity>
          </View>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <Text style={styles.productCategory} numberOfLines={1}>
              {product.category?.name || "PRODUCTS"}
            </Text>
            <Text style={styles.productTitle} numberOfLines={2}>
              {product.title || "Product"}
            </Text>

            {/* Price and Status */}
            <View style={styles.priceRow}>
              <Text style={styles.productPrice}>
                ৳{parseFloat(product.price || 0).toFixed(2)}
              </Text>
              {inCart && (
                <View style={styles.cartStatusBadge}>
                  <Ionicons name="checkmark-done" size={12} color="#10B981" />
                  <Text style={styles.cartStatusText}>In Cart</Text>
                </View>
              )}
            </View>
          </View>
        </PremiumCard>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={["#FFFFFF", Colors.background.softerBlue]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {/* Side Drawer */}
      <SideDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />

      <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
        {/* Premium Header */}
        <View style={[styles.header, { marginTop: Spacing.sm }]}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setDrawerVisible(true)}
          >
            <Ionicons name="menu" size={28} color={Colors.accent} />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Ionicons name="bag-check" size={24} color={Colors.accent} />
            <Text style={styles.headerTitle}>SwiftCart</Text>
          </View>

          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => router.push("/cart")}
          >
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
          {/* Search Bar */}
          <View style={styles.searchSection}>
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          </View>

          {/* Categories */}
          <View style={styles.categoriesSection}>
            <CategoryList
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />
          </View>

          {/* Loading State */}
          {productsLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.accent} />
              <Text style={styles.loadingText}>Loading products...</Text>
            </View>
          )}

          {/* Hero Carousel */}
          {!productsLoading && heroProducts.length > 0 && (
            <View style={styles.heroSection}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.heroScroll}
              >
                {heroProducts.map((product) => (
                  <TouchableOpacity
                    key={product.id}
                    style={styles.heroCard}
                    activeOpacity={0.9}
                    onPress={() => router.push(`/product/${product.id}`)}
                  >
                    <Image
                      source={{ uri: product.images?.[0] || product.image }}
                      style={styles.heroImage}
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={["transparent", "rgba(15, 23, 42, 0.8)"]}
                      style={styles.heroOverlay}
                    >
                      <View style={styles.heroContent}>
                        <Text style={styles.heroLabel}>NEW ARRIVALS</Text>
                        <Text style={styles.heroTitle} numberOfLines={2}>
                          {product.title}
                        </Text>
                        <View style={styles.heroButton}>
                          <Text style={styles.heroButtonText}>Explore</Text>
                          <Ionicons
                            name="arrow-forward"
                            size={14}
                            color={Colors.accent}
                          />
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Trending Products Section */}
          {!productsLoading && trendingProducts.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Trending Now</Text>
                <TouchableOpacity onPress={() => router.push("/(tabs)/")}>
                  <Text style={styles.viewAllLink}>View All →</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.productGrid}>
                {trendingProducts
                  .slice(0, 4)
                  .map((product) => renderProductCard(product))}
              </View>
            </View>
          )}

          {/* Flash Sale Banner */}
          {!productsLoading && filteredProducts.length > 0 && (
            <View style={styles.flashSaleSection}>
              <LinearGradient
                colors={[Colors.accent, "#1F2937"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.flashSaleBanner}
              >
                <View>
                  <Text style={styles.flashSaleLabel}>⚡ FLASH SALE</Text>
                  <Text style={styles.flashSaleTitle}>Up to 50% OFF</Text>
                  <Text style={styles.flashSaleSubtitle}>
                    Limited time offer
                  </Text>
                </View>
                <TouchableOpacity style={styles.flashSaleButton}>
                  <Text style={styles.flashSaleButtonText}>Shop Now</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}

          {/* Recommended Section */}
          {!productsLoading && trendingProducts.length > 4 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recommended For You</Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recommendedScroll}
              >
                {trendingProducts.slice(4, 8).map((product) => (
                  <TouchableOpacity
                    key={product.id}
                    style={styles.recommendedCardWrapper}
                    onPress={() => router.push(`/product/${product.id}`)}
                    activeOpacity={0.85}
                  >
                    <PremiumCard
                      variant="elevated"
                      style={styles.recommendedCard}
                    >
                      <View style={styles.recommendedImageContainer}>
                        <Image
                          source={{ uri: product.images?.[0] || product.image }}
                          style={styles.recommendedImage}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          style={styles.recommendedWishlist}
                          onPress={(e) => handleWishlistToggle(e, product)}
                        >
                          <Ionicons
                            name={
                              isItemInWishlist(product.id)
                                ? "heart"
                                : "heart-outline"
                            }
                            size={18}
                            color={
                              isItemInWishlist(product.id)
                                ? "#EF4444"
                                : Colors.accent
                            }
                          />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.recommendedTitle} numberOfLines={2}>
                        {product.title}
                      </Text>
                      <Text style={styles.recommendedPrice}>
                        ৳{parseFloat(product.price || 0).toFixed(2)}
                      </Text>
                    </PremiumCard>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* All Products Grid */}
          {!productsLoading && filteredProducts.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {activeCategory ? "Category Products" : "All Products"}
                </Text>
              </View>

              <View style={styles.productGrid}>
                {allProducts.map((product) => renderProductCard(product))}
              </View>
            </View>
          )}

          {/* Empty State */}
          {!productsLoading &&
            filteredProducts.length === 0 &&
            products.length > 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="search" size={48} color={Colors.muted} />
                <Text style={styles.emptyStateTitle}>No products found</Text>
                <Text style={styles.emptyStateText}>
                  Try adjusting your search or filters
                </Text>
              </View>
            )}

          {/* Bottom Spacing */}
          <View style={{ height: Spacing["3xl"] }} />
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
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuButton: {
    padding: Spacing.sm,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.accent,
    letterSpacing: 0.3,
  },
  cartButton: {
    position: "relative",
    padding: Spacing.sm,
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
    ...Shadows.sm,
  },
  badgeText: {
    color: Colors.secondary,
    fontSize: 10,
    fontWeight: "700",
  },
  scrollContent: {
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.muted,
    fontWeight: "500",
  },
  searchSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  categoriesSection: {
    paddingVertical: Spacing.md,
  },
  heroSection: {
    marginVertical: Spacing.lg,
  },
  heroScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  heroCard: {
    width: 280,
    height: 320,
    borderRadius: BorderRadius["2xl"],
    overflow: "hidden",
    ...Shadows.lg,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
    justifyContent: "flex-end",
  },
  heroContent: {
    padding: Spacing.lg,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.secondary,
    letterSpacing: 1.2,
    marginBottom: Spacing.sm,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.secondary,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  heroButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.secondary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignSelf: "flex-start",
  },
  heroButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.accent,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing["2xl"],
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.accent,
    letterSpacing: 0.3,
  },
  viewAllLink: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.accent,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  productCardWrapper: {
    width: CARD_WIDTH,
    marginBottom: Spacing.sm,
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
  productImage: {
    width: "100%",
    height: "100%",
  },
  wishlistButton: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.md,
  },
  addButton: {
    position: "absolute",
    bottom: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    ...Shadows.md,
  },
  addButtonActive: {
    backgroundColor: "rgba(16, 185, 129, 0.9)",
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
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.accent,
  },
  cartStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#D1F2EB",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.md,
  },
  cartStatusText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#10B981",
  },
  flashSaleSection: {
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.xl,
  },
  flashSaleBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    ...Shadows.lg,
  },
  flashSaleLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.secondary,
    marginBottom: Spacing.xs,
  },
  flashSaleTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.secondary,
  },
  flashSaleSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: Spacing.xs,
  },
  flashSaleButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  flashSaleButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.accent,
  },
  recommendedScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  recommendedCardWrapper: {
    width: 170,
  },
  recommendedCard: {
    overflow: "hidden",
  },
  recommendedImageContainer: {
    position: "relative",
    marginBottom: Spacing.md,
  },
  recommendedImage: {
    width: "100%",
    height: 170,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background.lighter,
  },
  recommendedWishlist: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  recommendedTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    lineHeight: 16,
  },
  recommendedPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.accent,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.muted,
    textAlign: "center",
  },
});
