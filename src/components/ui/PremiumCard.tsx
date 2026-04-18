import React from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { BorderRadius, Colors, Shadows } from "../../../constants/theme";

interface PremiumCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: "default" | "elevated" | "outlined";
  padding?: number;
}

export default function PremiumCard({
  children,
  onPress,
  style,
  variant = "default",
  padding = 16,
}: PremiumCardProps) {
  const variantStyles: any = {
    default: {
      backgroundColor: Colors.secondary,
      ...Shadows.md,
    },
    elevated: {
      backgroundColor: Colors.secondary,
      ...Shadows.lg,
    },
    outlined: {
      backgroundColor: Colors.background.lighter,
      borderWidth: 1,
      borderColor: Colors.border,
    },
  };

  const cardStyle = {
    borderRadius: BorderRadius.xl,
    padding,
    overflow: "hidden" as const,
    ...variantStyles[variant],
    ...style,
  };

  const content = <View style={cardStyle}>{children}</View>;

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.8}>
        {children}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
  },
});
