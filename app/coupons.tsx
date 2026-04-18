import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { BorderRadius, Shadows, Spacing } from "../constants/theme";

interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  minPurchase: number;
  expiryDate: string;
  description: string;
  used: boolean;
}

export default function CouponsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const db = getFirestore();
      const couponsRef = collection(db, "coupons");
      const q = query(couponsRef);
      const snapshot = await getDocs(q);

      const couponsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Coupon[];

      setCoupons(couponsData);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = (couponCode: string) => {
    setAppliedCoupon(couponCode);
  };

  const renderCouponCard = ({ item }: { item: Coupon }) => {
    const isApplied = appliedCoupon === item.code;

    return (
      <TouchableOpacity
        onPress={() => handleApplyCoupon(item.code)}
        style={[
          styles.couponCard,
          {
            backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF",
            borderColor: isApplied ? "#0F172A" : "#E5E7EB",
            borderWidth: isApplied ? 2 : 1,
          },
        ]}
      >
        <LinearGradient
          colors={["#E0E7FF", "#F3E8FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.discountBadge}
        >
          <Text style={styles.discountText}>
            {item.type === "percentage"
              ? item.discount + "%"
              : "$" + item.discount}
          </Text>
          <Text style={styles.discountLabel}>OFF</Text>
        </LinearGradient>

        <View style={styles.couponDetails}>
          <Text
            style={[
              styles.couponCode,
              { color: isDark ? "#FFFFFF" : "#0F172A" },
            ]}
          >
            {item.code}
          </Text>
          <Text
            style={[
              styles.couponDescription,
              { color: isDark ? "#AAAAAA" : "#6B7280" },
            ]}
            numberOfLines={2}
          >
            {item.description}
          </Text>
          <Text style={styles.couponMeta}>
            Min purchase: ${item.minPurchase}
          </Text>
        </View>

        <View style={styles.couponAction}>
          {isApplied ? (
            <View style={styles.appliedBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={styles.appliedText}>Applied</Text>
            </View>
          ) : (
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#0F0F0F" : "#FFFFFF" },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={isDark ? "#FFFFFF" : "#0F172A"}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            { color: isDark ? "#FFFFFF" : "#0F172A" },
          ]}
        >
          Coupons & Offers
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0F172A" />
        </View>
      ) : coupons.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="ticket-outline" size={80} color="#D1D5DB" />
          <Text
            style={[
              styles.emptyText,
              { color: isDark ? "#AAAAAA" : "#6B7280" },
            ]}
          >
            No coupons available
          </Text>
        </View>
      ) : (
        <FlatList
          data={coupons}
          renderItem={renderCouponCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {appliedCoupon && (
        <View style={styles.bottomInfo}>
          <Text style={styles.appliedInfoText}>
            Coupon {appliedCoupon} applied successfully!
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  couponCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  discountBadge: {
    width: 70,
    height: 70,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  discountText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  discountLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#0F172A",
  },
  couponDetails: {
    flex: 1,
  },
  couponCode: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  couponDescription: {
    fontSize: 12,
    fontWeight: "400",
    marginBottom: 4,
  },
  couponMeta: {
    fontSize: 10,
    fontWeight: "500",
    color: "#9CA3AF",
  },
  couponAction: {
    marginLeft: Spacing.md,
  },
  appliedBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  appliedText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#10B981",
    marginLeft: Spacing.xs,
  },
  bottomInfo: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#DBEAFE",
  },
  appliedInfoText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0369A1",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: Spacing.md,
  },
});
