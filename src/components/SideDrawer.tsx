import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import {
    Animated,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { BorderRadius, Colors, Shadows, Spacing } from "../../constants/theme";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useProfile } from "../context/ProfileContext";
import { useWishlist } from "../context/WishlistContext";

interface DrawerMenuItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

interface DrawerSection {
  title: string;
  items: DrawerMenuItem[];
}

interface SideDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ visible, onClose }) => {
  const router = useRouter();
  const { logout, user: authUser } = useAuth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { profile, notificationsCount } = useProfile();
  const colorScheme = useColorScheme();
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const [activeRoute, setActiveRoute] = React.useState("");

  // Calculate dynamic badge counts
  const cartCount =
    cartItems?.reduce(
      (total: number, item: any) => total + (item.quantity || 0),
      0,
    ) || 0;

  const wishlistCount = wishlistItems?.length || 0;

  // Get user info from auth and profile
  const userName =
    authUser?.displayName || authUser?.email?.split("@")[0] || "User";
  const userEmail = authUser?.email || "user@example.com";
  const userPhoto = authUser?.photoURL || profile?.photoURL;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 280,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleNavigation = (route: string) => {
    setActiveRoute(route);
    router.push(route as any);
    setTimeout(() => onClose(), 100);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
      onClose();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Menu sections with dynamic badges
  const menuSections: DrawerSection[] = [
    {
      title: "👤 ACCOUNT",
      items: [
        { label: "My Profile", icon: "person-circle", route: "/profile/edit" },
        { label: "My Orders", icon: "receipt", route: "/orders" },
        {
          label: "Wishlist",
          icon: "heart",
          route: "/(tabs)/wishlist",
          badge: wishlistCount > 0 ? wishlistCount : undefined,
        },
        { label: "Saved Addresses", icon: "location", route: "/address" },
      ],
    },
    {
      title: "🛍️ SHOPPING",
      items: [
        { label: "Home", icon: "home", route: "/(tabs)" },
        { label: "New Arrivals", icon: "sparkles", route: "/new-arrivals" },
        { label: "Trending Products", icon: "trending-up", route: "/trending" },
        { label: "Flash Sale / Offers", icon: "pricetag", route: "/offers" },
        {
          label: "Cart",
          icon: "cart",
          route: "/cart",
          badge: cartCount > 0 ? cartCount : undefined,
        },
      ],
    },
    {
      title: "💳 SERVICES",
      items: [
        { label: "Track Order", icon: "map", route: "/orders/[id]" },
        { label: "Coupons & Offers", icon: "ticket", route: "/coupons" },
        {
          label: "Notifications",
          icon: "notifications",
          route: "/notifications",
          badge: notificationsCount > 0 ? notificationsCount : undefined,
        },
      ],
    },
    {
      title: "⚙️ SETTINGS",
      items: [
        { label: "Language", icon: "language", route: "/language" },
        { label: "Privacy Policy", icon: "shield", route: "/privacy" },
        { label: "Help & Support", icon: "help-circle", route: "/help" },
        {
          label: "About SwiftCart",
          icon: "information-circle",
          route: "/about",
        },
      ],
    },
  ];

  const isDark = colorScheme === "dark";

  return (
    <>
      {/* Overlay */}
      {visible && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={onClose}
          activeOpacity={1}
        />
      )}

      {/* Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX: slideAnim }],
            backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF",
          },
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            scrollIndicatorInsets={{ right: 1 }}
          >
            {/* Close Button */}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons
                name="close"
                size={26}
                color={isDark ? "#FFFFFF" : Colors.accent}
              />
            </TouchableOpacity>

            {/* User Profile Header */}
            <View
              style={[
                styles.profileHeader,
                { borderBottomColor: isDark ? "#2A2A2A" : Colors.border },
              ]}
            >
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: isDark
                      ? "#2A2A2A"
                      : Colors.background.softBlue,
                  },
                ]}
              >
                {userPhoto ? (
                  <Image
                    source={{ uri: userPhoto }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Ionicons
                    name="person-circle"
                    size={56}
                    color={isDark ? "#666" : Colors.accent}
                  />
                )}
              </View>
              <View style={styles.userInfo}>
                <Text
                  style={[
                    styles.userName,
                    { color: isDark ? "#FFFFFF" : Colors.text.primary },
                  ]}
                  numberOfLines={1}
                >
                  {userName}
                </Text>
                <Text
                  style={[
                    styles.userEmail,
                    { color: isDark ? "#999" : Colors.text.secondary },
                  ]}
                  numberOfLines={1}
                >
                  {userEmail}
                </Text>
              </View>
            </View>

            {/* Menu Sections */}
            {menuSections.map((section, sectionIndex) => (
              <View key={sectionIndex} style={styles.section}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: isDark ? "#888" : Colors.text.muted },
                  ]}
                >
                  {section.title}
                </Text>
                {section.items.map((item, itemIndex) => {
                  const isActive = activeRoute === item.route;

                  return (
                    <TouchableOpacity
                      key={itemIndex}
                      onPress={() => handleNavigation(item.route)}
                      style={[
                        styles.menuItem,
                        isActive && styles.menuItemActive,
                        {
                          backgroundColor: isActive
                            ? isDark
                              ? "#2A2A2A"
                              : Colors.background.lighter
                            : "transparent",
                        },
                      ]}
                    >
                      <View style={styles.menuItemLeft}>
                        <Ionicons
                          name={item.icon as any}
                          size={22}
                          color={
                            isActive
                              ? Colors.accent
                              : isDark
                                ? "#999"
                                : Colors.text.secondary
                          }
                        />
                        <Text
                          style={[
                            styles.menuLabel,
                            {
                              color: isActive
                                ? Colors.accent
                                : isDark
                                  ? "#E5E5E5"
                                  : Colors.text.primary,
                              fontWeight: isActive ? "700" : "500",
                            },
                          ]}
                        >
                          {item.label}
                        </Text>
                      </View>
                      {item.badge ? (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{item.badge}</Text>
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}

            <View style={{ height: Spacing.lg }} />
          </ScrollView>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            style={[
              styles.logoutButton,
              { borderTopColor: isDark ? "#2A2A2A" : Colors.border },
            ]}
          >
            <Ionicons name="log-out" size={22} color="#DC2626" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    zIndex: 98,
  },
  drawer: Platform.select({
    web: {
      position: "absolute",
      top: 0,
      left: 0,
      width: 280,
      height: "100%",
      zIndex: 99,
      boxShadow: "0 12px 24px rgba(15, 23, 42, 0.15)",
    },
    default: {
      position: "absolute",
      top: 0,
      left: 0,
      width: 280,
      height: "100%",
      zIndex: 99,
      ...Shadows.xl,
    },
  }) as any,
  safeArea: {
    flex: 1,
    flexDirection: "column",
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  closeButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    marginLeft: -Spacing.md,
    alignSelf: "flex-start",
    marginBottom: Spacing.sm,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    resizeMode: "cover",
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  userEmail: {
    fontSize: 12,
    fontWeight: "400",
    letterSpacing: 0.1,
  },
  section: {
    marginVertical: Spacing.md,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: Spacing.md,
    marginLeft: Spacing.sm,
    textTransform: "uppercase",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xs,
  },
  menuItemActive: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
    paddingLeft: Spacing.md - 2,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: Spacing.md,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  badge: {
    backgroundColor: "#DC2626",
    borderRadius: 10,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: Spacing.sm,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderTopWidth: 1,
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  logoutText: {
    color: "#DC2626",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});

export default SideDrawer;
