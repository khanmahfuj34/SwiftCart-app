import React from 'react';
import { ScrollView, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const getCategoryIcon = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes('cloth') || lower.includes('shirt')) return 'shirt';
  if (lower.includes('electronic') || lower.includes('tech')) return 'hardware-chip';
  if (lower.includes('furniture')) return 'bed';
  if (lower.includes('shoe')) return 'footsteps';
  return 'pricetag';
};

const colors = ["#eef2ff", "#f0fdf4", "#fffbeb", "#fef2f2"];

const CategoryList = ({ categories, activeCategory, onSelectCategory }) => {
  const cats = [{ id: 'all', name: 'All' }, ...categories];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {cats.map((cat, idx) => {
        const isActive = activeCategory === (cat.name === 'All' ? null : cat.id);
        const iconColor = isActive ? '#fff' : '#444';
        const bgColor = isActive ? '#007aff' : colors[idx % 4];

        return (
          <TouchableOpacity 
            key={cat.id || idx} 
            style={styles.item}
            onPress={() => onSelectCategory(cat.name === 'All' ? null : cat.id)}
          >
            <View style={[styles.circle, { backgroundColor: bgColor }]}>
              {cat.name === 'All' ? (
                <Ionicons name="apps" size={22} color={iconColor} />
              ) : (
                <Ionicons name={getCategoryIcon(cat.name)} size={22} color={iconColor} />
              )}
            </View>
            <Text style={[styles.text, isActive && styles.activeText]} numberOfLines={1}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 20,
  },
  item: {
    alignItems: 'center',
    width: 65,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontSize: 12,
    color: '#444',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeText: {
    color: '#007aff',
    fontWeight: '700',
  }
});

export default React.memo(CategoryList);
