import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#ccc" />
        </View>
        <Text style={styles.name}>Guest User</Text>
        <Text style={styles.email}>guest@example.com</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#1a1a1a' },
  content: { padding: 20, alignItems: 'center', marginTop: 40 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  name: { marginTop: 20, fontSize: 22, fontWeight: '700', color: '#1a1a1a' },
  email: { marginTop: 8, fontSize: 16, color: '#888' },
});
