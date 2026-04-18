import {
    collection,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { db } from "../services/firebase";
import { useAuth } from "./AuthContext";

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch user orders from Firestore
    const fetchOrders = useCallback(() => {
        if (!user) {
            setOrders([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Query orders where userId matches current user
            const ordersQuery = query(
                collection(db, "orders"),
                where("userId", "==", user.uid)
            );

            // Real-time listener
            const unsubscribe = onSnapshot(
                ordersQuery,
                (querySnapshot) => {
                    const ordersData = [];
                    querySnapshot.forEach((doc) => {
                        ordersData.push({
                            id: doc.id,
                            ...doc.data(),
                        });
                    });
                    // Sort by date descending (newest first)
                    ordersData.sort((a, b) => {
                        const dateA = a.createdAt?.toDate?.() || new Date(0);
                        const dateB = b.createdAt?.toDate?.() || new Date(0);
                        return dateB - dateA;
                    });
                    setOrders(ordersData);
                    setLoading(false);
                },
                (err) => {
                    console.error("Error fetching orders:", err);
                    setError(err.message);
                    setLoading(false);
                }
            );

            return unsubscribe;
        } catch (err) {
            console.error("Error setting up orders listener:", err);
            setError(err.message);
            setLoading(false);
        }
    }, [user]);

    // Fetch orders when user changes
    useEffect(() => {
        if (user) {
            const unsubscribe = fetchOrders();
            return () => {
                if (unsubscribe) unsubscribe();
            };
        } else {
            setOrders([]);
        }
    }, [user, fetchOrders]);

    // Get order by ID
    const getOrderById = (orderId) => {
        return orders.find((order) => order.id === orderId);
    };

    // Get total number of orders
    const getTotalOrders = () => {
        return orders.length;
    };

    // Get pending orders
    const getPendingOrders = () => {
        return orders.filter((order) => order.status === "Pending");
    };

    // Get total spent
    const getTotalSpent = () => {
        return orders.reduce((sum, order) => sum + (order.total || 0), 0);
    };

    const value = {
        orders,
        loading,
        error,
        getOrderById,
        getTotalOrders,
        getPendingOrders,
        getTotalSpent,
    };

    return (
        <OrdersContext.Provider value={value}>
            {children}
        </OrdersContext.Provider>
    );
};

export const useOrders = () => {
    const context = useContext(OrdersContext);

    if (!context) {
        throw new Error("useOrders must be used within OrdersProvider");
    }

    return context;
};
