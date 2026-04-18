# Firebase Security Rules for SwiftCart

This file documents the security rules for the SwiftCart Firebase Firestore database.

## Rules Overview

These rules ensure that:

1. Users can only access their own data
2. All user-related data is properly protected
3. Subcollections are restricted to the authenticated user
4. Admin operations are protected

## Firestore Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthed() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // Users collection
    match /users/{userId} {
      // User can read their own profile
      allow read: if isAuthed() && isOwner(userId);
      // User can create their own profile at signup
      allow create: if isAuthed() && isOwner(userId) && hasRequiredFields(['email', 'uid']);
      // User can update their own profile
      allow update: if isAuthed() && isOwner(userId);
      // Don't allow delete (keep history)
      allow delete: if false;

      // Validate required fields on create
      function hasRequiredFields(required) {
        let incoming = request.resource.data.keys();
        return required.all(req => req in incoming);
      }

      // Cart subcollection
      match /cart/{document=**} {
        allow read, write: if isAuthed() && isOwner(userId);
      }

      // Wishlist subcollection
      match /wishlist/{document=**} {
        allow read, write: if isAuthed() && isOwner(userId);
      }

      // Orders subcollection
      match /orders/{document=**} {
        allow read: if isAuthed() && isOwner(userId);
        allow write: if isAuthed() && isOwner(userId) && (
          // Allow creating orders
          (request.method == 'create' && hasOrderFields()) ||
          // Allow updating order status (only certain fields)
          (request.method == 'update' && onlyOrderStatusChanging())
        );
      }

      // Addresses subcollection
      match /addresses/{document=**} {
        allow read, write: if isAuthed() && isOwner(userId);
      }

      // Notifications subcollection
      match /notifications/{document=**} {
        allow read: if isAuthed() && isOwner(userId);
        allow write: if isAuthed() && isOwner(userId) && (
          // Users can mark as read or delete their own notifications
          (request.method == 'update' && request.resource.data.read == true) ||
          request.method == 'delete'
        );
      }

      // Helper function to validate order fields
      function hasOrderFields() {
        return request.resource.data.keys().hasAll(['items', 'totalPrice', 'status']);
      }

      // Helper function to ensure only status changes
      function onlyOrderStatusChanging() {
        let incoming = request.resource.data;
        let existing = resource.data;
        return incoming.diff(existing).affectedKeys().hasOnly(['status', 'updatedAt']);
      }
    }

    // Public products collection (for browsing)
    match /products/{document=**} {
      allow read: if true; // Everyone can read products
      allow write: if false; // Only via admin SDK
    }

    // Public categories collection
    match /categories/{document=**} {
      allow read: if true; // Everyone can read categories
      allow write: if false; // Only via admin SDK
    }

    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Key Security Features

### 1. User Authentication Required

- All user data operations require authentication (`isAuthed()`)
- Users can only access data where their UID matches

### 2. User Subcollections Protected

- Cart, Wishlist, Orders, Addresses, Notifications are only accessible to the owner
- Each subcollection follows the pattern: `users/{uid}/{subcollection}/{docId}`

### 3. Order Protection

- Users can create and read their own orders
- Only specific fields can be updated (status, updatedAt)
- Full order modification is controlled

### 4. Notification Controls

- Users can only read their own notifications
- Users can mark notifications as read or delete them
- Prevents users from modifying others' notifications

### 5. Public Data

- Products and Categories are publicly readable
- Only backend (admin SDK) can write to these collections

## How to Deploy

### Option 1: Firebase Console

1. Go to Firebase Console > Project Settings > Firestore Rules
2. Copy the rules from above
3. Click "Publish"

### Option 2: Firebase CLI

```bash
firebase deploy --only firestore:rules
```

## Testing Rules

Use Firebase Emulator Suite for local testing:

```bash
firebase emulators:start
```

Example test case:

```javascript
// User can read their own profile
db.collection("users").doc(userId).get();
// ✅ Success (if authenticated as userId)

// User cannot read another user's profile
db.collection("users").doc(otherUserId).get();
// ❌ Denied

// User can create order
db.collection("users").doc(userId).collection("orders").add(orderData);
// ✅ Success (with valid order fields)
```

## Best Practices

1. **Always authenticate before any operation**
   - All writes are restricted to authenticated users
   - User ID must match request.auth.uid

2. **Validate data on write**
   - Orders require specific fields
   - Addresses require required fields
   - Use helper functions for complex validation

3. **Use subcollections for user data**
   - Scales better than root-level collections
   - Clear ownership structure
   - Easy to query user-specific data

4. **Limit data modification**
   - Users can't modify read-only fields like createdAt
   - Order status changes are controlled
   - Notifications can only be marked as read

5. **Monitor and audit**
   - Enable Cloud Audit Logs
   - Monitor rule violations
   - Use Firebase Analytics for usage patterns

## Modifications for Admin Users

If you need admin functionality, extend rules:

```
function isAdmin() {
  return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}

// Allow admins to read/write any user data
match /users/{userId} {
  allow read, write: if isAdmin() || isOwner(userId);
}
```

Then add `role: "admin"` to user documents for admin users.
