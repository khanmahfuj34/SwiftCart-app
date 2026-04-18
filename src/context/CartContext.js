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

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCart = useCallback(() => {
        if (!user) {
            setCartItems([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const cartDocRef = doc(db, "cart", user.uid);

            const unsubscribe = onSnapshot(
                cartDocRef,
                (docSnapshot) => {
                    if (docSnapshot.exists()) {
                        setCartItems(docSnapshot.data().items || []);
                    } else {
                        setCartItems([]);
                    }
                    setLoading(false);
                },
                (err) => {
                    console.error("Error fetching cart:", err);
                    setError(err.message);
                    setLoading(false);
                },
            );

            return unsubscribe;
        } catch (err) {
            console.error("Error setting up cart listener:", err);
            setError(err.message);
            setLoading(false);
        }
    }, [user]);

    const addToCart = async (product) => {
        if (!user) {
            setError("User not authenticated");
            return;
        }

        try {
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
                quantity: 1,
            };

            const cartDocRef = doc(db, "cart", user.uid);
            const docSnapshot = await getDoc(cartDocRef);

            const existingItems = docSnapshot.exists() ? docSnapshot.data().items || [] : [];
            const existingItem = existingItems.find((item) => item.id === cleanProduct.id);

            if (existingItem) {
                const updatedItems = existingItems.map((item) =>
                    item.id === cleanProduct.id ? { ...item, quantity: item.quantity + 1 } : item,
                );
                await updateDoc(cartDocRef, {
                    items: updatedItems,
                    updatedAt: new Date(),
                });
            } else {
                const userMetadata = {
                    email: user.email || "",
                    updatedAt: new Date(),
                };

                if (docSnapshot.exists()) {
                    await updateDoc(cartDocRef, {
                        items: arrayUnion(cleanProduct),
                        ...userMetadata,
                    });
                } else {
                    await setDoc(
                        cartDocRef,
                        {
                            items: [cleanProduct],
                            ...userMetadata,
                            createdAt: new Date(),
                        },
                        { merge: true }
                    );
                }
            }

            console.log("Item added to cart");
        } catch (err) {
            console.error("Error adding to cart:", err);
            setError(err.message);
        }
    };

    const removeFromCart = async (productId) => {
        if (!user) {
            setError("User not authenticated");
            return;
        }

        try {
            const cartDocRef = doc(db, "cart", user.uid);
            const productToRemove = cartItems.find((item) => item.id === productId);

            if (productToRemove) {
                await updateDoc(cartDocRef, {
                    items: arrayRemove(productToRemove),
                });
                console.log("Item removed from cart");
            }
        } catch (err) {
            console.error("Error removing from cart:", err);
            setError(err.message);
        }
    };

    const increaseQuantity = async (productId) => {
        if (!user) {
            setError("User not authenticated");
            return;
        }

        try {
            const cartDocRef = doc(db, "cart", user.uid);
            const docSnapshot = await getDoc(cartDocRef);

            if (docSnapshot.exists()) {
                const items = docSnapshot.data().items || [];
                const updatedItems = items.map((item) =>
                    item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
                );

                await updateDoc(cartDocRef, {
                    items: updatedItems,
                    updatedAt: new Date(),
                });
            }
        } catch (err) {
            console.error("Error increasing quantity:", err);
            setError(err.message);
        }
    };

    const decreaseQuantity = async (productId) => {
        if (!user) {
            setError("User not authenticated");
            return;
        }

        try {
            const cartDocRef = doc(db, "cart", user.uid);
            const docSnapshot = await getDoc(cartDocRef);

            if (docSnapshot.exists()) {
                const items = docSnapshot.data().items || [];
                const updatedItems = items
                    .map((item) =>
                        item.id === productId
                            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
                            : item,
                    )
                    .filter((item) => item.quantity > 0);

                await updateDoc(cartDocRef, {
                    items: updatedItems,
                    updatedAt: new Date(),
                });
            }
        } catch (err) {
            console.error("Error decreasing quantity:", err);
            setError(err.message);
        }
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const clearCart = async () => {
        if (!user) {
            setError("User not authenticated");
            return;
        }

        try {
            const cartDocRef = doc(db, "cart", user.uid);
            await updateDoc(cartDocRef, {
                items: [],
                updatedAt: new Date(),
            });
            console.log("Cart cleared");
        } catch (err) {
            console.error("Error clearing cart:", err);
            setError(err.message);
        }
    };

    useEffect(() => {
        if (user) {
            const unsubscribe = fetchCart();
            return () => {
                if (unsubscribe) unsubscribe();
            };
        } else {
            setCartItems([]);
        }
    }, [user, fetchCart]);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        getTotalItems,
        getTotalPrice,
        clearCart,
        loading,
        error,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }

    return context;
};
