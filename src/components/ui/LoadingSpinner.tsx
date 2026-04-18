import React from "react";
import { ActivityIndicator, StyleSheet, View, ViewStyle } from "react-native";
import { Colors } from "../../../constants/theme";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
}

export default function LoadingSpinner({
  size = "large",
  color = Colors.accent,
  style,
  containerStyle,
}: LoadingSpinnerProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <ActivityIndicator size={size} color={color} style={style} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
