import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';

export default function ProfileHeader({ user, onEditProfile }) {
  const { cartItems } = useCart();
  const cartCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="menu-outline" size={28} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.appName}>SWIFTCART</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="bag-outline" size={26} color="#4A5568" />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity style={styles.settingsBtn}>
          <Ionicons name="settings" size={20} color="#4A5568" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: user?.photoURL || 'https://i.pravatar.cc/150?img=5' }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editAvatarBtn}>
            <Ionicons name="checkmark-circle" size={28} color="#5A6B8A" />
          </TouchableOpacity>
        </View>

        <Text style={styles.username}>{user?.displayName || 'Guest User'}</Text>
        <Text style={styles.email}>{user?.email || 'guest@example.com'}</Text>

        <TouchableOpacity style={styles.editBtn} onPress={onEditProfile}>
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#FAF9F6',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  },
  iconBtn: {
    padding: 8,
  },
  appName: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#1A1A1A',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#E53E3E',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FAF9F6',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  settingsBtn: {
    backgroundColor: '#EDF2F7',
    padding: 10,
    borderRadius: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 20,
  },
  editBtn: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});
