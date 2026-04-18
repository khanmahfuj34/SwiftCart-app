import {
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    setDoc,
    Timestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytes,
} from "firebase/storage";
import { db, storage } from "./firebase";

/**
 * Create a new user document in Firestore
 * Called immediately after Firebase Auth signup
 */
export const createUserProfile = async (userId, { fullName, email }) => {
  try {
    const userRef = doc(db, "users", userId);
    const userData = {
      uid: userId,
      fullName: fullName || "",
      email: email,
      photoURL: null,
      phone: "",
      gender: "",
      dateOfBirth: null,
      role: "user",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      lastLogin: Timestamp.now(),
      isVerified: false,
      defaultAddressId: null,
    };

    await setDoc(userRef, userData);
    return userData;
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

/**
 * Get user profile by UID
 */
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

/**
 * Subscribe to real-time user profile updates
 */
export const subscribeToUserProfile = (userId, callback) => {
  try {
    const userRef = doc(db, "users", userId);

    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      } else {
        callback(null);
      }
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error subscribing to user profile:", error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, "users", userId);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(userRef, updateData);
    return updateData;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

/**
 * Update last login timestamp
 */
export const updateLastLogin = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      lastLogin: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating last login:", error);
    throw error;
  }
};

/**
 * Upload user profile photo to Firebase Storage
 * Returns download URL
 */
export const uploadProfilePhoto = async (userId, imageUri) => {
  try {
    // Validate userId
    if (!userId) {
      throw new Error("User ID is required for photo upload");
    }

    // Create storage reference: users/{uid}/profile.jpg
    const storageRef = ref(storage, `users/${userId}/profile.jpg`);

    // Convert URI to blob
    let blob;
    try {
      const response = await fetch(imageUri, {
        method: "GET",
        headers: {
          Accept: "*/*",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      blob = await response.blob();

      if (blob.size === 0) {
        throw new Error("Image blob is empty");
      }

      if (blob.size > 5 * 1024 * 1024) {
        throw new Error("Image size exceeds 5MB limit");
      }
    } catch (fetchError) {
      console.error("Error fetching image:", fetchError);
      throw new Error(`Failed to process image: ${fetchError.message}`);
    }

    // Upload blob with retry logic
    let uploadError = null;
    let retries = 3;

    while (retries > 0) {
      try {
        await uploadBytes(storageRef, blob, {
          contentType: "image/jpeg",
          customMetadata: {
            uploadedBy: userId,
            uploadedAt: new Date().toISOString(),
          },
        });
        uploadError = null;
        break;
      } catch (error) {
        uploadError = error;
        retries--;
        if (retries > 0) {
          // Wait before retry
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }

    if (uploadError) {
      console.error("Upload failed after retries:", uploadError);
      throw uploadError;
    }

    // Get download URL
    let downloadURL;
    try {
      downloadURL = await getDownloadURL(storageRef);
    } catch (urlError) {
      console.error("Error getting download URL:", urlError);
      throw new Error(
        "Photo uploaded but failed to get URL. Please try again.",
      );
    }

    // Update user profile with photoURL
    try {
      await updateUserProfile(userId, { photoURL: downloadURL });
    } catch (updateError) {
      console.error("Error updating profile with photo URL:", updateError);
      // Even if profile update fails, return the URL
      console.warn("Photo URL obtained but profile update failed");
    }

    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    // Provide user-friendly error message
    if (error.code === "storage/cors-not-allowed") {
      throw new Error(
        "Upload temporarily unavailable. Please try again in a moment.",
      );
    }
    if (error.message.includes("CORS")) {
      throw new Error(
        "Network error. Please check your connection and try again.",
      );
    }
    throw error;
  }
};

/**
 * Delete user profile photo
 */
export const deleteProfilePhoto = async (userId) => {
  try {
    const storageRef = ref(storage, `users/${userId}/profile.jpg`);
    await deleteObject(storageRef);

    // Update user profile to remove photoURL
    await updateUserProfile(userId, { photoURL: null });
  } catch (error) {
    console.error("Error deleting profile photo:", error);
    throw error;
  }
};

/**
 * Get user wishlist count
 */
export const getUserWishlistCount = async (userId) => {
  try {
    const wishlistRef = collection(db, "users", userId, "wishlist");
    const snapshot = await getDocs(wishlistRef);
    return snapshot.size;
  } catch (error) {
    console.error("Error getting wishlist count:", error);
    return 0;
  }
};

/**
 * Subscribe to user wishlist count
 */
export const subscribeToWishlistCount = (userId, callback) => {
  try {
    const wishlistRef = collection(db, "users", userId, "wishlist");
    const q = query(wishlistRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      callback(snapshot.size);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error subscribing to wishlist count:", error);
    return () => {};
  }
};

/**
 * Get user cart count (total quantity)
 */
export const getUserCartCount = async (userId) => {
  try {
    const cartRef = collection(db, "users", userId, "cart");
    const snapshot = await getDocs(cartRef);
    let totalQuantity = 0;

    snapshot.forEach((doc) => {
      totalQuantity += doc.data().quantity || 0;
    });

    return totalQuantity;
  } catch (error) {
    console.error("Error getting cart count:", error);
    return 0;
  }
};

/**
 * Subscribe to user cart count
 */
export const subscribeToCartCount = (userId, callback) => {
  try {
    const cartRef = collection(db, "users", userId, "cart");
    const q = query(cartRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let totalQuantity = 0;
      snapshot.forEach((doc) => {
        totalQuantity += doc.data().quantity || 0;
      });
      callback(totalQuantity);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error subscribing to cart count:", error);
    return () => {};
  }
};

/**
 * Get user notifications count
 */
export const getUserNotificationsCount = async (userId) => {
  try {
    const notificationsRef = collection(db, "users", userId, "notifications");
    const unreadQuery = query(notificationsRef, where("read", "==", false));
    const snapshot = await getDocs(unreadQuery);
    return snapshot.size;
  } catch (error) {
    console.error("Error getting notifications count:", error);
    return 0;
  }
};

/**
 * Subscribe to user notifications count
 */
export const subscribeToNotificationsCount = (userId, callback) => {
  try {
    const notificationsRef = collection(db, "users", userId, "notifications");
    const unreadQuery = query(notificationsRef, where("read", "==", false));

    const unsubscribe = onSnapshot(unreadQuery, (snapshot) => {
      callback(snapshot.size);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error subscribing to notifications count:", error);
    return () => {};
  }
};

/**
 * Get user addresses
 */
export const getUserAddresses = async (userId) => {
  try {
    const addressesRef = collection(db, "users", userId, "addresses");
    const snapshot = await getDocs(addressesRef);
    const addresses = [];

    snapshot.forEach((doc) => {
      addresses.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return addresses;
  } catch (error) {
    console.error("Error getting user addresses:", error);
    return [];
  }
};

/**
 * Subscribe to user addresses
 */
export const subscribeToUserAddresses = (userId, callback) => {
  try {
    const addressesRef = collection(db, "users", userId, "addresses");
    const q = query(addressesRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const addresses = [];
      snapshot.forEach((doc) => {
        addresses.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      callback(addresses);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error subscribing to user addresses:", error);
    return () => {};
  }
};

/**
 * Add address
 */
export const addUserAddress = async (userId, addressData) => {
  try {
    const addressRef = doc(collection(db, "users", userId, "addresses"));

    const newAddress = {
      fullName: addressData.fullName || "",
      phone: addressData.phone || "",
      division: addressData.division || "",
      district: addressData.district || "",
      area: addressData.area || "",
      postalCode: addressData.postalCode || "",
      addressLine: addressData.addressLine || "",
      type: addressData.type || "Home",
      isDefault: addressData.isDefault || false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await setDoc(addressRef, newAddress);
    return { id: addressRef.id, ...newAddress };
  } catch (error) {
    console.error("Error adding address:", error);
    throw error;
  }
};

/**
 * Update address
 */
export const updateUserAddress = async (userId, addressId, updates) => {
  try {
    const addressRef = doc(db, "users", userId, "addresses", addressId);

    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(addressRef, updateData);
    return updateData;
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
};

/**
 * Delete address
 */
export const deleteUserAddress = async (userId, addressId) => {
  try {
    const addressRef = doc(db, "users", userId, "addresses", addressId);
    await updateDoc(addressRef, { deleted: true, deletedAt: Timestamp.now() });
  } catch (error) {
    console.error("Error deleting address:", error);
    throw error;
  }
};

/**
 * Set default address
 */
export const setDefaultAddress = async (userId, addressId) => {
  try {
    // First, unset all other addresses as default
    const addressesRef = collection(db, "users", userId, "addresses");
    const snapshot = await getDocs(addressesRef);

    const updates = snapshot.docs.map((doc) =>
      updateDoc(doc.ref, { isDefault: false }),
    );

    await Promise.all(updates);

    // Then set the selected address as default
    const selectedAddressRef = doc(db, "users", userId, "addresses", addressId);
    await updateDoc(selectedAddressRef, { isDefault: true });

    // Update user profile with default address ID
    await updateUserProfile(userId, { defaultAddressId: addressId });
  } catch (error) {
    console.error("Error setting default address:", error);
    throw error;
  }
};
