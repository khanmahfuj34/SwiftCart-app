import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BottomNav = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName = 'home';
          if (route.name === 'index') iconName = isFocused ? 'home' : 'home-outline';
          if (route.name === 'wishlist') iconName = isFocused ? 'heart' : 'heart-outline';
          if (route.name === 'profile') iconName = isFocused ? 'person' : 'person-outline';

          if (route.name !== 'index' && route.name !== 'wishlist' && route.name !== 'profile') return null;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.navItem}
            >
              <Ionicons name={iconName} size={24} color={isFocused ? "#007aff" : "#888"} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    left: 40,
    right: 40,
    alignItems: 'center',
    zIndex: 100,
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    height: 60,
    width: '100%',
    borderRadius: 30,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  }
});

export default BottomNav;
