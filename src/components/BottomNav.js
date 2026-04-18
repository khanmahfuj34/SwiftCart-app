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
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 120,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [drawerVisible, slideAnim, opacityAnim]);

  const tabs = [
    {
      name: "index",
      label: "Home",
      icon: "home-outline",
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
      icon: "person-circle-outline",
      iconFilled: "person-circle",
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
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <Ionicons
                  name={isFocused ? tab.iconFilled : tab.icon}
                  size={26}
                  color={isFocused ? Colors.primary : "#9CA3AF"}
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
    backgroundColor: "#1F2937",
    borderRadius: BorderRadius["2xl"],
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    ...Shadows.xl,
  },
  tab: {
    flex: 1,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: BorderRadius.lg,
    position: "relative",
  },
  tabFocused: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
  },
  tabContent: {
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.xs,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#9CA3AF",
    marginTop: Spacing.xs,
    letterSpacing: 0.3,
  },
  tabLabelFocused: {
    color: Colors.primary,
    fontWeight: "700",
    fontSize: 11,
  },
  activeIndicator: {
    position: "absolute",
    bottom: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default PremiumBottomNav;
