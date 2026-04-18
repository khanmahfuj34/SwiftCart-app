import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot,
    query,
    Timestamp,
    where,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Get all wishlist items for a user
 */
export const getUserWishlist = async (userId) => {
  try {
    const wishlistRef = collection(db, "users", userId, "wishlist");
    const snapshot = await getDocs(wishlistRef);
    const items = [];

    snapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return items;
  } catch (error) {
    console.error("Error getting user wishlist:", error);
    throw error;
  }
};

/**
 * Subscribe to real-time wishlist updates
 */
export const subscribeToUserWishlist = (userId, callback) => {
  try {
    const wishlistRef = collection(db, "users", userId, "wishlist");
    const q = query(wishlistRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      callback(items);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error subscribing to user wishlist:", error);
    return () => {};
  }
};

/**
 * Add item to wishlist
 */
export const addToUserWishlist = async (userId, productData) => {
  try {
    const wishlistRef = collection(db, "users", userId, "wishlist");

    // Check if item already exists
    const existingQuery = query(
      wishlistRef,
      where("productId", "==", productData.productId),
    );
    const existingSnapshot = await getDocs(existingQuery);

    if (!existingSnapshot.empty) {
      // Item already in wishlist
      return {
        id: existingSnapshot.docs[0].id,
        ...existingSnapshot.docs[0].data(),
      };
    }

    // Add new item
    const wishlistItem = {
      productId: productData.productId,
      title: productData.title || "",
      price: productData.price || 0,
      image: productData.image || "",
      category: productData.category || "",
      rating: productData.rating || 0,
      reviews: productData.reviews || 0,
      createdAt: Timestamp.now(),
      addedAt: Timestamp.now(),
    };

    const docRef = await addDoc(wishlistRef, wishlistItem);
    return { id: docRef.id, ...wishlistItem };
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
};

/**
 * Remove item from wishlist
 */
export const removeFromUserWishlist = async (userId, itemId) => {
  try {
    const itemRef = doc(db, "users", userId, "wishlist", itemId);
    await deleteDoc(itemRef);
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
};

/**
 * Check if product is in wishlist
 */
export const isProductInWishlist = async (userId, productId) => {
  try {
    const wishlistRef = collection(db, "users", userId, "wishlist");
    const q = query(wishlistRef, where("productId", "==", productId));
    const snapshot = await getDocs(q);

    return !snapshot.empty;
  } catch (error) {
    console.error("Error checking wishlist:", error);
    return false;
  }
};

/**
 * Clear user's entire wishlist
 */
export const clearUserWishlist = async (userId) => {
  try {
    const wishlistRef = collection(db, "users", userId, "wishlist");
    const snapshot = await getDocs(wishlistRef);

    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    throw error;
  }
};

/**
 * Move wishlist item to cart
 */
export const moveWishlistToCart = async (
  userId,
  wishlistItemId,
  cartService,
) => {
  try {
    const wishlistRef = doc(db, "users", userId, "wishlist", wishlistItemId);
    const wishlistSnapshot = await getDocs(
      query(
        collection(db, "users", userId, "wishlist"),
        where("__name__", "==", wishlistItemId),
      ),
    );

    if (wishlistSnapshot.empty) {
      throw new Error("Wishlist item not found");
    }

    const wishlistData = wishlistSnapshot.docs[0].data();

    // Add to cart
    await cartService.addToUserCart(userId, wishlistData);

    // Remove from wishlist
    await removeFromUserWishlist(userId, wishlistItemId);
  } catch (error) {
    console.error("Error moving item to cart:", error);
    throw error;
  }
};
