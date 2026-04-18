import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { createUserProfile } from "../services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Timeout for auth state check (max 10 seconds)
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn(
          "Auth state check timed out after 10 seconds. Proceeding without auth.",
        );
        setLoading(false);
      }
    }, 10000);

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      try {
        clearTimeout(timeoutId);
        setError(null);
        if (authUser) {
          setUser(authUser);
          // Create user profile in background (don't block app initialization)
          createUserProfile(authUser.uid, {
            fullName: "",
            email: authUser.email,
          }).catch((err) => {
            console.error("Error creating user profile:", err);
            // Don't set loading error for profile creation failure
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth error:", err);
        setError(err.message);
      } finally {
        // Always set loading to false after auth state check completes
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signup = async (email, password) => {
    try {
      setError(null);
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" +
          process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message || "Signup failed");
      }

      const authUser = {
        uid: data.localId,
        email: data.email,
      };

      setUser(authUser);
      return authUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" +
          process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message || "Login failed");
      }

      const authUser = {
        uid: data.localId,
        email: data.email,
      };

      setUser(authUser);
      return authUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, loading, error }}
    >
      {children}{" "}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
