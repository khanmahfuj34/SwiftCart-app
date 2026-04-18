import {
    addDoc,
    collection,
    doc,
    getDocs,
    onSnapshot,
    query,
    Timestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Get all addresses for a user
 */
export const getUserAddresses = async (userId) => {
  try {
    const addressesRef = collection(db, "users", userId, "addresses");
    const q = query(addressesRef);
    const snapshot = await getDocs(q);
    const addresses = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      // Skip deleted addresses
      if (!data.deleted) {
        addresses.push({
          id: doc.id,
          ...data,
        });
      }
    });

    return addresses;
  } catch (error) {
    console.error("Error getting user addresses:", error);
    throw error;
  }
};

/**
 * Subscribe to real-time addresses updates
 */
export const subscribeToUserAddresses = (userId, callback) => {
  try {
    const addressesRef = collection(db, "users", userId, "addresses");
    const q = query(addressesRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const addresses = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Skip deleted addresses
        if (!data.deleted) {
          addresses.push({
            id: doc.id,
            ...data,
          });
        }
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
 * Add new address
 */
export const addUserAddress = async (userId, addressData) => {
  try {
    const addressesRef = collection(db, "users", userId, "addresses");

    const address = {
      fullName: addressData.fullName || "",
      phone: addressData.phone || "",
      division: addressData.division || "",
      district: addressData.district || "",
      area: addressData.area || "",
      postalCode: addressData.postalCode || "",
      fullAddress: addressData.fullAddress || "",
      type: addressData.type || "Home", // Home, Office, Other
      isDefault: addressData.isDefault || false,
      deleted: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(addressesRef, address);
    return { id: docRef.id, ...address };
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
    return { id: addressId, ...updateData };
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
};

/**
 * Delete address (soft delete)
 */
export const deleteUserAddress = async (userId, addressId) => {
  try {
    const addressRef = doc(db, "users", userId, "addresses", addressId);

    await updateDoc(addressRef, {
      deleted: true,
      updatedAt: Timestamp.now(),
    });
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
      updateDoc(doc.ref, { isDefault: false, updatedAt: Timestamp.now() }),
    );

    await Promise.all(updates);

    // Then set the selected address as default
    const selectedAddressRef = doc(db, "users", userId, "addresses", addressId);
    await updateDoc(selectedAddressRef, {
      isDefault: true,
      updatedAt: Timestamp.now(),
    });

    // Update user profile with default address ID
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { defaultAddressId: addressId });
  } catch (error) {
    console.error("Error setting default address:", error);
    throw error;
  }
};

/**
 * Get default address
 */
export const getDefaultUserAddress = async (userId) => {
  try {
    const addressesRef = collection(db, "users", userId, "addresses");
    const q = query(addressesRef, where("isDefault", "==", true));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data(),
    };
  } catch (error) {
    console.error("Error getting default address:", error);
    return null;
  }
};

/**
 * Get addresses by type
 */
export const getUserAddressesByType = async (userId, type) => {
  try {
    const addressesRef = collection(db, "users", userId, "addresses");
    const q = query(addressesRef, where("type", "==", type));
    const snapshot = await getDocs(q);
    const addresses = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (!data.deleted) {
        addresses.push({
          id: doc.id,
          ...data,
        });
      }
    });

    return addresses;
  } catch (error) {
    console.error("Error getting addresses by type:", error);
    throw error;
  }
};

/**
 * Validate Bangladesh phone number format
 * Must be 11 digits starting with 01
 */
export const isValidBangladeshPhone = (phone) => {
  if (!phone) return false;
  const cleaned = phone.replace(/[^0-9]/g, "");
  return /^01[0-9]{9}$/.test(cleaned);
};

/**
 * Format phone number for Bangladesh
 * Input: any number, Output: 01XXXXXXXXX
 */
export const formatBangladeshPhone = (phone) => {
  if (!phone) return "";

  // Remove all non-digits
  let cleaned = phone.replace(/[^0-9]/g, "");

  // Remove leading zeros
  cleaned = cleaned.replace(/^0+/, "");

  // If it starts with 880, remove it (country code)
  if (cleaned.startsWith("880")) {
    cleaned = cleaned.slice(3);
  }

  // Add leading 0 if not present
  if (!cleaned.startsWith("0")) {
    cleaned = "0" + cleaned;
  }

  // Take only first 11 digits
  cleaned = cleaned.slice(0, 11);

  return cleaned;
};
