import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useProducts } from '../../src/hooks/useProducts';
import { useCart } from '../../src/context/CartContext';
import SearchBar from '../../src/components/SearchBar';
import CategoryList from '../../src/components/CategoryList';
import ProductGrid from '../../src/components/ProductGrid';

export default function HomeScreen() {
  const router = useRouter();
  const { products, categories, loading } = useProducts();
  const { cartItems, addToCart } = useCart();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const totalItems = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);

  // Filter products based on search and category
  const filteredProducts = products.filter((p: any) => {
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory ? p.category?.id === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  const heroProducts = filteredProducts.slice(0, 3);
  const trendingProducts = filteredProducts.slice(3, 9);
  const curatedProducts = filteredProducts.slice(9, 17);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu-outline" size={28} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>The Curator</Text>
        <TouchableOpacity style={styles.cartButton} onPress={() => router.push('/cart')}>
          <Ionicons name="cart-outline" size={26} color="#1a1a1a" />
          {totalItems > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{totalItems > 99 ? '99+' : totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        <CategoryList 
          categories={categories} 
          activeCategory={activeCategory} 
          onSelectCategory={setActiveCategory} 
        />

        {/* Hero Carousel */}
        {heroProducts.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.heroScroll}>
            {heroProducts.map((p: any) => (
              <TouchableOpacity 
                key={p.id} 
                style={styles.heroCard}
                activeOpacity={0.9}
                onPress={() => router.push(`/product/${p.id}`)}
              >
                <Image source={{ uri: p.images?.[0] }} style={styles.heroImage} />
                <View style={styles.heroOverlay}>
                  <Text style={styles.heroLabel}>NEW ARRIVALS</Text>
                  <Text style={styles.heroCardTitle} numberOfLines={2}>{p.title}</Text>
                  <View style={styles.heroBtn}>
                    <Text style={styles.heroBtnText}>Explore Now</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Trending Now */}
        {trendingProducts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Trending Now</Text>
              <TouchableOpacity onPress={() => router.push("/products")}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <ProductGrid products={trendingProducts} isLoading={loading} />
          </View>
        )}

        {/* Curated For You */}
        {curatedProducts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Curated For You</Text>
            </View>
            {curatedProducts.map((product: any) => (
              <TouchableOpacity 
                key={product.id}
                style={styles.curatedCard}
                onPress={() => router.push(`/product/${product.id}`)}
                activeOpacity={0.9}
              >
                <View style={styles.curatedImageContainer}>
                  <Image source={{ uri: product.images?.[0] }} style={styles.curatedImage} resizeMode="cover" />
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    <Ionicons name="add" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
                <View style={{ paddingHorizontal: 10 }}>
                    <Text style={styles.catLabel} numberOfLines={1}>{product.category?.name}</Text>
                    <Text style={styles.productTitle} numberOfLines={1}>{product.title}</Text>
                    <Text style={styles.productPrice}>${product.price?.toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  menuButton: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', letterSpacing: -0.5 },
  cartButton: { position: 'relative', padding: 4 },
  badgeContainer: { position: 'absolute', top: -2, right: -4, backgroundColor: '#1a1a1a', borderRadius: 10, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  heroScroll: { paddingHorizontal: 10, paddingBottom: 24 },
  heroCard: { width: 300, height: 380, borderRadius: 24, marginHorizontal: 10, overflow: 'hidden', position: 'relative', backgroundColor: '#eaeaea', elevation: 6, shadowColor: '#000', shadowOpacity: 0.15, shadowOffset: { width: 0, height: 6 }, shadowRadius: 10 },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, backgroundColor: 'rgba(0,0,0,0.4)', height: '100%', justifyContent: 'flex-end' },
  heroLabel: { color: '#fff', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 8 },
  heroCardTitle: { color: '#fff', fontSize: 26, fontWeight: '700', lineHeight: 32, marginBottom: 20 },
  heroBtn: { backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 24, alignSelf: 'flex-start' },
  heroBtnText: { color: '#1a1a1a', fontSize: 13, fontWeight: '600' },
  section: { marginBottom: 20, paddingHorizontal: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 10, marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a1a' },
  viewAllText: { fontSize: 13, color: '#5c5c5c', fontWeight: '600', borderBottomWidth: 1, borderBottomColor: '#aaaaaa' },
  curatedCard: { width: '100%', marginBottom: 24, paddingHorizontal: 10 },
  curatedImageContainer: { width: '100%', height: 200, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', marginBottom: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10 },
  curatedImage: { width: '100%', height: '100%' },
  addButton: { position: 'absolute', bottom: 10, right: 10, backgroundColor: '#3b4352', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  catLabel: { fontSize: 10, color: '#888', textTransform: 'uppercase', fontWeight: '600', letterSpacing: 0.5, marginBottom: 4 },
  productTitle: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', marginBottom: 4 },
  productPrice: { fontSize: 15, color: '#1a1a1a', fontWeight: '700' }
});
