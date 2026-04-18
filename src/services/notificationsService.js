import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Get all notifications for a user
 */
export const getUserNotifications = async (userId, limitCount = 50) => {
  try {
    const notificationsRef = collection(db, "users", userId, "notifications");
    const q = query(
      notificationsRef,
      orderBy("createdAt", "desc"),
      limit(limitCount),
    );
    const snapshot = await getDocs(q);
    const notifications = [];

    snapshot.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return notifications;
  } catch (error) {
    console.error("Error getting user notifications:", error);
    throw error;
  }
};

/**
 * Subscribe to real-time notifications updates
 */
export const subscribeToUserNotifications = (
  userId,
  callback,
  limitCount = 50,
) => {
  try {
    const notificationsRef = collection(db, "users", userId, "notifications");
    const q = query(
      notificationsRef,
      orderBy("createdAt", "desc"),
      limit(limitCount),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifications = [];
      snapshot.forEach((doc) => {
        notifications.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      callback(notifications);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error subscribing to user notifications:", error);
    return () => {};
  }
};

/**
 * Get unread notifications count
 */
export const getUnreadNotificationsCount = async (userId) => {
  try {
    const notificationsRef = collection(db, "users", userId, "notifications");
    const q = query(notificationsRef, where("read", "==", false));
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error("Error getting unread notifications count:", error);
    return 0;
  }
};

/**
 * Subscribe to unread notifications count
 */
export const subscribeToUnreadNotificationsCount = (userId, callback) => {
  try {
    const notificationsRef = collection(db, "users", userId, "notifications");
    const q = query(notificationsRef, where("read", "==", false));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      callback(snapshot.size);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error subscribing to unread count:", error);
    return () => {};
  }
};

/**
 * Create notification
 */
export const createNotification = async (userId, notificationData) => {
  try {
    const notificationsRef = collection(db, "users", userId, "notifications");

    const notification = {
      title: notificationData.title || "",
      message: notificationData.message || "",
      type: notificationData.type || "info", // info, order, promotion, alert
      read: notificationData.read || false,
      orderId: notificationData.orderId || null,
      actionUrl: notificationData.actionUrl || null,
      icon: notificationData.icon || "notifications",
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(notificationsRef, notification);
    return { id: docRef.id, ...notification };
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (userId, notificationId) => {
  try {
    const notificationRef = doc(
      db,
      "users",
      userId,
      "notifications",
      notificationId,
    );

    await updateDoc(notificationRef, {
      read: true,
      readAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async (userId) => {
  try {
    const notificationsRef = collection(db, "users", userId, "notifications");
    const q = query(notificationsRef, where("read", "==", false));
    const snapshot = await getDocs(q);

    const updates = snapshot.docs.map((doc) =>
      updateDoc(doc.ref, {
        read: true,
        readAt: Timestamp.now(),
      }),
    );

    await Promise.all(updates);
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (userId, notificationId) => {
  try {
    const notificationRef = doc(
      db,
      "users",
      userId,
      "notifications",
      notificationId,
    );

    await deleteDoc(notificationRef);
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

/**
 * Clear all notifications
 */
export const clearAllNotifications = async (userId) => {
  try {
    const notificationsRef = collection(db, "users", userId, "notifications");
    const snapshot = await getDocs(notificationsRef);

    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error clearing all notifications:", error);
    throw error;
  }
};

/**
 * Get notifications by type
 */
export const getUserNotificationsByType = async (
  userId,
  type,
  limitCount = 25,
) => {
  try {
    const notificationsRef = collection(db, "users", userId, "notifications");
    const q = query(
      notificationsRef,
      where("type", "==", type),
      orderBy("createdAt", "desc"),
      limit(limitCount),
    );
    const snapshot = await getDocs(q);
    const notifications = [];

    snapshot.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return notifications;
  } catch (error) {
    console.error("Error getting notifications by type:", error);
    throw error;
  }
};
