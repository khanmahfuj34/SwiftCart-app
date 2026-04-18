import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCart } from "../../src/context/CartContext";
import { useWishlist } from "../../src/context/WishlistContext";

const { height } = Dimensions.get("window");

export default function WishlistScreen() {
  const insets = useSafeAreaInsets();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const openModal = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleAddToCart = () => {
    if (selectedItem) {
      const cartItem = {
        ...selectedItem,
        quantity,
      };
      addToCart(cartItem);
      toggleWishlist(selectedItem);
      closeModal();
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const imageUrl = item.image || "";
    const fallbackImage = "https://via.placeholder.com/80?text=No+Image";

    return (
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() => router.push(`/product/${item.id}`)}
          style={styles.imageContainer}
        >
          {imageUrl && imageUrl.length > 0 ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              onError={() => (
                <Image source={{ uri: fallbackImage }} style={styles.image} />
              )}
            />
          ) : (
            <Image source={{ uri: fallbackImage }} style={styles.image} />
          )}
        </TouchableOpacity>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.price}>${item.price?.toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.addToCartBtn}
            onPress={() => openModal(item)}
          >
            <Ionicons name="bag-add" size={16} color="#FFFFFF" />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => toggleWishlist(item)}
        >
          <Ionicons name="trash-outline" size={20} color="#ff3b30" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Wishlist</Text>
      </View>

      {wishlistItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Your wishlist is empty</Text>
        </View>
      ) : (
        <FlatList
          data={wishlistItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Add to Cart Bottom Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={closeModal}
            style={styles.overlayTouch}
          />
          <Animated.View style={[styles.modalContent]}>
            {selectedItem && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add to Cart</Text>
                  <TouchableOpacity onPress={closeModal}>
                    <Ionicons name="close" size={24} color="#1A1A1A" />
                  </TouchableOpacity>
                </View>

                <View style={styles.itemPreview}>
                  <Image
                    source={{
                      uri:
                        selectedItem.image ||
                        "https://via.placeholder.com/100?text=No+Image",
                    }}
                    style={styles.previewImage}
                  />
                  <View style={styles.previewInfo}>
                    <Text style={styles.previewTitle}>
                      {selectedItem.title}
                    </Text>
                    <Text style={styles.previewPrice}>
                      ${selectedItem.price?.toFixed(2)}
                    </Text>
                  </View>
                </View>

                {/* Quantity Selector */}
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Quantity</Text>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.quantityBtn}
                      onPress={() => quantity > 1 && setQuantity(quantity - 1)}
                    >
                      <Ionicons name="remove" size={20} color="#1A1A1A" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityBtn}
                      onPress={() => setQuantity(quantity + 1)}
                    >
                      <Ionicons name="add" size={20} color="#1A1A1A" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Confirm Button */}
                <TouchableOpacity
                  style={styles.confirmBtn}
                  onPress={handleAddToCart}
                >
                  <Ionicons name="bag-check" size={20} color="#FFFFFF" />
                  <Text style={styles.confirmBtnText}>
                    Confirm & Add to Cart
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF9F6" },
  header: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
  },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#1A1A1A" },
  list: { padding: 16, paddingBottom: 100 },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%" },
  info: { flex: 1, marginLeft: 16 },
  title: { fontSize: 14, fontWeight: "600", color: "#1A1A1A", marginBottom: 4 },
  price: { fontSize: 16, fontWeight: "700", color: "#1A1A1A", marginBottom: 8 },
  addToCartBtn: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  addToCartText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 6,
  },
  removeBtn: { padding: 8 },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  overlayTouch: { flex: 1 },
  modalContent: {
    backgroundColor: "#FAF9F6",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: height * 0.85,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "700", color: "#1A1A1A" },

  itemPreview: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 24,
    alignItems: "center",
  },
  previewImage: { width: 60, height: 60, borderRadius: 12 },
  previewInfo: { marginLeft: 12, flex: 1 },
  previewTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  previewPrice: { fontSize: 15, fontWeight: "700", color: "#1A1A1A" },

  section: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },

  // Quantity Styles
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 8,
  },
  quantityBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#EDF2F7",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginHorizontal: 16,
    minWidth: 30,
    textAlign: "center",
  },

  // Confirm Button
  confirmBtn: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 10,
  },

  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { marginTop: 16, fontSize: 16, color: "#888" },
});
