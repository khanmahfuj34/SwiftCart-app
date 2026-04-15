import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWishlist } from '../../src/context/WishlistContext';
import { useRouter } from 'expo-router';

export default function WishlistScreen() {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const router = useRouter();

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => router.push(`/product/${item.id}`)} style={styles.imageContainer}>
        <Image source={{ uri: item.images?.[0] }} style={styles.image} />
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.price}>${item.price?.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.removeBtn} onPress={() => toggleWishlist(item)}>
        <Ionicons name="trash-outline" size={20} color="#ff3b30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#1a1a1a' },
  list: { padding: 16, paddingBottom: 100 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  imageContainer: { width: 80, height: 80, borderRadius: 8, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  info: { flex: 1, marginLeft: 16 },
  title: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', marginBottom: 8 },
  price: { fontSize: 16, fontWeight: 'bold', color: '#007aff' },
  removeBtn: { padding: 8 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { marginTop: 16, fontSize: 16, color: '#888' },
});
