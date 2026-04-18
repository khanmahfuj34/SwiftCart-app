import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useCart } from "../../src/context/CartContext";
import { productAPI } from "../../src/services/api";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart, cartItems } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const isInCart = useMemo(() => {
    return cartItems.some((item) => item.id === id?.toString());
  }, [cartItems, id]);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productAPI.getProductById(id);
      if (data) {
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        }
      } else {
        setError("Product not found.");
      }
    } catch (err) {
      setError("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (imgUrl: string) => {
    if (imgUrl === selectedImage) return;
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      setSelectedImage(imgUrl);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setAddingToCart(true);
      await addToCart(product, quantity);
      Alert.alert("Success", "Added to your cart!");
      setQuantity(1);
    } catch (err) {
      Alert.alert("Error", "Failed to add item to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading details...</Text>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
        <Text style={styles.errorText}>{error || "Product not found"}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const categoryName = product.category?.name || "Unknown";
  const totalPrice = (product.price * quantity).toFixed(2);
  const productImages = product.images || [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={() => router.push("/cart")}
        >
          <View>
            <Ionicons name="cart-outline" size={24} color="#1A1A1A" />
            {cartItems.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageCard}>
          <Animated.Image
            source={{ uri: selectedImage || "https://via.placeholder.com/400" }}
            style={[styles.mainProductImage, { opacity: fadeAnim }]}
            resizeMode="cover"
          />
          {productImages.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbnailContainer}
            >
              {productImages.map((img: string, idx: number) => {
                const isSelected = img === selectedImage;
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => handleImageSelect(img)}
                    activeOpacity={0.8}
                    style={[
                      styles.thumbnailWrapper,
                      isSelected && styles.thumbnailSelected,
                    ]}
                  >
                    <Image
                      source={{ uri: img }}
                      style={styles.thumbnailImage}
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.row}>
            <Text style={styles.categoryBadge}>{categoryName}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={styles.ratingText}>4.5</Text>
            </View>
          </View>

          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>
            ৳{parseFloat(product.price || 0).toLocaleString()}
          </Text>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={[
                  styles.qtyButton,
                  quantity === 1 && styles.qtyButtonDisabled,
                ]}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity === 1}
              >
                <Ionicons
                  name="remove"
                  size={20}
                  color={quantity === 1 ? "#CCC" : "#1A1A1A"}
                />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => setQuantity((q) => q + 1)}
              >
                <Ionicons name="add" size={20} color="#1A1A1A" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Ionicons name="refresh-circle-outline" size={20} color="#10B981" />
              <Text style={styles.featureText}>7 Days Return</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#10B981" />
              <Text style={styles.featureText}>Genuine Product</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceContainer}>
          <Text style={styles.totalPriceLabel}>Total Price</Text>
          <Text style={styles.totalPriceValue}>
            ৳{parseFloat(totalPrice).toLocaleString()}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.addToCartButton,
            addingToCart && styles.addToCartButtonLoading,
            isInCart && styles.alreadyInCartButton
          ]}
          onPress={handleAddToCart}
          disabled={addingToCart}
        >
          {addingToCart ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <Ionicons name={isInCart ? "add-circle" : "cart"} size={22} color="#FFF" />
              <Text style={styles.addToCartText}>
                {isInCart ? "Add More" : "Add to Cart"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#718096",
    fontWeight: "500",
  },
  errorText: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 18,
    color: "#1A1A1A",
    textAlign: "center",
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#2563EB",
    borderRadius: 8,
  },
  backButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerIconButton: { padding: 8, borderRadius: 12, backgroundColor: "#F9FAFB" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  cartBadge: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  cartBadgeText: { color: "#FFF", fontSize: 10, fontWeight: "700" },
  scrollContainer: { flex: 1 },
  imageCard: { backgroundColor: "#FFF" },
  mainProductImage: { width: "100%", height: 380, backgroundColor: "#F3F4F6" },
  thumbnailContainer: { paddingHorizontal: 16, paddingVertical: 16, gap: 12 },
  thumbnailWrapper: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#F3F4F6",
    overflow: "hidden",
    padding: 2,
  },
  thumbnailSelected: { borderColor: "#2563EB" },
  thumbnailImage: { width: 70, height: 70, borderRadius: 10 },
  infoContainer: {
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7ED",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: { fontSize: 13, fontWeight: "600", color: "#C2410C" },
  categoryBadge: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    lineHeight: 32,
  },
  price: {
    fontSize: 26,
    fontWeight: "800",
    color: "#2563EB",
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 16,
  },
  section: { marginBottom: 8 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 8,
    width: 140,
  },
  qtyButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  qtyButtonDisabled: { opacity: 0.5 },
  qtyText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
    textAlign: "center",
  },
  descriptionText: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 24,
  },
  featuresContainer: {
    flexDirection: "row",
    marginTop: 24,
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  featureText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#166534",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    gap: 16,
  },
  bottomPriceContainer: { flex: 0.4 },
  totalPriceLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 2,
  },
  totalPriceValue: { fontSize: 22, fontWeight: "800", color: "#111827" },
  addToCartButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  alreadyInCartButton: {
    backgroundColor: "#10B981",
    shadowColor: "#10B981",
  },
  addToCartButtonLoading: { opacity: 0.7 },
  addToCartText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
});
