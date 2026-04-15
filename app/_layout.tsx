import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { CartProvider } from '../src/context/CartContext';
import { WishlistProvider } from '../src/context/WishlistContext';
import { AuthProvider, useAuth } from '../src/context/AuthContext';

export const unstable_settings = {
  anchor: '(tabs)',
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
    const inAuthGroup = segments[0] === 'login' || segments[0] === 'signup';

    if (!user && !inAuthGroup) {
      // User is completely unauthenticated but physically on a restricted view (like Home/Profile)
      // Force them to the login screen immediately.
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // User physically logged in successfully, or is loaded and trying to hit '/login' via url natively
      // Send them to the main dashboard
      router.replace('/(tabs)');
    }
  }, [user, loading, segments, navigationState?.key]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <WishlistProvider>
        <CartProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="cart" options={{ title: 'Cart', presentation: 'modal' }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </CartProvider>
      </WishlistProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
