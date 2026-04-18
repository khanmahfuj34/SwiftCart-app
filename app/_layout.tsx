import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import {
    Stack,
    useRootNavigationState,
    useRouter,
    useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { ToastProvider } from "../src/components/ui";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { CartProvider } from "../src/context/CartContext";
import { CheckoutProvider } from "../src/context/CheckoutContext";
import { DrawerProvider } from "../src/context/DrawerContext";
import { OrdersProvider } from "../src/context/OrdersContext";
import { ProfileProvider } from "../src/context/ProfileContext";
import { UserProvider } from "../src/context/UserContext";
import { WishlistProvider } from "../src/context/WishlistContext";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  // Route protector handling auth state changes instantly
  useEffect(() => {
    // Wait until the authentication and navigation systems are physically fully mounted locally
    if (loading || !navigationState?.key) return;

    // We treat 'login' and 'signup' as authentication screens.
    const inAuthGroup = segments[0] === "login" || segments[0] === "signup";
    const onWelcome = segments[0] === "";

    if (!user && !inAuthGroup && !onWelcome) {
      // User is completely unauthenticated but physically on a restricted view (like Home/Profile)
      // Send them to the welcome screen
      router.replace("/");
    } else if (user && inAuthGroup) {
      // User physically logged in successfully, or is loaded and trying to hit '/login' via url natively
      // Send them to the main dashboard
      router.replace("/(tabs)");
    }
  }, [user, loading, segments, navigationState?.key]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <DrawerProvider>
        <WishlistProvider>
          <CartProvider>
            <CheckoutProvider>
              <OrdersProvider>
                <UserProvider>
                  <Stack>
                    <Stack.Screen
                      name="index"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(tabs)"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="product/[id]"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="cart"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="checkout"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="login"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="signup"
                      options={{ headerShown: false }}
                    />
                  </Stack>
                  <StatusBar style="auto" />
                </UserProvider>
              </OrdersProvider>
            </CheckoutProvider>
          </CartProvider>
        </WishlistProvider>
      </DrawerProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <ToastProvider>
          <RootLayoutNav />
        </ToastProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
