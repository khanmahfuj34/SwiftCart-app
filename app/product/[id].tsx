import React, { useEffect, useState, useRef } from "react";
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Animated
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { productAPI } from "../../src/services/api";
import { useCart } from "../../src/context/CartContext";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Animation reference for smooth image transitions
  const fadeAnim = useRef(new Animated.Value(1)).current;

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
    
    // Smooth transition between images
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

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      Alert.alert("Success", `${quantity} item(s) added to your cart!`);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={styles.loadingText}>Loading details...</Text>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#ff3b30" />
        <Text style={styles.errorText}>{error || "Product not found"}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const categoryName = product.category?.name || 'Unknown';
  const totalPrice = (product.price * quantity).toFixed(2);
  const productImages = product.images || [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <TouchableOpacity style={styles.headerIconButton} onPress={() => router.push("/cart")}>
          <Ionicons name="cart-outline" size={24} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.imageCard}>
          <Animated.Image
            source={{ uri: selectedImage || 'https://via.placeholder.com/400' }}
            style={[styles.mainProductImage, { opacity: fadeAnim }]}
            resizeMode="cover"
          />
          
          {/* Thumbnails Section */}
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
                      isSelected && styles.thumbnailSelected
                    ]}
                  >
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
          <Text style={styles.price}>${product.price?.toFixed(2)}</Text>

          {/* Quantity Selector */}
          <View style={styles.quantityContainer}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                style={[styles.qtyButton, quantity === 1 && styles.qtyButtonDisabled]} 
                onPress={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity === 1}
              >
                <Ionicons name="remove" size={20} color={quantity === 1 ? "#ccc" : "#1a1a1a"} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity 
                style={styles.qtyButton} 
                onPress={() => setQuantity(q => q + 1)}
              >
                <Ionicons name="add" size={20} color="#1a1a1a" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceContainer}>
          <Text style={styles.totalPriceLabel}>Total</Text>
          <Text style={styles.totalPriceValue}>${totalPrice}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Ionicons name="cart" size={20} color="#fff" />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 18,
    color: "#333",
    textAlign: "center",
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#007aff",
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  headerIconButton: {
    padding: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  imageCard: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    marginBottom: 24,
    paddingBottom: 20,
  },
  mainProductImage: {
    width: "100%",
    height: 320,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: "#f5f5f5",
  },
  thumbnailContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  thumbnailWrapper: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
    marginRight: 12,
    backgroundColor: "#f5f5f5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnailSelected: {
    borderColor: "#007aff",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  infoContainer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#e8f0fe",
    color: "#007aff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a1a1a",
    lineHeight: 32,
    marginBottom: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007aff",
    marginBottom: 24,
  },
  quantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    paddingHorizontal: 6,
  },
  qtyButton: {
    padding: 10,
  },
  qtyButtonDisabled: {
    opacity: 0.4,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: "700",
    marginHorizontal: 16,
    color: "#1a1a1a",
  },
  descriptionContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  descriptionText: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 26,
    color: "#4a4a4a",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 18,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  bottomPriceContainer: {
    flex: 1,
  },
  totalPriceLabel: {
    fontSize: 13,
    color: "#888",
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  totalPriceValue: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1a1a1a",
  },
  actionButtons: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-end",
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007aff",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#007aff",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  addToCartText: {
    marginLeft: 8,
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});
