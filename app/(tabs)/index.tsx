import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
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
import GroceryProductCard from "../../src/components/GroceryProductCard";
import SearchBar from "../../src/components/SearchBar";
import SideDrawer from "../../src/components/SideDrawer";
import { useDrawer } from "../../src/context/DrawerContext";
import { useProducts } from "../../src/hooks/useProducts";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { products, categories, loading: productsLoading } = useProducts();
  const { drawerVisible, setDrawerVisible } = useDrawer();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  const totalItems = useMemo(
    () => cartItems.reduce((total, item) => total + (item.quantity || 1), 0),
    [],
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

  const renderProductCard = (product) => {
    return (
      <View key={product.id} style={styles.productCardWrapper}>
        <GroceryProductCard product={product} />
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[Colors.secondary, Colors.background.softerGreen]}
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
            <View style={styles.promoBanner}>
              <LinearGradient
                colors={[Colors.accent, Colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.promoBannerContent}
              >
                <View>
                  <Text style={styles.promoLabel}>🥬 FRESH DEALS</Text>
                  <Text style={styles.promoTitle}>Up to 40% OFF</Text>
                  <Text style={styles.promoSubtitle}>
                    Fresh vegetables daily
                  </Text>
                </View>
              </LinearGradient>
            </View>
          )}

          {/* All Products Grid */}
          {!productsLoading && filteredProducts.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {activeCategory ? "Category Products" : "Fresh Produce"}
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
  productCardWrapper: {
    width: "100%",
    marginBottom: Spacing.sm,
  },
  productGrid: {
    flexDirection: "column",
    gap: Spacing.md,
  },
  promoBanner: {
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.xl,
  },
  promoBannerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    ...Shadows.lg,
  },
  promoLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.secondary,
    marginBottom: Spacing.xs,
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.secondary,
  },
  promoSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: Spacing.xs,
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
