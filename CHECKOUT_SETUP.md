# 🛒 SwiftCart Checkout Flow - Integration Guide

## ✅ Complete Setup Instructions

### 1. **Update your `app.json` (Root Layout Provider)**

Wrap your app with the `CheckoutProvider` in your root layout file (e.g., `app/_layout.tsx`):

```jsx
import { CheckoutProvider } from "./src/context/CheckoutContext";
import { CartProvider } from "./src/context/CartContext";
import { WishlistProvider } from "./src/context/WishlistContext";
import { AuthProvider } from "./src/context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <CheckoutProvider>
            {/* Your Stack or Tabs navigation */}
          </CheckoutProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
```

---

## 📱 Checkout Flow Overview

### **Step 1: Address Selection** (`/checkout/address`)

- ✅ Display saved addresses
- ✅ Select address with radio buttons
- ✅ Show default address tag
- ✅ Edit/Delete address buttons (placeholder)
- ✅ Add new address button (placeholder)
- ✅ Continue to Delivery

### **Step 2: Delivery Options** (`/checkout/delivery`)

- ✅ Standard Delivery (3-5 days) - $5
- ✅ Express Delivery (1-2 days) - $15
- ✅ Display selected address summary
- ✅ Show price with delivery fee
- ✅ Continue to Payment

### **Step 3: Payment Method** (`/checkout/payment`)

- ✅ Cash on Delivery
- ✅ Credit/Debit Card (with form)
- ✅ bKash
- ✅ Nagad
- ✅ Card validation (MM/YY, CVV)
- ✅ Save card option
- ✅ Continue to Review

### **Step 4: Order Review** (`/checkout/review`)

- ✅ Display selected address
- ✅ Display delivery type
- ✅ Display payment method
- ✅ List all cart items with images
- ✅ Price summary (subtotal + delivery fee)
- ✅ **Place Order** → Saves to Firestore
- ✅ Clears cart after success
- ✅ Navigate to success screen

### **Step 5: Success Screen** (`/checkout/success`)

- ✅ Success icon & message
- ✅ Order ID display
- ✅ Status badge (Pending)
- ✅ Estimated delivery info
- ✅ View Orders button
- ✅ Continue Shopping button

---

## 🗂️ File Structure

```
app/
├── checkout/
│   ├── _layout.tsx              # Checkout navigation layout
│   ├── address.tsx              # Address selection screen
│   ├── delivery.tsx             # Delivery options screen
│   ├── payment.tsx              # Payment method screen
│   ├── review.tsx               # Order review screen
│   └── success.tsx              # Order confirmation screen
└── cart.tsx                     # Updated with checkout button

src/
├── context/
│   ├── CheckoutContext.js       # Checkout state management
│   ├── CartContext.js           # Cart state
│   ├── WishlistContext.js       # Wishlist state
│   └── AuthContext.js           # Auth state
└── components/
    ├── StepIndicator.js         # Progress indicator
    └── PriceSummary.js          # Price breakdown component
```

---

## 🔄 State Management (CheckoutContext)

### **Available Properties:**

```javascript
const {
  // Address
  selectedAddress, // Selected address ID
  setSelectedAddress, // Set selected address
  addresses, // Array of saved addresses
  addAddress, // Add new address
  updateAddress, // Update existing address
  deleteAddress, // Delete address
  setDefaultAddress, // Mark as default

  // Delivery
  selectedDelivery, // Selected delivery ID (1 or 2)
  setSelectedDelivery, // Set delivery option

  // Payment
  selectedPayment, // Selected payment ID (1-4)
  setSelectedPayment, // Set payment method
  cardDetails, // Card form data
  setCardDetails, // Update card details

  // Steps
  currentStep, // Current step (1-4)
  setCurrentStep, // Move to next/prev step
} = useCheckout();
```

---

## 💾 Firebase Integration

### **Orders Collection Schema:**

```json
{
  "userId": "user-id",
  "items": [
    {
      "id": "product-id",
      "title": "Product Name",
      "price": 99.99,
      "quantity": 2,
      "selectedSize": "M",
      "selectedColor": "Black"
    }
  ],
  "subtotal": 199.98,
  "deliveryFee": 15,
  "total": 214.98,
  "address": {
    "id": 1,
    "name": "Home",
    "phone": "+880 1700-000000",
    "address": "123 Main Street, Dhaka 1205",
    "isDefault": true
  },
  "paymentMethod": "Credit/Debit Card",
  "deliveryType": "Express Delivery",
  "status": "Pending",
  "createdAt": "2026-04-16T10:30:00Z"
}
```

---

## 🎨 Design System

### **Colors:**

- Background: `#FAF9F6`
- White: `#FFFFFF`
- Text: `#1A1A1A`
- Secondary: `#718096`
- Success: `#48BB78`
- Warning: `#F39C12`
- Error: `#E53E3E`

### **Spacing:**

- Border Radius: `16px` / `20px` / `24px`
- Padding: `16px` / `20px`
- Shadows: Soft (opacity 0.05 - 0.1)

---

## 🚀 How to Start Checkout

### **From Cart Screen:**

```jsx
import { useRouter } from "expo-router";

const router = useRouter();

// Trigger checkout
<TouchableOpacity onPress={() => router.push("/checkout/address")}>
  <Text>Proceed to Checkout</Text>
</TouchableOpacity>;
```

---

## ✨ Features Implemented

✅ Multi-step checkout flow with progress indicator
✅ Address selection with default address support
✅ Dynamic delivery fee calculation
✅ Multiple payment methods (COD, Card, bKash, Nagad)
✅ Card form with validation
✅ Complete order review before placing
✅ Firebase Firestore integration for order storage
✅ Order success screen with order ID
✅ Cart clearing after successful order
✅ Responsive and modern UI design
✅ Premium UX with smooth animations
✅ Error handling and loading states

---

## 📋 Checklist for Full Integration

- [ ] Add `CheckoutProvider` to root layout
- [ ] Ensure Firebase is configured
- [ ] Test address selection
- [ ] Test delivery options
- [ ] Test payment methods
- [ ] Test order review
- [ ] Test Firestore integration
- [ ] Test success screen
- [ ] Test cart clearing
- [ ] Verify order saved to Firestore

---

## 🐛 Troubleshooting

### Issue: "CheckoutContext is not defined"

**Solution:** Make sure `CheckoutProvider` is wrapped in your root layout

### Issue: Orders not saving to Firestore

**Solution:** Verify Firebase config is correct and rules allow writes to `orders` collection

### Issue: Cart not clearing after order

**Solution:** Ensure `clearCart()` is called after successful order placement

---

## 📞 Support

For any questions, refer to the individual screen components or the CheckoutContext documentation.

---

**Built with ❤️ for SwiftCart**
