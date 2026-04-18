/**
 * SwiftCart Premium Design System
 * Modern, luxury e-commerce theme with soft blues and clean whites
 */

import { Platform } from "react-native";

// Premium Color Palette
export const Colors = {
  // Primary Colors
  primary: "#DDEFFD", // Soft Sky Blue
  accent: "#0F172A", // Deep Navy
  secondary: "#FFFFFF", // Clean White

  // Secondary Colors
  lightGray: "#F7F8FA", // Light Gray Background
  muted: "#8B92A5", // Muted Gray Text
  success: "#16A34A", // Success Green
  warning: "#F59E0B", // Warning Amber
  error: "#DC2626", // Error Red

  // Text Colors
  text: {
    primary: "#0F172A",
    secondary: "#6B7280",
    muted: "#9CA3AF",
  },

  // Background Colors
  background: {
    light: "#FFFFFF",
    lighter: "#F7F8FA",
    softBlue: "#F0F6FF",
    softerBlue: "#F8FAFB",
  },

  // Shadows & Borders
  border: "#E5E7EB",

  // Gradient Palettes
  gradients: {
    skyBlue: ["#DDEFFD", "#B8D4FF"],
    navyAccent: ["#0F172A", "#1F2937"],
  },
};

// Typography System
export const Typography = {
  // Font Families
  families: Platform.select({
    ios: {
      regular: "System",
      medium: "System",
      bold: "System",
      semibold: "System",
    },
    default: {
      regular: "Roboto",
      medium: "Roboto_500Medium",
      bold: "Roboto_700Bold",
      semibold: "Roboto_600SemiBold",
    },
  }),

  // Font Sizes
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },

  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Font Weights
  weights: {
    light: "300" as any,
    normal: "400" as any,
    medium: "500" as any,
    semibold: "600" as any,
    bold: "700" as any,
  },
};

// Spacing System
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
};

// Border Radius
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 28,
  full: 9999,
};

// Shadow System (platform-specific)
export const Shadows = Platform.select({
  web: {
    sm: {
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
    },
    md: {
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    lg: {
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.12)",
    },
    xl: {
      boxShadow: "0 12px 24px rgba(15, 23, 42, 0.15)",
    },
  },
  default: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
    },
    xl: {
      shadowColor: "#0F172A",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 12,
    },
  },
});

// Animation Durations
export const Animation = {
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 800,
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
