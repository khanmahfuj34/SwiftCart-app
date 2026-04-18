import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function RecentOrderCard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Recent Purchase</Text>
        <TouchableOpacity onPress={() => router.push('/orders')}>
          <Text style={styles.viewAllBtn}>VIEW ALL</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/orders/SWC-9021')}>
        <View style={styles.imageContainer}>
          <Ionicons name="image" size={32} color="#CBD5E0" />
        </View>
        
        <View style={styles.details}>
          <Text style={styles.productName}>Cashmere Overcoat</Text>
          <Text style={styles.status}>Delivered • Jan 12, 2024</Text>
          <View style={styles.orderIdRow}>
            <View style={styles.dot} />
            <Text style={styles.orderId}>ORDER #SWC-9021</Text>
          </View>
        </View>
        
        <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  viewAllBtn: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A5568',
    letterSpacing: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FA',
    borderRadius: 24,
    padding: 16,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EDF2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  details: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 6,
  },
  orderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3182CE',
    marginRight: 6,
  },
  orderId: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4A5568',
    letterSpacing: 0.5,
  },
});
