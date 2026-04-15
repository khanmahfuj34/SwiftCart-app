import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../src/context/CartContext';
import { useWishlist } from '../../src/context/WishlistContext';

const ProductCard = ({ product }) => {
    const router = useRouter();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    if (!product) return null;

    const imageUrl = product.images?.[0] || 'https://via.placeholder.com/150';
    const categoryName = product.category?.name || 'Unknown';
    const isWished = isInWishlist(product.id);

    return (
        <View style={styles.card}>
            <TouchableOpacity 
              activeOpacity={0.9} 
              onPress={() => router.push(`/product/${product.id}`)}
              style={styles.imageContainer}
            >
              <Image
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
              />
              <TouchableOpacity 
                style={styles.wishlistIcon}
                onPress={() => toggleWishlist(product)}
              >
                <Ionicons name={isWished ? "heart" : "heart-outline"} size={22} color={isWished ? "#ff3b30" : "#666"} />
              </TouchableOpacity>
            </TouchableOpacity>

            <View style={styles.content}>
                <Text style={styles.category} numberOfLines={1}>{categoryName}</Text>
                <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
                <Text style={styles.price}>${product.price ? product.price.toFixed(2) : '0.00'}</Text>
                
                <View style={styles.actions}>
                    <TouchableOpacity 
                      style={styles.cartButton} 
                      onPress={() => addToCart(product)}
                    >
                        <Text style={styles.cartText}>Add to Cart</Text>
                        <Ionicons name="cart" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default memo(ProductCard);

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        width: '100%',
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 180,
        backgroundColor: '#f1f1f1',
    },
    wishlistIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 6,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    content: {
        padding: 12,
    },
    category: {
        fontSize: 12,
        color: '#888',
        textTransform: 'uppercase',
        fontWeight: '700',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 8,
        minHeight: 40,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007aff',
        marginBottom: 12,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#007aff',
        borderRadius: 8,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6
    },
    cartText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    }
});