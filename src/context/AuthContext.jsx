"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,

  signInWithPopup,
  GoogleAuthProvider,
  signOut } from
'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';


const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Fetch or create profile
        const profileRef = doc(db, 'users', firebaseUser.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          setProfile(profileSnap.data());
        } else {
          // Default admin for the provided email
          const isAdmin = firebaseUser.email === 'mohyminulislam2001@gmail.com';
          const newProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            wishlist: [],
            addresses: [],
            role: isAdmin ? 'admin' : 'customer'
          };
          await setDoc(profileRef, newProfile);
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const toggleWishlist = async (productId) => {
    if (!user || !profile) {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      return;
    }

    const currentWishlist = profile.wishlist || [];
    const newWishlist = currentWishlist.includes(productId) ?
    currentWishlist.filter((id) => id !== productId) :
    [...currentWishlist, productId];

    const profileRef = doc(db, 'users', user.uid);
    await setDoc(profileRef, { ...profile, wishlist: newWishlist }, { merge: true });
    setProfile({ ...profile, wishlist: newWishlist });
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, profile, loading, loginWithGoogle, logout, toggleWishlist, isAdmin }}>
      {children}
    </AuthContext.Provider>);

}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}