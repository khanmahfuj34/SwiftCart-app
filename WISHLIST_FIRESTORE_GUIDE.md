# 🔥 Firestore Wishlist Integration Guide

## ✅ Complete Implementation

Your WishlistContext is now fully connected to Firestore with real-time synchronization.

---

## 📦 Firestore Structure

```
wishlist (collection)
└── {user.uid} (document)
    └── items: [
        {
          id: 1,
          title: "Product Name",
          price: 99.99,
          images: ["url1", "url2"],
          description: "...",
          // ... all product properties
        },
        // more items...
      ]
    └── createdAt: timestamp
```

---

## 🔄 API Reference

### **1. addToWishlist(product)**

Adds a product to user's wishlist in Firestore.

```javascript
const { addToWishlist } = useWishlist();

// Add item
await addToWishlist({
  id: 1,
  title: "Nike Shoes",
  price: 120,
  images: ["url"],
  description: "...",
});
```

### **2. removeFromWishlist(productId)**

Removes a product from wishlist by ID.

```javascript
const { removeFromWishlist } = useWishlist();

// Remove by ID
await removeFromWishlist(1);
```

### **3. toggleWishlist(product)**

Adds or removes item (shorthand).

```javascript
const { toggleWishlist } = useWishlist();

// Toggle - adds if not present, removes if present
await toggleWishlist(product);
```

### **4. isInWishlist(productId)**

Check if product is in wishlist.

```javascript
const { isInWishlist } = useWishlist();

const isLiked = isInWishlist(1); // true/false
```

### **5. fetchWishlist()**

Manually fetch/refresh wishlist (auto-called on user login).

```javascript
const { fetchWishlist } = useWishlist();

await fetchWishlist();
```

---

## 📊 State & Properties

```javascript
const {
  wishlistItems, // Array of products in wishlist
  loading, // Boolean - fetching from Firestore
  error, // Error message if any
  addToWishlist, // Function
  removeFromWishlist, // Function
  toggleWishlist, // Function
  isInWishlist, // Function
  fetchWishlist, // Function
} = useWishlist();
```

---

## 🎯 Usage Examples

### **Example 1: Wishlist Screen**

```jsx
import { useWishlist } from "../src/context/WishlistContext";

export default function WishlistScreen() {
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();

  if (loading) return <Text>Loading...</Text>;

  return (
    <FlatList
      data={wishlistItems}
      renderItem={({ item }) => (
        <View>
          <Text>{item.title}</Text>
          <TouchableOpacity onPress={() => removeFromWishlist(item.id)}>
            <Text>Remove</Text>
          </TouchableOpacity>
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  );
}
```

### **Example 2: Product Card with Heart Icon**

```jsx
import { useWishlist } from "../src/context/WishlistContext";
import { Ionicons } from "@expo/vector-icons";

export default function ProductCard({ product }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const liked = isInWishlist(product.id);

  return (
    <View>
      <Image source={{ uri: product.images[0] }} />
      <Text>{product.title}</Text>

      <TouchableOpacity onPress={() => toggleWishlist(product)}>
        <Ionicons
          name={liked ? "heart" : "heart-outline"}
          size={24}
          color={liked ? "red" : "gray"}
        />
      </TouchableOpacity>
    </View>
  );
}
```

### **Example 3: Add to Wishlist with Toast**

```jsx
const { addToWishlist } = useWishlist();

const handleAddWishlist = async (product) => {
  try {
    await addToWishlist(product);
    alert("Added to wishlist! ❤️");
  } catch (err) {
    alert("Failed to add: " + err.message);
  }
};
```

---

## 🔑 Key Features

✅ **Real-Time Sync**: Changes sync instantly across all devices
✅ **Auto-Fetch**: Wishlist loads when user logs in
✅ **Error Handling**: Built-in error messages
✅ **Loading States**: Loading indicator support
✅ **User-Scoped**: Each user has their own wishlist
✅ **Document Auto-Create**: Creates Firestore doc if doesn't exist
✅ **Array Operations**: Uses `arrayUnion` and `arrayRemove` for efficiency

---

## ⚙️ Technical Details

### **Firestore Operations Used:**

```javascript
import {
  doc, // Reference to document
  getDoc, // Get document once
  setDoc, // Create new document
  updateDoc, // Update existing document
  arrayUnion, // Add to array
  arrayRemove, // Remove from array
  onSnapshot, // Real-time listener
} from "firebase/firestore";
```

### **Real-Time Updates:**

The context uses `onSnapshot` for real-time updates:

- When you add/remove item → UI updates instantly
- Multiple devices sync automatically
- No need to manually refresh

### **Authentication:**

Uses `useAuth()` from AuthContext:

- Wishlist data is per-user (`user.uid`)
- Auto-clears when user logs out
- Fetches when user logs in

---

## 🚀 Initialization Checklist

- [ ] Firebase configured in `services/firebase.js` ✅
- [ ] Firestore enabled in Firebase Console ✅
- [ ] AuthProvider wrapping app ✅
- [ ] WishlistProvider wrapping app ✅
- [ ] User authenticated before using wishlist ✅

---

## 🔐 Firebase Security Rules

**Recommended Firestore Rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /wishlist/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

This ensures users can only access their own wishlist.

---

## ❌ Common Issues & Solutions

### **Issue: "User not authenticated"**

**Solution**: Ensure user is logged in before using wishlist functions.

```javascript
const { user } = useAuth();
if (!user) {
  return <Text>Please log in to use wishlist</Text>;
}
```

### **Issue: Wishlist not loading**

**Solution**: Check Firestore permissions and ensure `db` is exported from firebase.js.

### **Issue: Changes not syncing**

**Solution**: Real-time updates use `onSnapshot`. Changes should be instant. Check Firestore rules.

---

## 📱 UI Integration

Your existing Wishlist components work as-is! Just replace:

```javascript
// OLD (local state)
const { wishlistItems, toggleWishlist } = useWishlist();

// NEW (Firestore - same API!)
const { wishlistItems, toggleWishlist } = useWishlist();
```

The API is identical, so no component changes needed. ✨

---

## 🧪 Testing

**Test in Firestore Console:**

1. Login to your app
2. Add item to wishlist
3. Go to Firebase Console → Firestore
4. Navigate to: `wishlist` collection → your `user.uid` document
5. See items array populated ✅
6. Remove from app → Check Firestore updates ✅

---

## 📊 Performance Notes

- ✅ `arrayUnion/arrayRemove` are atomic operations (fast)
- ✅ Real-time listener uses efficient delta updates
- ✅ Firestore auto-indexes these queries
- ✅ No pagination needed for typical wishlist sizes

---

**You're all set! Your Wishlist is now fully Firestore-integrated.** 🎉
