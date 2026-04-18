import React, { useEffect, useState, useRef, useMemo } from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView, Alert, Animated } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { productAPI } from "../../src/services/api";
import { useCart } from "../../src/context/CartContext";

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
    return cartItems.some((item) => item.id === id);
  }, [cartItems, id]);

  useEffect(() => { loadProduct(); }, [id]);

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
    Animated.timing(fadeAnim, { toValue: 0.5, duration: 120, useNativeDriver: true }).start(() => {
      setSelectedImage(imgUrl);
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setAddingToCart(true);
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
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
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
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
        <TouchableOpacity style={styles.headerIconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <TouchableOpacity style={styles.headerIconButton} onPress={() => router.push("/cart")}>
          <Ionicons name="cart-outline" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.imageCard}>
          <Animated.Image source={{ uri: selectedImage || "https://via.placeholder.com/400" }} style={[styles.mainProductImage, { opacity: fadeAnim }]} resizeMode="cover" />
          {productImages.length > 1 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbnailContainer}>
              {productImages.map((img: string, idx: number) => {
                const isSelected = img === selectedImage;
                return (
                  <TouchableOpacity key={idx} onPress={() => handleImageSelect(img)} activeOpacity={0.8} style={[styles.thumbnailWrapper, isSelected && styles.thumbnailSelected]}>
                    <Image source={{ uri: img }} style={styles.thumbnailImage} />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.categoryBadge}>{categoryName}</Text>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>৳{parseFloat(product.price || 0).toFixed(2)}</Text>

          {!isInCart && (
            <View style={styles.quantityContainer}>
              <Text style={styles.sectionTitle}>Quantity</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity style={[styles.qtyButton, quantity === 1 && styles.qtyButtonDisabled]} onPress={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity === 1}>
                  <Ionicons name="remove" size={20} color={quantity === 1 ? "#CCC" : "#1A1A1A"} />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{quantity}</Text>
                <TouchableOpacity style={styles.qtyButton} onPress={() => setQuantity(q => q + 1)}>
                  <Ionicons name="add" size={20} color="#1A1A1A" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceContainer}>
          <Text style={styles.totalPriceLabel}>TOTAL</Text>
          <Text style={styles.totalPriceValue}>৳{isInCart ? parseFloat(product.price || 0).toFixed(2) : totalPrice}</Text>
        </View>

        {isInCart ? (
          <TouchableOpacity style={styles.inCartButton} onPress={() => router.push("/cart")}>
            <Text style={styles.inCartText}>In Cart</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.addToCartButton, addingToCart && styles.addToCartButtonLoading]} onPress={handleAddToCart} disabled={addingToCart}>
            {addingToCart ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <Ionicons name="cart" size={20} color="#FFF" />
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF9F6" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FAF9F6", padding: 20 },
  loadingText: { marginTop: 16, fontSize: 16, color: "#718096", fontWeight: "500" },
  errorText: { marginTop: 16, marginBottom: 24, fontSize: 18, color: "#1A1A1A", textAlign: "center" },
  backButton: { paddingHorizontal: 24, paddingVertical: 12, backgroundColor: "#2563EB", borderRadius: 8 },
  backButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 12, backgroundColor: "#FFF", borderBottomWidth: 1, borderBottomColor: "#EDF2F7" },
  headerIconButton: { padding: 8, borderRadius: 8 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1A1A1A" },
  scrollContainer: { flex: 1 },
  imageCard: { backgroundColor: "#FFF", paddingBottom: 16 },
  mainProductImage: { width: "100%", height: 400, backgroundColor: "#F0F0F0" },
  thumbnailContainer: { paddingHorizontal: 16, paddingTop: 12, gap: 8 },
  thumbnailWrapper: { borderRadius: 12, borderWidth: 2, borderColor: "#E5E7EB", overflow: "hidden", padding: 4 },
  thumbnailSelected: { borderColor: "#2563EB", backgroundColor: "#EFF6FF" },
  thumbnailImage: { width: 80, height: 80, borderRadius: 8 },
  infoContainer: { backgroundColor: "#FFF", paddingHorizontal: 20, paddingVertical: 20 },
  categoryBadge: { fontSize: 11, fontWeight: "600", color: "#2563EB", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 },
  title: { fontSize: 22, fontWeight: "700", color: "#1A1A1A", marginBottom: 12, lineHeight: 28 },
  price: { fontSize: 28, fontWeight: "700", color: "#2563EB", marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#1A1A1A", marginBottom: 12 },
  quantityContainer: { marginBottom: 24 },
  quantityControls: { flexDirection: "row", alignItems: "center", backgroundColor: "#FAFAFA", borderRadius: 12, padding: 12, gap: 20 },
  qtyButton: { width: 40, height: 40, borderRadius: 8, backgroundColor: "#FFF", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#E5E7EB" },
  qtyButtonDisabled: { opacity: 0.5 },
  qtyText: { fontSize: 18, fontWeight: "700", color: "#1A1A1A", flex: 1, textAlign: "center" },
  descriptionContainer: { marginBottom: 20 },
  descriptionText: { fontSize: 14, color: "#4B5563", lineHeight: 22 },
  bottomBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16, backgroundColor: "#FFF", borderTopWidth: 1, borderTopColor: "#EDF2F7", gap: 12 },
  bottomPriceContainer: { flex: 0.4 },
  totalPriceLabel: { fontSize: 11, fontWeight: "600", color: "#718096", marginBottom: 4, letterSpacing: 0.3 },
  totalPriceValue: { fontSize: 20, fontWeight: "700", color: "#1A1A1A" },
  addToCartButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#2563EB", paddingVertical: 14, borderRadius: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  addToCartButtonLoading: { opacity: 0.7 },
  addToCartText: { color: "#FFF", fontSize: 16, fontWeight: "700", letterSpacing: 0.3 },
  inCartButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#D1F2EB", paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, borderColor: "#10B981", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  inCartText: { color: "#10B981", fontSize: 16, fontWeight: "700", letterSpacing: 0.3 },
});