import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
    Animated,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { BorderRadius, Colors, Shadows, Spacing } from "../../constants/theme";

const PremiumBottomNav = ({
  state,
  descriptors,
  navigation,
  drawerVisible = false,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (drawerVisible) {
      // Hide bottom nav when drawer opens
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 120, // Slide down
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0, // Fade out
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Show bottom nav when drawer closes
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0, // Slide up
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1, // Fade in
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [drawerVisible]);

  const tabs = [
    {
      name: "index",
      label: "Home",
      icon: "home",
      iconFilled: "home",
    },
    {
      name: "wishlist",
      label: "Wishlist",
      icon: "heart-outline",
      iconFilled: "heart",
    },
    {
      name: "profile",
      label: "Profile",
      icon: "person-outline",
      iconFilled: "person",
    },
  ];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
      pointerEvents={drawerVisible ? "none" : "auto"}
    >
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => {
          const isFocused = state.index === index;
          const route = state.routes[index];

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={onPress}
              style={[styles.tab, isFocused && styles.tabFocused]}
            >
              <View style={styles.tabContent}>
                <Ionicons
                  name={isFocused ? tab.iconFilled : tab.icon}
                  size={24}
                  color={isFocused ? Colors.accent : Colors.muted}
                />
                <Text
                  style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}
                >
                  {tab.label}
                </Text>
              </View>
              {isFocused && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 24 : 16,
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 5,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius["2xl"],
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    ...Shadows.xl,
  },
  tab: {
    flex: 1,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: BorderRadius.xl,
    position: "relative",
  },
  tabFocused: {
    backgroundColor: Colors.primary,
  },
  tabContent: {
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.xs,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.muted,
    marginTop: Spacing.xs,
  },
  tabLabelFocused: {
    color: Colors.accent,
    fontWeight: "700",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.accent,
  },
});

export default PremiumBottomNav;
