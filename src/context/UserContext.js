import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { db } from "../services/firebase";
import { useAuth } from "./AuthContext";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user profile from Firestore
  const fetchUserProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setAddresses([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const userDocRef = doc(db, "users", user.uid);
      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        setProfile({
          uid: user.uid,
          name: userData.name || user.displayName || "User",
          email: userData.email || user.email || "",
          photoURL: userData.photoURL || user.photoURL || "",
        });
        setAddresses(userData.addresses || []);
      } else {
        // Create default profile document using setDoc with merge
        const defaultProfileData = {
          name: user.displayName || "User",
          email: user.email || "",
          photoURL: user.photoURL || "",
          addresses: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        try {
          await setDoc(userDocRef, defaultProfileData, { merge: true });
        } catch (err) {
          console.error("Error creating user doc:", err);
        }

        setProfile({
          uid: user.uid,
          name: user.displayName || "User",
          email: user.email || "",
          photoURL: user.photoURL || "",
        });
        setAddresses([]);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError(err.message);
      setLoading(false);
    }
  }, [user]);

  // Update user profile
  const updateUserProfile = async (updates) => {
    if (!user || !user.uid) {
      setError("User not authenticated");
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const userDocRef = doc(db, "users", user.uid);
      const cleanUpdates = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      // Use setDoc with merge: true to create or update (prevents "No document to update" error)
      await setDoc(userDocRef, cleanUpdates, { merge: true });

      setProfile((prev) => ({
        ...prev,
        ...updates,
      }));

      setLoading(false);
      return true;
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  // Add new address
  const addAddress = async (address) => {
    if (!user) {
      setError("User not authenticated");
      return false;
    }

    try {
      setLoading(true);
      const newAddress = {
        id: Date.now().toString(),
        ...address,
        isDefault: addresses.length === 0,
      };

      const updatedAddresses = [...addresses, newAddress];
      const userDocRef = doc(db, "users", user.uid);

      // Use setDoc with merge: true to prevent "No document to update" error
      await setDoc(
        userDocRef,
        {
          addresses: updatedAddresses,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      setAddresses(updatedAddresses);
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Error adding address:", err);
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  // Update address
  const updateAddress = async (id, addressData) => {
    if (!user) {
      setError("User not authenticated");
      return false;
    }

    try {
      setLoading(true);
      const updatedAddresses = addresses.map((addr) =>
        addr.id === id ? { ...addr, ...addressData } : addr,
      );

      const userDocRef = doc(db, "users", user.uid);
      // Use setDoc with merge: true to prevent "No document to update" error
      await setDoc(
        userDocRef,
        {
          addresses: updatedAddresses,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      setAddresses(updatedAddresses);
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Error updating address:", err);
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  // Delete address
  const deleteAddress = async (id) => {
    if (!user) {
      setError("User not authenticated");
      return false;
    }

    try {
      setLoading(true);
      const updatedAddresses = addresses.filter((addr) => addr.id !== id);

      const userDocRef = doc(db, "users", user.uid);
      // Use setDoc with merge: true to prevent "No document to update" error
      await setDoc(
        userDocRef,
        {
          addresses: updatedAddresses,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      setAddresses(updatedAddresses);
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Error deleting address:", err);
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  // Set default address
  const setDefaultAddress = async (id) => {
    if (!user) {
      setError("User not authenticated");
      return false;
    }

    try {
      setLoading(true);
      const updatedAddresses = addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }));

      const userDocRef = doc(db, "users", user.uid);
      // Use setDoc with merge: true to prevent "No document to update" error
      await setDoc(
        userDocRef,
        {
          addresses: updatedAddresses,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      setAddresses(updatedAddresses);
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Error setting default address:", err);
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  // Fetch profile on user change
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user, fetchUserProfile]);

  const value = {
    profile,
    addresses,
    loading,
    error,
    updateUserProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    fetchUserProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};
