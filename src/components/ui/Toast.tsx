import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, SafeAreaView, StyleSheet, Text, View } from "react-native";
import {
    Animation,
    BorderRadius,
    Colors,
    Shadows,
    Spacing,
} from "../../../constants/theme";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps extends Toast {
  onDismiss: () => void;
}

// Toast Context and Provider
let toastQueue: Toast[] = [];
let toastListeners: ((toasts: Toast[]) => void)[] = [];

export function useToast() {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  React.useEffect(() => {
    const listener = (toasts: Toast[]) => setToasts(toasts);
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  const show = React.useCallback(
    (
      title: string,
      options?: {
        message?: string;
        type?: ToastType;
        duration?: number;
      },
    ) => {
      const id = Date.now().toString();
      const toast: Toast = {
        id,
        title,
        message: options?.message,
        type: options?.type || "info",
        duration: options?.duration || 2000,
      };

      toastQueue = [...toastQueue, toast];
      toastListeners.forEach((l) => l(toastQueue));

      if (toast.duration > 0) {
        setTimeout(() => dismiss(id), toast.duration);
      }
    },
    [],
  );

  const dismiss = React.useCallback((id: string) => {
    toastQueue = toastQueue.filter((t) => t.id !== id);
    toastListeners.forEach((l) => l(toastQueue));
  }, []);

  return { show, dismiss };
}

const ToastItem: React.FC<ToastProps> = ({
  id,
  title,
  message,
  type,
  onDismiss,
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: Animation.normal,
      useNativeDriver: true,
    }).start();
  }, []);

  const typeConfig: any = {
    success: {
      icon: "checkmark-circle",
      backgroundColor: Colors.success,
      textColor: Colors.secondary,
    },
    error: {
      icon: "close-circle",
      backgroundColor: Colors.error,
      textColor: Colors.secondary,
    },
    info: {
      icon: "information-circle",
      backgroundColor: Colors.accent,
      textColor: Colors.secondary,
    },
    warning: {
      icon: "alert-circle",
      backgroundColor: Colors.warning,
      textColor: Colors.secondary,
    },
  };

  const config = typeConfig[type];

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={[styles.toast, { backgroundColor: config.backgroundColor }]}>
        <Ionicons
          name={config.icon}
          size={24}
          color={config.textColor}
          style={styles.icon}
        />
        <View style={styles.content}>
          <Text style={[styles.title, { color: config.textColor }]}>
            {title}
          </Text>
          {message && (
            <Text
              style={[
                styles.message,
                { color: config.textColor, opacity: 0.9 },
              ]}
            >
              {message}
            </Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  React.useEffect(() => {
    const listener = (toasts: Toast[]) => setToasts(toasts);
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <>
      {children}
      <SafeAreaView pointerEvents="none" style={styles.safeArea}>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            {...toast}
            onDismiss={() => {
              toastQueue = toastQueue.filter((t) => t.id !== toast.id);
              setToasts(toastQueue);
            }}
          />
        ))}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  toastContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Shadows.lg,
  },
  icon: {
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  message: {
    fontSize: 12,
    marginTop: Spacing.xs,
    fontWeight: "400",
  },
});
