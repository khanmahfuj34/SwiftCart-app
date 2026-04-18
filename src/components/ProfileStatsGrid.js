import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWishlist } from '../context/WishlistContext';
import { useRouter } from 'expo-router';

export default function ProfileStatsGrid({ ordersCount = 12 }) {
  const { wishlistItems } = useWishlist();
  const wishlistCount = wishlistItems?.length || 0;
  const router = useRouter();

  const stats = [
    { id: 'orders', title: 'Orders', subtitle: `${ordersCount} items`, icon: 'cube', iconColor: '#2B4C59', bgColor: '#E8F1F5', route: '/orders' },
    { id: 'wishlist', title: 'Wishlist', subtitle: `${wishlistCount} items`, icon: 'heart', iconColor: '#5A5A8C', bgColor: '#EAEBFA', route: '/wishlist' },
    { id: 'address', title: 'Address', subtitle: '2 locations', icon: 'location', iconColor: '#4A4A4A', bgColor: '#EFEFEF', route: '/address' },
    { id: 'payment', title: 'Payment', subtitle: '3 methods', icon: 'card', iconColor: '#3A5A6D', bgColor: '#E5F1F7', route: '/payment' },
  ];

  return (
    <View style={styles.grid}>
      {stats.map((stat, index) => (
        <TouchableOpacity 
          key={stat.id} 
          style={[styles.card, index % 2 === 0 ? styles.cardMarginRight : null]}
          onPress={() => router.push(stat.route)}
        >
          <View style={[styles.iconWrapper, { backgroundColor: stat.bgColor }]}>
             <Ionicons name={stat.icon} size={24} color={stat.iconColor} />
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.title}>{stat.title}</Text>
            <Text style={styles.subtitle}>{stat.subtitle}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginTop: 10,
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 2,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#718096',
  },
});
