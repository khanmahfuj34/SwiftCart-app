import { Tabs } from 'expo-router';
import React from 'react';
import BottomNav from '../../src/components/BottomNav';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={props => <BottomNav {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="wishlist" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
