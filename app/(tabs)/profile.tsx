import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../src/context/AuthContext";
import { useOrders } from "../../src/context/OrdersContext";
import { useUser } from "../../src/context/UserContext";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout, loading: authLoading } = useAuth();
  const { profile, loading: userLoading } = useUser();
  const { orders } = useOrders();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [user, authLoading]);

  if (authLoading || userLoading || !user) {
    return (
      <SafeAreaView
        style={[styles.loadingContainer, { paddingTop: insets.top }]}
      >
        <ActivityIndicator size="large" color="#1A1A1A" />
      </SafeAreaView>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Get latest order
  const latestOrder = orders && orders.length > 0 ? orders[0] : null;
  const latestItem = latestOrder?.items?.[0] || null;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate?.() || new Date(timestamp);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const menuItems = [
    { id: 1, icon: "bag-outline", label: "My Orders", route: "/orders" },
    { id: 2, icon: "location-outline", label: "Addresses", route: "/address" },
    {
      id: 3,
      icon: "heart-outline",
      label: "Wishlist",
      route: "/(tabs)/wishlist",
    },
    { id: 4, icon: "help-circle-outline", label: "Help & Support", route: "#" },
  ];

  const renderMenuItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => {
        if (item.route !== "#") {
          router.push(item.route);
        }
      }}
      style={styles.menuItem}
    >
      <View style={styles.menuIconCircle}>
        <Ionicons name={item.icon} size={22} color="#1A1A1A" />
      </View>
      <Text style={styles.menuLabel}>{item.label}</Text>
      <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarSection}>
            <Image
              source={{
                uri:
                  profile?.photoURL ||
                  user?.photoURL ||
                  "https://i.pravatar.cc/150?img=5",
              }}
              style={styles.avatar}
            />
            <TouchableOpacity
              onPress={() => router.push("/profile/edit")}
              style={styles.editAvatarBtn}
            >
              <Ionicons name="pencil" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {profile?.name || user?.displayName || "User"}
            </Text>
            <Text style={styles.profileEmail}>{user?.email || ""}</Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/profile/edit")}
            style={styles.editBtn}
          >
            <Ionicons name="create-outline" size={18} color="#1A1A1A" />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{orders?.length || 0}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>\</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
        </View>

        {/* Recent Purchase */}
        {latestItem && (
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Purchase</Text>
              <TouchableOpacity onPress={() => router.push("/orders")}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/orders")}
              style={styles.recentCard}
            >
              {latestItem.image && (
                <Image
                  source={{ uri: latestItem.image }}
                  style={styles.recentImage}
                />
              )}

              <View style={styles.recentInfo}>
                <Text style={styles.recentTitle} numberOfLines={2}>
                  {latestItem.title}
                </Text>
                <Text style={styles.recentDate}>
                  {formatDate(latestOrder.createdAt)}
                </Text>
                <View style={styles.recentFooter}>
                  <View
                    style={[
                      styles.statusBadge,
                      latestOrder.status === "Delivered"
                        ? styles.statusDelivered
                        : styles.statusPending,
                    ]}
                  >
                    <Text style={styles.statusText}>{latestOrder.status}</Text>
                  </View>
                  <Text style={styles.recentPrice}>\</Text>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
            </TouchableOpacity>
          </View>
        )}

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Settings & Info</Text>
          <FlatList
            data={menuItems}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.menuList}
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
          <Text style={styles.logoutBtnText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAF9F6",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAF9F6",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EDF2F7",
  },
  avatarSection: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 12,
    color: "#718096",
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F7FAFC",
    borderRadius: 12,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EDF2F7",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#718096",
    fontWeight: "500",
  },
  recentSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  viewAllText: {
    fontSize: 12,
    color: "#718096",
    fontWeight: "500",
  },
  recentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#EDF2F7",
    gap: 12,
  },
  recentImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  recentInfo: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  recentDate: {
    fontSize: 11,
    color: "#718096",
    marginBottom: 8,
  },
  recentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusDelivered: {
    backgroundColor: "#E0FFE0",
  },
  statusPending: {
    backgroundColor: "#FFF4E0",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  recentPrice: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  menuSection: {
    marginBottom: 20,
  },
  menuSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  menuList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EDF2F7",
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
  },
  menuIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F7FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    backgroundColor: "#EF4444",
    borderRadius: 16,
    marginBottom: 16,
  },
  logoutBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
