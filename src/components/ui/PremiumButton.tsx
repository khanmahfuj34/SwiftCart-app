import React, { useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import {
    BorderRadius,
    Colors,
    Shadows,
    Spacing
} from "../../../constants/theme";

interface PremiumButtonProps {
  onPress: () => void;
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export default function PremiumButton({
  onPress,
  title,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  fullWidth = true,
  style,
  textStyle,
  icon,
  iconPosition = "left",
}: PremiumButtonProps) {
  const [pressed, setPressed] = useState(false);

  const handlePressIn = () => setPressed(true);
  const handlePressOut = () => setPressed(false);

  // Size configurations
  const sizeConfig = {
    sm: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.lg,
      fontSize: 14,
    },
    md: {
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.xl,
      borderRadius: BorderRadius.xl,
      fontSize: 16,
    },
    lg: {
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing["2xl"],
      borderRadius: BorderRadius["2xl"],
      fontSize: 18,
    },
  };

  // Variant configurations
  const variantConfig: any = {
    primary: {
      backgroundColor: Colors.accent,
      textColor: Colors.secondary,
      pressedOpacity: 0.85,
      borderColor: Colors.accent,
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: Colors.primary,
      textColor: Colors.accent,
      pressedOpacity: 0.85,
      borderColor: Colors.primary,
      borderWidth: 0,
    },
    outline: {
      backgroundColor: Colors.secondary,
      textColor: Colors.accent,
      pressedOpacity: 0.9,
      borderColor: Colors.accent,
      borderWidth: 2,
    },
    ghost: {
      backgroundColor: "transparent",
      textColor: Colors.accent,
      pressedOpacity: 0.7,
      borderColor: "transparent",
      borderWidth: 0,
    },
  };

  const config = variantConfig[variant];
  const size_config = sizeConfig[size];

  const buttonStyle: ViewStyle = {
    ...size_config,
    backgroundColor: config.backgroundColor,
    borderColor: config.borderColor,
    borderWidth: config.borderWidth,
    opacity: disabled || isLoading ? 0.6 : pressed ? config.pressedOpacity : 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: fullWidth ? "100%" : "auto",
    ...Shadows.md,
    ...style,
  };

  const textStyle_final: TextStyle = {
    color: config.textColor,
    fontSize: size_config.fontSize,
    fontWeight: "600",
    ...textStyle,
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || isLoading}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator color={config.textColor} size="small" />
      ) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: Spacing.sm,
          }}
        >
          {icon && iconPosition === "left" && icon}
          <Text style={textStyle_final}>{title}</Text>
          {icon && iconPosition === "right" && icon}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
});
