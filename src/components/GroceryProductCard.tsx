import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { memo, useCallback } from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { BorderRadius, Colors, Shadows, Spacing } from "../../constants/theme";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

/**
 * GroceryProductCard - Optimized for grocery items
 * Shows: image, name, unit, price, freshness tag, quick add
 */
const GroceryProductCard = memo(({ product, onPress }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const [loading, setLoading] = React.useState(false);

  const handleAddToCart = useCallback(
    async (e) => {
      e?.stopPropagation?.();
      setLoading(true);
      try {
        await addToCart(product);
      } finally {
        setLoading(false);
      }
    },
    [product, addToCart],
  );

  const handleWishlistToggle = useCallback(
    (e) => {
      e?.stopPropagation?.();
      const currentIsInWishlist = wishlistItems.some(
        (item) => item.id === product.id,
      );
      if (currentIsInWishlist) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    },
    [product, wishlistItems, addToWishlist, removeFromWishlist],
  );

  const handlePress = useCallback(() => {
    router.push(`/product/${product.id}`);
  }, [product.id, router]);

  if (!product) return null;

  const imageUrl =
    product.images?.[0] || product.image || "https://via.placeholder.com/150";
  const categoryName = product.category?.name || "Fresh Produce";
  const unit = product.unit || "kg"; // Default to kg
  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress || handlePress}
      activeOpacity={0.85}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Freshness Badge */}
        <View style={styles.freshnessBadge}>
          <Ionicons name="checkmark-circle" size={14} color="#FFF" />
          <Text style={styles.freshnessText}>Fresh</Text>
        </View>

        {/* Wishlist Button */}
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={handleWishlistToggle}
        >
          <Ionicons
            name={isInWishlist ? "heart" : "heart-outline"}
            size={20}
            color={isInWishlist ? "#EF4444" : "#FFF"}
          />
        </TouchableOpacity>
      </View>

      {/* Content Container */}
      <View style={styles.content}>
        {/* Category */}
        <Text style={styles.category} numberOfLines={1}>
          {categoryName}
        </Text>

        {/* Product Name */}
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>

        {/* Unit Display */}
        <Text style={styles.unit}>
          {product.pricePerUnit
            ? `₹${product.pricePerUnit}/${unit}`
            : `₹${product.price}`}
        </Text>

        {/* Price and Quick Add */}
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              ৳{parseFloat(product.price || 0).toFixed(0)}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.addBtn, loading && styles.addBtnLoading]}
            onPress={handleAddToCart}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Ionicons name="add-circle" size={24} color="#FFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
});

GroceryProductCard.displayName = "GroceryProductCard";

export default GroceryProductCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    marginBottom: Spacing.md,
    ...Shadows.md,
  },

  imageContainer: {
    position: "relative",
    width: "100%",
    height: 160,
    backgroundColor: Colors.background.lighter,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  freshnessBadge: {
    position: "absolute",
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.success,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },

  freshnessText: {
    color: Colors.secondary,
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 4,
  },

  wishlistBtn: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: "rgba(0,0,0,0.3)",
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    padding: Spacing.md,
  },

  category: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.text.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  title: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 4,
    lineHeight: 18,
  },

  unit: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.accent,
    marginBottom: Spacing.sm,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  priceContainer: {
    flex: 1,
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.accent,
  },

  addBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.sm,
  },

  addBtnLoading: {
    opacity: 0.7,
  },
});
