import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import {
    BorderRadius,
    Colors,
    Shadows,
    Spacing,
} from "../../../constants/theme";

interface PremiumInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  editable?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  icon?: string;
  rightIcon?: React.ReactNode;
  error?: string;
  label?: string;
  required?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

export default function PremiumInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  editable = true,
  onFocus,
  onBlur,
  icon,
  rightIcon,
  error,
  label,
  required,
  style,
  inputStyle,
}: PremiumInputProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => {
    setFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setFocused(false);
    onBlur?.();
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <View
        style={[
          styles.inputWrapper,
          focused && styles.inputWrapperFocused,
          error && styles.inputWrapperError,
        ]}
      >
        {icon && (
          <Ionicons
            name={icon as any}
            size={20}
            color={focused ? Colors.accent : Colors.muted}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={[styles.input, icon && styles.inputWithIcon, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={Colors.muted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor={Colors.accent}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={toggleShowPassword}
            style={styles.rightIcon}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={Colors.accent}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextEntry && (
          <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: Spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  required: {
    color: Colors.error,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background.lighter,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Shadows.sm,
  },
  inputWrapperFocused: {
    borderColor: Colors.accent,
    backgroundColor: Colors.background.softBlue,
  },
  inputWrapperError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    paddingVertical: Spacing.sm,
  },
  inputWithIcon: {
    marginLeft: Spacing.sm,
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  rightIcon: {
    marginLeft: Spacing.sm,
    padding: Spacing.sm,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: Spacing.sm,
    fontWeight: "500",
  },
});
