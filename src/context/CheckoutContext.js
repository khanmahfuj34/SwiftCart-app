import { addDoc, collection, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../services/firebase";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
    const { user } = useAuth();
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addresses, setAddresses] = useState([]);

    const [cardDetails, setCardDetails] = useState({
        number: "",
        expiry: "",
        cvv: "",
    });

    // Load addresses from Firestore
    useEffect(() => {
        if (!user?.uid) {
            setLoading(false);
            return;
        }

        const addressesRef = collection(db, "users", user.uid, "addresses");
        const unsubscribe = onSnapshot(
            addressesRef,
            (snapshot) => {
                const loadedAddresses = snapshot.docs.map((docSnap) => ({
                    id: docSnap.id,
                    ...docSnap.data(),
                }));
                setAddresses(loadedAddresses);

                // Auto-select default address if none selected
                const defaultAddr = loadedAddresses.find((a) => a.isDefault);
                if (defaultAddr && !selectedAddress) {
                    setSelectedAddress(defaultAddr.id);
                }

                setLoading(false);
            },
            (error) => {
                console.error("Error loading addresses:", error);
                setError("Failed to load addresses");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user?.uid]);

    const addAddress = (newAddress) => {
        setAddresses([...addresses, {...newAddress, id: addresses.length + 1 }]);
    };

    const updateAddress = (id, updatedAddress) => {
        setAddresses(
            addresses.map((addr) =>
                addr.id === id ? {...addr, ...updatedAddress } : addr,
            ),
        );
    };

    const deleteAddress = (id) => {
        setAddresses(addresses.filter((addr) => addr.id !== id));
    };

    const setDefaultAddress = (id) => {
        setAddresses(
            addresses.map((addr) => ({...addr, isDefault: addr.id === id })),
        );
    };

    // Validate checkout data
    const validateCheckout = (cartItems) => {
        if (!cartItems || cartItems.length === 0) {
            setError("Cart is empty. Please add items before checkout.");
            return false;
        }
        if (!selectedAddress) {
            setError("Please select a delivery address.");
            return false;
        }
        if (!selectedDelivery) {
            setError("Please select a delivery method.");
            return false;
        }
        if (!selectedPayment) {
            setError("Please select a payment method.");
            return false;
        }
        return true;
    };

    // Place order
    const placeOrder = async(cartItems, subtotal, deliveryFee, total) => {
        if (!user) {
            setError("User not authenticated");
            return null;
        }

        // Validate
        if (!validateCheckout(cartItems)) {
            return null;
        }

        try {
            setLoading(true);
            setError(null);

            const selectedAddr = addresses.find((a) => a.id === selectedAddress);

            const paymentMethodNames = {
                1: "Cash on Delivery",
                2: "Credit/Debit Card",
                3: "bKash",
                4: "Nagad",
            };

            const deliveryNames = {
                1: "Standard Delivery",
                2: "Express Delivery",
            };

            const cleanCartItems = cartItems.map((item) => ({
                id: item.id || "",
                title: item.title || "",
                price: item.price || 0,
                image: item.image || "",
                quantity: item.quantity || 1,
                selectedSize: item.selectedSize || "",
                selectedColor: item.selectedColor || "",
            }));

            const orderData = {
                userId: user.uid,
                email: user.email || "",
                items: cleanCartItems,
                subtotal: subtotal || 0,
                deliveryFee: deliveryFee || 0,
                total: total || 0,
                address: selectedAddr || {},
                paymentMethod: paymentMethodNames[selectedPayment] || "",
                deliveryType: deliveryNames[selectedDelivery] || "",
                status: "Pending",
                createdAt: serverTimestamp(),
            };

            // Save order to Firestore
            const ordersCollection = collection(db, "orders");
            const docRef = await addDoc(ordersCollection, orderData);

            // Create user orders reference
            const userOrdersRef = doc(db, "orders", user.uid);
            await setDoc(
                userOrdersRef, {
                    userId: user.uid,
                    email: user.email,
                    updatedAt: serverTimestamp(),
                }, { merge: true }
            );

            setLoading(false);
            return docRef.id;
        } catch (err) {
            console.error("Error placing order:", err);
            setError(err.message);
            setLoading(false);
            return null;
        }
    };

    // Reset checkout state
    const resetCheckout = () => {
        setSelectedAddress(null);
        setSelectedDelivery(null);
        setSelectedPayment(null);
        setCurrentStep(1);
        setError(null);
    };

    return (
        <CheckoutContext.Provider value={{
            selectedAddress,
            setSelectedAddress,
            selectedDelivery,
            setSelectedDelivery,
            selectedPayment,
            setSelectedPayment,
            currentStep,
            setCurrentStep,
            addresses,
            addAddress,
            updateAddress,
            deleteAddress,
            setDefaultAddress,
            cardDetails,
            setCardDetails,
            placeOrder,
            validateCheckout,
            resetCheckout,
            loading,
            error,
            setError,
        }}>
            {children}
        </CheckoutContext.Provider>
    );
};

export const useCheckout = () => useContext(CheckoutContext);
