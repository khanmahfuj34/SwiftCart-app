import {
    addDoc,
    collection,
    doc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
    updateDoc,
    where
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Get all orders for a user
 */
export const getUserOrders = async (userId, limitCount = 50) => {
  try {
    const ordersRef = collection(db, "users", userId, "orders");
    const q = query(ordersRef, orderBy("createdAt", "desc"), limit(limitCount));
    const snapshot = await getDocs(q);
    const orders = [];

    snapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return orders;
  } catch (error) {
    console.error("Error getting user orders:", error);
    throw error;
  }
};

/**
 * Subscribe to real-time orders updates
 */
export const subscribeToUserOrders = (userId, callback, limitCount = 50) => {
  try {
    const ordersRef = collection(db, "users", userId, "orders");
    const q = query(ordersRef, orderBy("createdAt", "desc"), limit(limitCount));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders = [];
      snapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      callback(orders);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error subscribing to user orders:", error);
    return () => {};
  }
};

/**
 * Get single order details
 */
export const getOrderDetails = async (userId, orderId) => {
  try {
    const orderRef = doc(db, "users", userId, "orders", orderId);
    const snapshot = await getDocs(
      query(
        collection(db, "users", userId, "orders"),
        where("__name__", "==", orderId),
      ),
    );

    if (snapshot.empty) {
      return null;
    }

    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data(),
    };
  } catch (error) {
    console.error("Error getting order details:", error);
    throw error;
  }
};

/**
 * Create new order
 */
export const createUserOrder = async (userId, orderData) => {
  try {
    const ordersRef = collection(db, "users", userId, "orders");

    const order = {
      orderNumber: orderData.orderNumber || `ORD-${Date.now()}`,
      items: orderData.items || [],
      totalPrice: orderData.totalPrice || 0,
      shippingAddress: orderData.shippingAddress || {},
      paymentMethod: orderData.paymentMethod || "",
      status: orderData.status || "pending", // pending, confirmed, shipped, delivered, cancelled
      paymentStatus: orderData.paymentStatus || "pending", // pending, completed, failed
      trackingNumber: orderData.trackingNumber || null,
      estimatedDelivery: orderData.estimatedDelivery || null,
      notes: orderData.notes || "",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(ordersRef, order);
    return { id: docRef.id, ...order };
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (userId, orderId, status) => {
  try {
    const orderRef = doc(db, "users", userId, "orders", orderId);

    await updateDoc(orderRef, {
      status: status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

/**
 * Update order tracking number
 */
export const updateOrderTracking = async (userId, orderId, trackingNumber) => {
  try {
    const orderRef = doc(db, "users", userId, "orders", orderId);

    await updateDoc(orderRef, {
      trackingNumber: trackingNumber,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating order tracking:", error);
    throw error;
  }
};

/**
 * Cancel order
 */
export const cancelUserOrder = async (userId, orderId, reason) => {
  try {
    const orderRef = doc(db, "users", userId, "orders", orderId);

    await updateDoc(orderRef, {
      status: "cancelled",
      cancellationReason: reason || "",
      cancelledAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
};

/**
 * Get orders by status
 */
export const getUserOrdersByStatus = async (userId, status) => {
  try {
    const ordersRef = collection(db, "users", userId, "orders");
    const q = query(
      ordersRef,
      where("status", "==", status),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);
    const orders = [];

    snapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return orders;
  } catch (error) {
    console.error("Error getting orders by status:", error);
    throw error;
  }
};

/**
 * Get total orders count
 */
export const getUserOrdersCount = async (userId) => {
  try {
    const ordersRef = collection(db, "users", userId, "orders");
    const snapshot = await getDocs(ordersRef);
    return snapshot.size;
  } catch (error) {
    console.error("Error getting orders count:", error);
    return 0;
  }
};
