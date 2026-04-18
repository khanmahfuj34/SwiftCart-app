import {
    arrayRemove,
    arrayUnion,
    doc,
    getDoc,
    onSnapshot,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { db } from "../services/firebase";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch wishlist from Firestore
    const fetchWishlist = useCallback(() => {
        if (!user) {
            setWishlistItems([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const wishlistDocRef = doc(db, "wishlist", user.uid);

            // Real-time listener
            const unsubscribe = onSnapshot(
                wishlistDocRef,
                (docSnapshot) => {
                    if (docSnapshot.exists()) {
                        setWishlistItems(docSnapshot.data().items || []);
                    } else {
                        setWishlistItems([]);
                    }
                    setLoading(false);
                },
                (err) => {
                    console.error("Error fetching wishlist:", err);
                    setError(err.message);
                    setLoading(false);
                },
            );

            return unsubscribe;
        } catch (err) {
            console.error("Error setting up wishlist listener:", err);
            setError(err.message);
            setLoading(false);
        }
    }, [user]);

    // Add item to wishlist
    const addToWishlist = async (product) => {
        if (!user) {
            setError("User not authenticated");
            return;
        }

        try {
            // Extract single image URL
            let imageUrl = "";
            if (Array.isArray(product?.images) && product.images.length > 0) {
                const firstImage = product.images[0];
                imageUrl = typeof firstImage === "string" ? firstImage : firstImage?.url || "";
            } else if (typeof product?.image === "string") {
                imageUrl = product.image;
            }

            const cleanProduct = {
                id: product?.id || "",
                title: product?.title || "",
                price: product?.price || 0,
                image: imageUrl,
                category: product?.category?.name || "",
            };

            const wishlistDocRef = doc(db, "wishlist", user.uid);
            const docSnapshot = await getDoc(wishlistDocRef);

            const userMetadata = {
                email: user.email || "",
                name: user.displayName || "User",
                updatedAt: new Date(),
            };

            if (docSnapshot.exists()) {
                await updateDoc(wishlistDocRef, {
                    items: arrayUnion(cleanProduct),
                    ...userMetadata,
                });
            } else {
                await setDoc(
                    wishlistDocRef,
                    {
                        items: [cleanProduct],
                        ...userMetadata,
                        createdAt: new Date(),
                    },
                    { merge: true }
                );
            }

            console.log("Item added to wishlist");
        } catch (err) {
            console.error("Error adding to wishlist:", err);
            setError(err.message);
        }
    };

    // Remove item from wishlist
    const removeFromWishlist = async (productId) => {
        if (!user) {
            setError("User not authenticated");
            return;
        }

        try {
            const wishlistDocRef = doc(db, "wishlist", user.uid);

            const productToRemove = wishlistItems.find(
                (item) => item.id === productId,
            );

            if (productToRemove) {
                await updateDoc(wishlistDocRef, {
                    items: arrayRemove(productToRemove),
                });
                console.log("Item removed from wishlist");
            }
        } catch (err) {
            console.error("Error removing from wishlist:", err);
            setError(err.message);
        }
    };

    // Toggle wishlist
    const toggleWishlist = async (product) => {
        const isInList = wishlistItems.some((item) => item.id === product.id);

        if (isInList) {
            await removeFromWishlist(product.id);
        } else {
            await addToWishlist(product);
        }
    };

    // Check if product is in wishlist
    const isInWishlist = (id) => {
        return wishlistItems.some((item) => item.id === id);
    };

    // Fetch wishlist when user changes
    useEffect(() => {
        if (user) {
            const unsubscribe = fetchWishlist();
            return () => {
                if (unsubscribe) unsubscribe();
            };
        } else {
            setWishlistItems([]);
        }
    }, [user, fetchWishlist]);

    const value = {
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        loading,
        error,
        fetchWishlist,
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlist must be used within WishlistProvider");
    }
    return context;
};
