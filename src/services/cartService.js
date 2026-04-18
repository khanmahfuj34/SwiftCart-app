import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot,
    query,
    Timestamp,
    updateDoc,
    where
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Get all cart items for a user
 */
export const getUserCart = async (userId) => {
  try {
    const cartRef = collection(db, "users", userId, "cart");
    const snapshot = await getDocs(cartRef);
    const items = [];

    snapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return items;
  } catch (error) {
    console.error("Error getting user cart:", error);
    throw error;
  }
};

/**
 * Subscribe to real-time cart updates
 */
export const subscribeToUserCart = (userId, callback) => {
  try {
    const cartRef = collection(db, "users", userId, "cart");
    const q = query(cartRef);

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
    console.error("Error subscribing to user cart:", error);
    return () => {};
  }
};

/**
 * Add item to cart
 */
export const addToUserCart = async (userId, productData) => {
  try {
    const cartRef = collection(db, "users", userId, "cart");

    // Check if item already exists
    const existingQuery = query(
      cartRef,
      where("productId", "==", productData.productId),
    );
    const existingSnapshot = await getDocs(existingQuery);

    if (!existingSnapshot.empty) {
      // Update quantity if product already in cart
      const existingDoc = existingSnapshot.docs[0];
      const newQuantity =
        (existingDoc.data().quantity || 1) + (productData.quantity || 1);
      await updateDoc(existingDoc.ref, { quantity: newQuantity });
      return {
        id: existingDoc.id,
        ...existingDoc.data(),
        quantity: newQuantity,
      };
    }

    // Add new item
    const cartItem = {
      productId: productData.productId,
      title: productData.title || "",
      price: productData.price || 0,
      image: productData.image || "",
      quantity: productData.quantity || 1,
      category: productData.category || "",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(cartRef, cartItem);
    return { id: docRef.id, ...cartItem };
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

/**
 * Update cart item quantity
 */
export const updateCartItemQuantity = async (userId, itemId, quantity) => {
  try {
    const itemRef = doc(db, "users", userId, "cart", itemId);

    if (quantity <= 0) {
      // Delete if quantity is 0 or less
      await deleteDoc(itemRef);
      return null;
    }

    await updateDoc(itemRef, {
      quantity: quantity,
      updatedAt: Timestamp.now(),
    });

    return { id: itemId, quantity };
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

/**
 * Remove item from cart
 */
export const removeFromUserCart = async (userId, itemId) => {
  try {
    const itemRef = doc(db, "users", userId, "cart", itemId);
    await deleteDoc(itemRef);
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};

/**
 * Clear user's entire cart
 */
export const clearUserCart = async (userId) => {
  try {
    const cartRef = collection(db, "users", userId, "cart");
    const snapshot = await getDocs(cartRef);

    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};

/**
 * Get cart total price
 */
export const getCartTotal = async (userId) => {
  try {
    const items = await getUserCart(userId);
    const total = items.reduce((sum, item) => {
      return sum + (item.price || 0) * (item.quantity || 1);
    }, 0);

    return total;
  } catch (error) {
    console.error("Error calculating cart total:", error);
    return 0;
  }
};
