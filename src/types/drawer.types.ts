/**
 * SideDrawer TypeScript Type Definitions
 * Complete type safety for the drawer menu system
 */

// ============================================================
// DRAWER MENU TYPES
// ============================================================

/**
 * Individual menu item definition
 */
export interface DrawerMenuItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
  action?: () => void; // For special items like dark mode
}

/**
 * Menu section grouping items
 */
export interface DrawerSection {
  title: string;
  items: DrawerMenuItem[];
}

/**
 * SideDrawer component props
 */
export interface SideDrawerProps {
  /** Whether drawer is currently visible */
  visible: boolean;
  /** Callback when drawer should close */
  onClose: () => void;
  /** User's display name */
  userName?: string;
  /** User's email address */
  userEmail?: string;
  /** Optional callback after logout */
  onLogout?: () => void;
}

// ============================================================
// COUPON TYPES
// ============================================================

/**
 * Coupon/Promo code definition from Firestore
 */
export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  minPurchase: number;
  expiryDate: string;
  description: string;
  used: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Applied coupon tracking
 */
export interface AppliedCoupon {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  appliedAt: string;
}

// ============================================================
// LANGUAGE TYPES
// ============================================================

/**
 * Language option for selection
 */
export interface Language {
  id: string;
  name: string;
  code: string;
  flag: string;
}

/**
 * Language preferences
 */
export interface LanguagePreferences {
  currentLanguage: string;
  availableLanguages: Language[];
  isRTL: boolean; // Right-to-left for Arabic, Hebrew, etc.
}

// ============================================================
// USER TYPES
// ============================================================

/**
 * User profile from Firestore
 */
export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * User address
 */
export interface UserAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

/**
 * User context data
 */
export interface UserContextType {
  user: {
    profile: UserProfile | null;
    addresses: UserAddress[];
  };
  loading: boolean;
  error: string | null;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  addAddress: (address: Omit<UserAddress, "id">) => Promise<boolean>;
  updateAddress: (
    id: string,
    address: Partial<UserAddress>,
  ) => Promise<boolean>;
  deleteAddress: (id: string) => Promise<boolean>;
}

// ============================================================
// NOTIFICATION TYPES
// ============================================================

/**
 * In-app notification
 */
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "order" | "promotion" | "account" | "system";
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  icon?: string;
}

// ============================================================
// ORDER TYPES
// ============================================================

/**
 * Order item in cart/order
 */
export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

/**
 * Complete order
 */
export interface Order {
  id: string;
  items: OrderItem[];
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  total: number;
  shippingAddress: UserAddress;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

// ============================================================
// PAYMENT TYPES
// ============================================================

/**
 * Saved payment method
 */
export interface PaymentMethod {
  id: string;
  type: "card" | "wallet" | "bank";
  provider: string; // 'visa', 'mastercard', 'paypal', etc.
  lastFour: string;
  expiryDate: string;
  isDefault: boolean;
  cardholderName: string;
}

// ============================================================
// CONTEXT TYPES
// ============================================================

/**
 * Auth context type
 */
export interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

/**
 * Cart context type
 */
export interface CartContextType {
  cartItems: OrderItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

/**
 * Wishlist context type
 */
export interface WishlistContextType {
  wishlistItems: string[]; // Product IDs
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

// ============================================================
// ROUTE TYPES
// ============================================================

/**
 * All valid drawer route paths
 */
export type DrawerRoute =
  | "/profile/edit"
  | "/orders"
  | "/(tabs)/wishlist"
  | "/address"
  | "/(tabs)"
  | "/cart"
  | "/orders/[id]"
  | "/payment"
  | "/coupons"
  | "/notifications"
  | "/language"
  | "/privacy"
  | "/help"
  | "/about"
  | "/login";

/**
 * Route parameters
 */
export interface RouteParams {
  "[id]"?: string;
  [key: string]: string | undefined;
}

// ============================================================
// UI COMPONENT TYPES
// ============================================================

/**
 * Theme colors
 */
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: {
    primary: string;
    secondary: string;
    lighter: string;
    softerBlue: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  success: string;
  error: string;
  warning: string;
  info: string;
}

/**
 * Spacing scale
 */
export interface SpacingScale {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  "2xl": number;
  "3xl": number;
  [key: string]: number;
}

/**
 * Border radius scale
 */
export interface BorderRadiusScale {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  "2xl": number;
  full: number;
  [key: string]: number;
}

/**
 * Shadow styles
 */
export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface Shadows {
  xs: ShadowStyle;
  sm: ShadowStyle;
  md: ShadowStyle;
  lg: ShadowStyle;
  xl: ShadowStyle;
  [key: string]: ShadowStyle;
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

/**
 * Generic API response
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ============================================================
// FIRESTORE TYPES
// ============================================================

/**
 * Firestore document base
 */
export interface FirestoreDocument {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Firestore batch operations
 */
export interface FirestoreBatchOp {
  type: "set" | "update" | "delete";
  path: string;
  data?: any;
}

// ============================================================
// ERROR HANDLING TYPES
// ============================================================

/**
 * Custom app error
 */
export interface AppError {
  code: string;
  message: string;
  originalError?: Error;
  context?: Record<string, any>;
}

/**
 * Error handler function
 */
export type ErrorHandler = (error: AppError) => void;

// ============================================================
// STATE MANAGEMENT TYPES
// ============================================================

/**
 * Loading state
 */
export interface LoadingState {
  isLoading: boolean;
  isDone: boolean;
  progress?: number;
}

/**
 * Async state
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Export all types for use across the app
export default {};
