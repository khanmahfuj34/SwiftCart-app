/**
 * 🎯 SWIFTCART DRAWER QUICK REFERENCE CARD
 * 
 * Copy-paste ready code snippets for common tasks
 */

// ============================================================
// 1. USING THE DRAWER IN ANY SCREEN
// ============================================================

import SideDrawer from '../../src/components/SideDrawer';
import { useUser } from '../../src/context/UserContext';
import { useState } from 'react';

export default function YourScreen() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { user } = useUser();

  return (
    <>
      {/* Your screen content */}
      <TouchableOpacity onPress={() => setDrawerVisible(true)}>
        <Ionicons name="menu" size={28} />
      </TouchableOpacity>

      {/* Drawer Component */}
      <SideDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        userName={user?.profile?.name || 'Guest'}
        userEmail={user?.profile?.email || 'user@example.com'}
      />
    </>
  );
}

// ============================================================
// 2. ADDING A NEW MENU SECTION
// ============================================================

// In SideDrawer.tsx, add to menuSections array:

const newSection = {
  title: '🎁 REWARDS',
  items: [
    { label: 'My Points', icon: 'star', route: '/rewards/points' },
    { label: 'Referral Program', icon: 'share-social', route: '/rewards/referral' },
    { label: 'Loyalty Card', icon: 'card', route: '/rewards/loyalty' },
  ],
};

// ============================================================
// 3. ADDING A NEW MENU ITEM
// ============================================================

// Add to any existing section's items array:

const newItem = {
  label: 'Returns & Refunds',
  icon: 'arrow-undo',
  route: '/returns',
  badge: 0, // Optional
};

// ============================================================
// 4. FIRESTORE: ADD SAMPLE COUPON
// ============================================================

// In Firestore Console, create "coupons" collection:
// Collection Path: coupons
// Document ID: auto-generated

{
  "code": "WELCOME20",
  "discount": 20,
  "type": "percentage",
  "minPurchase": 0,
  "expiryDate": "2025-12-31",
  "description": "20% off your first order!",
  "used": false
}

// ============================================================
// 5. CUSTOM LOGOUT HANDLER
// ============================================================

// If you need custom logic before logout:

const handleLogout = async () => {
  try {
    // Custom logic here
    await clearLocalCache();
    await analytics.logEvent('user_logout');
    
    // Then logout
    await logout();
    router.replace('/login');
    onClose();
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// ============================================================
// 6. GET DRAWER VISIBILITY STATE
// ============================================================

// Access drawer state in component:
const [drawerVisible, setDrawerVisible] = useState(false);

// Show drawer
setDrawerVisible(true);

// Hide drawer
setDrawerVisible(false);

// Toggle drawer
setDrawerVisible(!drawerVisible);

// ============================================================
// 7. NAVIGATE FROM DRAWER ITEM
// ============================================================

// Items automatically navigate on click
// But if you need custom navigation:

const handleCustomNavigation = (route: string) => {
  // Do something custom
  console.log('Navigating to:', route);
  
  // Then navigate
  router.push(route as any);
  
  // Auto close drawer
  onClose();
};

// ============================================================
// 8. ACCESS USER DATA IN DRAWER
// ============================================================

import { useUser } from '../../src/context/UserContext';

const { user } = useUser();

// Access user data
const userName = user?.profile?.name;
const userEmail = user?.profile?.email;
const userPhoto = user?.profile?.photoURL;
const userAddresses = user?.addresses;

// ============================================================
// 9. CUSTOMIZE DRAWER COLORS
// ============================================================

// Light mode (default)
backgroundColor: '#FFFFFF'
textColor: '#0F172A'
activeBackground: '#F3F4F6'
badgeColor: '#EF4444'

// Dark mode
backgroundColor: '#1A1A1A'
textColor: '#FFFFFF'
activeBackground: '#2A2A2A'
badgeColor: '#EF4444'

// ============================================================
// 10. CHANGE ANIMATION SPEED
// ============================================================

// In SideDrawer.tsx useEffect:

if (visible) {
  Animated.timing(slideAnim, {
    toValue: 0,
    duration: 200, // Change from 300 to 200 for faster
    useNativeDriver: true,
  }).start();
}

// ============================================================
// 11. ADD BADGE TO MENU ITEM
// ============================================================

{
  label: 'Cart',
  icon: 'cart',
  route: '/cart',
  badge: cartItems.length, // Shows item count
}

// ============================================================
// 12. CHECK IF USER IS AUTHENTICATED
// ============================================================

import { useAuth } from '../../src/context/AuthContext';

const { user, loading } = useAuth();

if (loading) {
  return <ActivityIndicator />;
}

if (!user) {
  // User not logged in
  return <Navigate to="/login" />;
}

// ============================================================
// 13. FETCH COUPONS FROM FIRESTORE
// ============================================================

import { getFirestore, collection, getDocs } from 'firebase/firestore';

const db = getFirestore();
const couponsRef = collection(db, 'coupons');
const snapshot = await getDocs(couponsRef);

const coupons = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data(),
}));

// ============================================================
// 14. APPLY COUPON TO ORDER
// ============================================================

const handleApplyCoupon = (couponCode: string) => {
  // Find coupon
  const coupon = coupons.find(c => c.code === couponCode);
  
  if (!coupon) {
    console.error('Coupon not found');
    return;
  }
  
  // Calculate discount
  const discount = coupon.type === 'percentage'
    ? (cartTotal * coupon.discount) / 100
    : coupon.discount;
  
  // Apply to cart total
  const finalTotal = cartTotal - discount;
  
  // Save applied coupon
  setAppliedCoupon(coupon);
};

// ============================================================
// 15. HANDLE LANGUAGE CHANGE
// ============================================================

const handleSelectLanguage = (languageCode: string) => {
  // Save to context or AsyncStorage
  setSelectedLanguage(languageCode);
  
  // Update app locale (if using i18n)
  i18n.changeLanguage(languageCode);
  
  // Persist to Firestore
  updateUserProfile({ preferredLanguage: languageCode });
};

// ============================================================
// 16. CLOSE DRAWER AFTER NAVIGATION
// ============================================================

// Automatic (already implemented)
// Drawer closes automatically on menu item click

// Manual close:
onClose();

// Close and navigate:
router.push('/orders');
onClose();

// ============================================================
// 17. DISPLAY NOTIFICATION BADGES
// ============================================================

// Items with badges:
badge: notificationCount,  // Shows as badge number

// Add to relevant items:
{
  label: 'Cart',
  icon: 'cart',
  route: '/cart',
  badge: cartItems.length,
},
{
  label: 'Wishlist',
  icon: 'heart',
  route: '/(tabs)/wishlist',
  badge: wishlistItems.length,
},
{
  label: 'Notifications',
  icon: 'notifications',
  route: '/notifications',
  badge: unreadNotifications.length,
}

// ============================================================
// 18. SETUP FIRESTORE SECURITY RULES
// ============================================================

/**
 * In Firestore Console > Rules:
 */

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    
    // Everyone can read coupons
    match /coupons/{document=**} {
      allow read: if true;
    }
    
    // Orders are private
    match /orders/{uid}/{document=**} {
      allow read, write: if request.auth.uid == uid;
    }
    
    // Wishlist is private
    match /wishlist/{uid}/{document=**} {
      allow read, write: if request.auth.uid == uid;
    }
    
    // Notifications are private
    match /notifications/{uid}/{document=**} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}

// ============================================================
// 19. TEST DARK MODE
// ============================================================

import { useColorScheme } from '@/hooks/use-color-scheme';

const colorScheme = useColorScheme();
const isDark = colorScheme === 'dark';

// All colors automatically update based on isDark
backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF'
textColor: isDark ? '#FFFFFF' : '#0F172A'

// ============================================================
// 20. HANDLE LOADING STATE IN DRAWER ITEMS
// ============================================================

// In coupons.tsx:
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchCoupons().finally(() => setLoading(false));
}, []);

if (loading) {
  return <ActivityIndicator size="large" color="#0F172A" />;
}

// ============================================================
// 21. DEBUG: LOG DRAWER NAVIGATION
// ============================================================

const handleNavigation = (route: string) => {
  console.log('🔗 Navigating to:', route);
  console.log('⏱️ Time:', new Date().toLocaleTimeString());
  
  setActiveRoute(route);
  router.push(route as any);
  onClose();
};

// ============================================================
// 22. EXPORT TYPES FOR OTHER FILES
// ============================================================

// In src/types/drawer.types.ts:
export interface DrawerMenuItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

export interface SideDrawerProps {
  visible: boolean;
  onClose: () => void;
  userName?: string;
  userEmail?: string;
}

// Use in other files:
import type { DrawerMenuItem, SideDrawerProps } from '../../src/types/drawer.types';

// ============================================================
// 23. COMMON ERRORS & FIXES
// ============================================================

// Error: "Cannot find module 'SideDrawer'"
// Fix: Check import path matches file location

import SideDrawer from '../../src/components/SideDrawer'; // Correct

// Error: "useUser is not defined"
// Fix: Import from UserContext

import { useUser } from '../../src/context/UserContext'; // Add this

// Error: "Route not found"
// Fix: Create the screen file in app/ directory

// Create: app/your-route.tsx

// Error: "Firestore collection not found"
// Fix: Create collection in Firestore Console first

// ============================================================
// 24. PERFORMANCE TIPS
// ============================================================

// Use React.memo for menu items
const MenuItemComponent = React.memo(({ item }) => (
  <TouchableOpacity>
    <Text>{item.label}</Text>
  </TouchableOpacity>
));

// Memoize menu sections
const memoizedSections = useMemo(() => menuSections, []);

// Avoid re-renders
const handleNavigation = useCallback((route) => {
  router.push(route);
  onClose();
}, [router, onClose]);

// ============================================================
// 25. STYLE CUSTOMIZATION
// ============================================================

// Access design tokens:
import { BorderRadius, Shadows, Spacing } from '../../constants/theme';

// Use in styles:
const styles = StyleSheet.create({
  drawer: {
    borderRadius: BorderRadius.lg,
    ...Shadows.xl,
    padding: Spacing.md,
  },
});

// ============================================================
// HELPFUL LINKS
// ============================================================

/**
 * Documentation:
 * - SIDEDRAWER_IMPLEMENTATION.md (Complete guide)
 * - SIDEDRAWER_SETUP.sh (Setup & testing)
 * - DRAWER_FEATURES_SUMMARY.md (Overview)
 * 
 * Main Files:
 * - src/components/SideDrawer.tsx (Drawer component)
 * - app/coupons.tsx (Coupons screen)
 * - app/language.tsx (Language settings)
 * - src/types/drawer.types.ts (TypeScript definitions)
 * 
 * Related Context:
 * - src/context/AuthContext.js (Authentication)
 * - src/context/UserContext.js (User data)
 * - src/context/CartContext.js (Shopping cart)
 * - src/context/WishlistContext.js (Wishlist)
 */

export const quickReferenceComplete = true;
