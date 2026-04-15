import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ value, onChangeText, placeholder = "Search curated collections..." }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={20} color="#888" style={styles.icon} />
      <TextInput 
        style={styles.input} 
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 24,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
  },
});

export default React.memo(SearchBar);
