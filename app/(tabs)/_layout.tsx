import { Tabs } from "expo-router";
import React from "react";
import BottomNav from "../../src/components/BottomNav";
import { useDrawer } from "../../src/context/DrawerContext";

export default function TabLayout() {
  const { drawerVisible } = useDrawer();

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomNav {...props} drawerVisible={drawerVisible} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="wishlist" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
