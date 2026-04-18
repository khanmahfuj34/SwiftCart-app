import { Ionicons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { BorderRadius, Shadows, Spacing } from "../constants/theme";
import { PremiumButton } from "../src/components/ui";
import { productAPI } from "../src/services/api";

const { width, height } = Dimensions.get("window");

// Decorative floating dots
const DecorativeDots = ({ logoAnim }: { logoAnim: any }) => {
  return (
    <>
      <Animated.View
        style={[
          {
            position: "absolute",
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#DDEFFD",
            left: 20,
            top: 40,
            opacity: logoAnim,
          },
        ]}
      />
      <Animated.View
        style={[
          {
            position: "absolute",
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: "#FCD34D",
            right: 40,
            top: 20,
            opacity: logoAnim,
          },
        ]}
      />
    </>
  );
};

// Overlapping Product Card Component
const OverlapCard = ({
  title,
  subtitle,
  icon,
  image,
  badge,
  position,
  delay,
}: {
  title: string;
  subtitle: string;
  icon?: string;
  image?: string;
  badge?: { text: string; color: string };
  position: { top: number; left: number; zIndex: number; width: number };
  delay: number;
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating animation with staggered delay
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: 2400,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 2400,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }, delay);

    // Rotation drift
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }, delay);
  }, [delay]);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -16],
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "2deg"],
  });

  return (
    <Animated.View
      style={[
        styles.overlapCard,
        {
          top: position.top,
          left: position.left,
          zIndex: position.zIndex,
          width: position.width,
          transform: [{ translateY }, { rotate }],
        },
      ]}
    >
      <View style={styles.cardContent}>
        {badge && (
          <View style={[styles.badge, { backgroundColor: badge.color }]}>
            <Text style={styles.badgeText}>{badge.text}</Text>
          </View>
        )}

        {/* Product Image Section */}
        {image ? (
          <ExpoImage
            source={{ uri: image }}
            style={styles.productImage}
            contentFit="cover"
          />
        ) : (
          <LinearGradient
            colors={["#1E3C72", "#2A5298"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.imageSection}
          >
            {icon && <Ionicons name={icon as any} size={48} color="#FFF" />}
          </LinearGradient>
        )}

        <View style={styles.cardTextSection}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default function OnboardingScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);

  // Animations
  const logoAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;
  const cardsAnim = useRef(new Animated.Value(0)).current;
  const descAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await productAPI.getAllProducts(4);
        setProducts(allProducts.slice(0, 4)); // Get first 4 products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Main entrance animations
    Animated.sequence([
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(taglineAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(cardsAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(descAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Logo pulse glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const handleGetStarted = () => {
    router.push("/login");
  };

  const handleSignIn = () => {
    router.push("/login");
  };

  return (
    <LinearGradient
      colors={["#F5F7FA", "#E8ECEF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.5, y: 1.5 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section with floating dots */}
          <Animated.View
            style={[
              styles.logoSection,
              {
                opacity: logoAnim,
                transform: [
                  {
                    scale: logoAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <DecorativeDots logoAnim={logoAnim} />

            <Animated.View
              style={[
                styles.logoContainer,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <View style={styles.logoBg}>
                <Ionicons name="bag-check" size={44} color="#FFFFFF" />
              </View>
            </Animated.View>
          </Animated.View>

          {/* Title Section */}
          <Animated.View
            style={[
              styles.titleSection,
              {
                opacity: titleAnim,
                transform: [
                  {
                    translateY: titleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.brandTitle}>SWIFTCART</Text>
          </Animated.View>

          {/* Tagline */}
          <Animated.View
            style={[
              styles.taglineSection,
              {
                opacity: taglineAnim,
                transform: [
                  {
                    translateY: taglineAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [15, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.tagline}>SHOP SMART. LIVE BETTER.</Text>
          </Animated.View>

          {/* Overlapping Product Cards */}
          <Animated.View
            style={[
              styles.overlapCardsContainer,
              {
                opacity: cardsAnim,
                transform: [
                  {
                    scale: cardsAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            {products.length > 0 ? (
              <>
                {products.map((product, index) => {
                  const positions = [
                    { top: 30, left: 60, zIndex: 4, width: 140 },
                    { top: 160, left: 170, zIndex: 3, width: 140 },
                    { top: 290, left: 20, zIndex: 2, width: 140 },
                    { top: 380, left: 170, zIndex: 1, width: 140 },
                  ];

                  const badges = [
                    { text: "NEW", color: "#0F172A" },
                    { text: "EXCLUSIVE", color: "#0F172A" },
                    { text: "TRENDING", color: "#0F172A" },
                    { text: "BEST", color: "#0F172A" },
                  ];

                  const subtitles = [
                    "Premium Quality ✨",
                    "Exclusive 🔵",
                    "Fast Delivery ⚡",
                    "SECURE PAYMENT 🔒",
                  ];

                  const icons = ["bag", "bag-handle", "cube", "card"];

                  return (
                    <OverlapCard
                      key={product.id}
                      title={product.title?.substring(0, 18) || "Product"}
                      subtitle={subtitles[index]}
                      icon={icons[index]}
                      image={
                        product.images?.[0] ||
                        product.image ||
                        "https://via.placeholder.com/300"
                      }
                      badge={badges[index]}
                      position={positions[index]}
                      delay={index * 150}
                    />
                  );
                })}
              </>
            ) : (
              <>
                {/* Fallback cards while loading */}
                <OverlapCard
                  title="Elite Runner X"
                  subtitle="Premium Quality ✨"
                  icon="shoe"
                  image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop"
                  badge={{ text: "NEW", color: "#0F172A" }}
                  position={{ top: 30, left: 60, zIndex: 4, width: 140 }}
                  delay={0}
                />

                <OverlapCard
                  title="Aurelius Tote"
                  subtitle="Exclusive 🔵"
                  icon="bag-handle"
                  image="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop"
                  position={{ top: 160, left: 170, zIndex: 3, width: 140 }}
                  delay={150}
                />

                <OverlapCard
                  title="Urban Soft"
                  subtitle="Fast Delivery ⚡"
                  icon="bag"
                  image="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop"
                  position={{ top: 290, left: 20, zIndex: 2, width: 140 }}
                  delay={300}
                />

                <OverlapCard
                  title="Smart Watch"
                  subtitle="SECURE PAYMENT 🔒"
                  icon="watch"
                  image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop"
                  position={{ top: 380, left: 170, zIndex: 1, width: 140 }}
                  delay={450}
                />
              </>
            )}
          </Animated.View>

          {/* Description Section */}
          <Animated.View
            style={[
              styles.descriptionSection,
              {
                opacity: descAnim,
                transform: [
                  {
                    translateY: descAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.description}>
              Discover curated essentials, exclusive deals, and fast doorstep
              delivery — all in one seamless shopping experience.
            </Text>
          </Animated.View>

          {/* Get Started Button */}
          <Animated.View
            style={[
              styles.buttonSection,
              {
                opacity: buttonAnim,
                transform: [
                  {
                    translateY: buttonAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <PremiumButton
              title="Get Started"
              onPress={handleGetStarted}
              variant="primary"
              size="lg"
              fullWidth
            />
          </Animated.View>

          {/* Sign In Link */}
          <View style={styles.signInSection}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleSignIn}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Dot Indicators */}
          <View style={styles.dotsContainer}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    position: "relative",
  },
  logoContainer: {
    alignItems: "center",
  },
  logoBg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.xl,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: 1.2,
  },
  taglineSection: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  tagline: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
    letterSpacing: 1.5,
  },
  overlapCardsContainer: {
    position: "relative",
    height: 520,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
  },
  overlapCard: {
    position: "absolute",
    borderRadius: BorderRadius.lg,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    ...Shadows.lg,
  },
  cardContent: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  imageSection: {
    width: 100,
    height: 80,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  productImage: {
    width: 100,
    height: 80,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  cardTextSection: {
    alignItems: "center",
    width: "100%",
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 10,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
  },
  descriptionSection: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  description: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 21,
    fontWeight: "500",
  },
  buttonSection: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
  },
  signInSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  signInText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  signInLink: {
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "700",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
  },
  dotActive: {
    backgroundColor: "#0F172A",
    width: 24,
  },
});
