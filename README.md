# 🛒 SwiftCart - Mobile E-Commerce Application

> A modern, feature-rich cross-platform e-commerce application built with Expo and React Native for iOS, Android, and Web.

---

## 📋 Table of Contents

- [About SwiftCart](#about-swiftcart)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [Project Features Overview](#project-features-overview)
- [Development Guidelines](#development-guidelines)
- [Resources](#resources)

---

## 📱 About SwiftCart

SwiftCart is a full-featured e-commerce mobile application that allows users to browse products, manage their shopping cart, place orders, track deliveries, and more. The app is built with modern technologies and provides a seamless shopping experience across multiple platforms.

---

## ✨ Key Features

- 🏠 **Home Dashboard** - Personalized product recommendations and trending items
- 🔍 **Product Discovery** - Browse new arrivals, trending products, and category-based shopping
- 🛒 **Smart Cart Management** - Add/remove items, apply coupons, and view real-time pricing
- 💳 **Secure Checkout** - Multi-step checkout with address selection, delivery options, and payment processing
- 👤 **User Authentication** - Secure login/signup with email verification
- 👁️ **Wishlist** - Save favorite items for later purchase
- 📦 **Order Management** - Track orders, view order history, and delivery status
- 🌍 **Multi-Unit Support** - Switch between metric and imperial units
- 🎨 **Modern UI** - Beautiful, responsive design with smooth animations
- 🔔 **Notifications** - Real-time order and delivery notifications
- 💬 **Help & Support** - Contact support and view FAQs
- 🌐 **Multi-language Support** - Language selection for international users

---

## 🛠️ Tech Stack

### Frontend

- **React Native** (v0.81.5) - Cross-platform mobile framework
- **Expo** (~v54.0.33) - Development platform and build service
- **Expo Router** (~v6.0.23) - File-based routing for navigation
- **React Navigation** - Native navigation library
- **React** (v19.1.0) - UI library

### Styling & UI

- **Expo Vector Icons** - Icon library
- **Expo Linear Gradient** - Gradient backgrounds
- **React Native Reanimated** - Smooth animations
- **React Native Gesture Handler** - Touch gesture support

### State Management & Data

- **Firebase** (v12.12.0) - Authentication, Firestore database, and cloud storage
- **Axios** - HTTP client for API requests

### Development

- **TypeScript** (~v5.9.2) - Static typing
- **ESLint** - Code linting
- **Node.js** - Runtime environment

---

## 📁 Project Structure

```
swiftcart-app/
├── app/                          # Main application screens (Expo Router)
│   ├── (tabs)/                  # Tab-based navigation
│   │   ├── _layout.tsx          # Tab navigation layout
│   │   ├── index.tsx            # Home screen
│   │   ├── profile.tsx          # User profile screen
│   │   └── wishlist.tsx         # Wishlist screen
│   ├── checkout/                # Checkout flow screens
│   │   ├── address.tsx          # Address selection
│   │   ├── delivery.tsx         # Delivery options
│   │   ├── payment.tsx          # Payment processing
│   │   ├── review.tsx           # Order review
│   │   └── success.tsx          # Order confirmation
│   ├── product/                 # Product details
│   │   └── [id].tsx             # Dynamic product page
│   ├── orders/                  # Order management
│   │   └── [id].tsx             # Order details page
│   ├── cart.tsx                 # Shopping cart
│   ├── index.tsx                # Landing/splash screen
│   ├── login.tsx                # User login
│   ├── signup.tsx               # User registration
│   ├── new-arrivals.tsx         # New products showcase
│   ├── trending.tsx             # Trending products
│   ├── offers.tsx               # Special offers & promotions
│   ├── coupons.tsx              # Coupon management
│   ├── notifications.tsx        # Notification center
│   ├── address.tsx              # Address management
│   ├── payment.tsx              # Payment settings
│   ├── language.tsx             # Language selection
│   ├── help.tsx                 # Help & support
│   ├── privacy.tsx              # Privacy policy
│   └── about.tsx                # About the app
├── src/
│   ├── components/              # Reusable React components
│   │   ├── BottomNav.js         # Bottom navigation bar
│   │   ├── ProductCard.js       # Product display card
│   │   ├── ProductGrid.js       # Product grid layout
│   │   ├── CategoryList.js      # Category navigation
│   │   ├── SearchBar.js         # Search functionality
│   │   ├── GroceryProductCard.tsx
│   │   ├── ProfileHeader.js
│   │   ├── ProfileListItem.js
│   │   ├── RecentOrderCard.js
│   │   ├── StepIndicator.js
│   │   ├── CheckoutAddressSelector.jsx
│   │   ├── PriceSummary.js
│   │   ├── SideDrawer.tsx       # Side navigation drawer
│   │   └── ui/                  # UI component library
│   ├── context/                 # React Context for state management
│   │   ├── AuthContext.js       # Authentication state
│   │   ├── CartContext.js       # Shopping cart state
│   │   ├── CheckoutContext.js   # Checkout flow state
│   │   ├── OrdersContext.js     # Orders state
│   │   ├── ProfileContext.js    # User profile state
│   │   ├── UserContext.js       # User data state
│   │   ├── WishlistContext.js   # Wishlist state
│   │   └── DrawerContext.tsx    # Navigation drawer state
│   ├── services/                # API & external service calls
│   │   ├── firebase.js          # Firebase configuration & setup
│   │   ├── api.js               # REST API endpoints
│   │   ├── cartService.js       # Cart operations
│   │   ├── userService.js       # User operations
│   │   ├── addressService.js    # Address management
│   │   ├── ordersService.js     # Order operations
│   │   ├── wishlistService.js   # Wishlist operations
│   │   └── notificationsService.js  # Notification handling
│   ├── hooks/                   # Custom React hooks
│   │   └── useProducts.js       # Product fetching hook
│   ├── utils/                   # Utility functions
│   │   └── unitSystem.ts        # Unit conversion utilities
│   └── types/                   # TypeScript type definitions
│       └── drawer.types.ts
├── constants/
│   └── theme.ts                 # Design system & theme configuration
├── assets/
│   └── images/                  # Image assets
├── android/                     # Android native code
├── package.json                 # Project dependencies
├── tsconfig.json               # TypeScript configuration
├── expo.json                   # Expo configuration
├── firebase.json               # Firebase configuration
├── metro.config.js             # Metro bundler configuration
└── README.md                   # This file
```

---

## 🚀 Installation & Setup

### Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Git** - Version control
- **Expo CLI** - Install with `npm install -g eas-cli`

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd swiftcart-app
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including Expo, React Native, Firebase, and other dependencies.

### Step 3: Firebase Configuration

Ensure Firebase configuration is properly set up in:

- `src/services/firebase.js` - Initialize with your Firebase project credentials
- `firebase.json` - Contains your Firebase project settings

### Step 4: Environment Variables (Optional)

Create a `.env` file in the root directory if needed for API endpoints or configurations:

```bash
# Example .env file (if required)
EXPO_PUBLIC_API_URL=your_api_endpoint
EXPO_PUBLIC_FIREBASE_KEY=your_firebase_key
```

---

## ▶️ Running the Application

### Development Mode

Start the development server:

```bash
npm start
```

or

```bash
npx expo start
```

After running this command, you'll see options to open the app:

#### 📱 **Android Emulator**

- Press `a` in the terminal
- Requires Android Studio and Android emulator setup

#### 🍎 **iOS Simulator**

- Press `i` in the terminal
- Requires Xcode and iOS simulator setup (macOS only)

#### 🌐 **Web Browser**

```bash
npm run web
```

- Opens in your default web browser for quick testing

#### 📲 **Expo Go** (Easiest for Testing)

- Download "Expo Go" app from App Store or Google Play
- Scan the QR code displayed in terminal
- Test on a real device immediately

### Production Build

#### Android Build

```bash
expo run:android
```

#### iOS Build (requires macOS)

```bash
expo run:ios
```

#### Web Build

```bash
npx expo export --platform web
```

---

## 📜 Available Scripts

```bash
# Start development server
npm start

# Android emulator
npm run android

# iOS simulator (macOS only)
npm run ios

# Web browser
npm run web

# Run ESLint to check code quality
npm lint

# Reset project (clears cache)
npm run reset-project
```

---

## 🎯 Project Features Overview

### 🏪 Shopping Experience

- **Home Page**: Personalized recommendations, trending items, and featured categories
- **Product Catalog**: Browse by categories, search products, view detailed product pages
- **Product Details**: High-quality images, descriptions, prices, ratings, and reviews
- **Shopping Cart**: Add/remove items, update quantities, apply discount codes

### 🛍️ Checkout Flow

- **Address Selection**: Save and select delivery addresses
- **Delivery Options**: Choose delivery time slots and methods
- **Payment Gateway**: Secure payment processing
- **Order Review**: Review all details before confirming
- **Order Confirmation**: Success page with order tracking ID

### 👤 User Management

- **Authentication**: Secure login and registration
- **Profile Management**: Edit user information, update password
- **Address Book**: Manage multiple delivery addresses
- **Order History**: View all past orders and status
- **Wishlist**: Save favorite items for future purchase

### 📦 Order Management

- **Order Tracking**: Real-time order status updates
- **Delivery Notifications**: Track delivery in progress
- **Order Details**: View invoice, items, and payment details

### 🎨 Additional Features

- **Notifications**: Push notifications for orders and offers
- **Coupons**: Browse and apply discount coupons
- **Help & Support**: Contact support team
- **Language Selection**: Multiple language support
- **Unit System**: Toggle between metric and imperial units

---

## 💻 Development Guidelines

### Code Structure Best Practices

1. **Components**: Keep components small and reusable
2. **Contexts**: Use React Context for global state
3. **Services**: Separate API calls into service files
4. **Types**: Use TypeScript for type safety

### File Organization

- Screens go in `app/` directory
- Reusable components in `src/components/`
- State management in `src/context/`
- API calls in `src/services/`
- Constants in `constants/`

### Adding New Screens

1. Create a new file in `app/` directory
2. Use Expo Router's file-based routing
3. Import necessary contexts and components
4. Export as default

Example:

```tsx
// app/new-screen.tsx
import { Text, View } from "react-native";

export default function NewScreen() {
  return (
    <View>
      <Text>New Screen</Text>
    </View>
  );
}
```

---

## 📚 Resources

### Official Documentation

- 📖 [Expo Documentation](https://docs.expo.dev/)
- 🔗 [React Native Docs](https://reactnative.dev/)
- 🧭 [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- 🔥 [Firebase Documentation](https://firebase.google.com/docs)
- ⌨️ [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Community & Support

- 💬 [Expo Discord](https://chat.expo.dev/)
- 🐛 [Report Issues](https://github.com/expo/expo/issues)
- 📝 [Expo GitHub](https://github.com/expo/expo)

---

## 📝 License

This project is part of the SwiftCart e-commerce platform.

---

## 🤝 Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Happy coding! 🚀 Start building amazing features for SwiftCart.**
