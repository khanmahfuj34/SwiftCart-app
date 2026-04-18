import React, { createContext, useContext, useEffect, useState } from "react";
import {
    subscribeToCartCount,
    subscribeToNotificationsCount,
    subscribeToUserProfile,
    subscribeToWishlistCount,
    updateUserProfile,
    uploadProfilePhoto,
} from "../services/userService";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Counters
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);

  // Photo upload
  const [uploading, setUploading] = useState(false);

  // Subscribe to profile and counters
  useEffect(() => {
    if (!user || !user.uid) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Subscribe to profile
    const unsubscribeProfile = subscribeToUserProfile(user.uid, (data) => {
      setProfile(data);
      setLoading(false);
    });

    // Subscribe to wishlist count
    const unsubscribeWishlist = subscribeToWishlistCount(user.uid, (count) => {
      setWishlistCount(count);
    });

    // Subscribe to cart count
    const unsubscribeCart = subscribeToCartCount(user.uid, (count) => {
      setCartCount(count);
    });

    // Subscribe to notifications count
    const unsubscribeNotifications = subscribeToNotificationsCount(
      user.uid,
      (count) => {
        setNotificationsCount(count);
      },
    );

    return () => {
      unsubscribeProfile();
      unsubscribeWishlist();
      unsubscribeCart();
      unsubscribeNotifications();
    };
  }, [user]);

  const updateProfileData = async (updates) => {
    try {
      setError(null);
      if (!user || !user.uid) throw new Error("User not authenticated");

      await updateUserProfile(user.uid, updates);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const uploadProfilePhotoAsync = async (imageUri) => {
    try {
      setError(null);
      setUploading(true);

      if (!user || !user.uid) throw new Error("User not authenticated");

      const photoURL = await uploadProfilePhoto(user.uid, imageUri);
      return photoURL;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const value = {
    profile,
    loading,
    error,
    updateProfile: updateProfileData,
    uploadPhoto: uploadProfilePhotoAsync,
    uploading,
    wishlistCount,
    cartCount,
    notificationsCount,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }
  return context;
};
