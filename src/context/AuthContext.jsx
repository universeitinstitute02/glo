"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

const MOCK_USER = {
  uid: 'admin-123',
  email: 'mohyminulislam2001@gmail.com',
  displayName: 'Mohyminul Islam',
  role: 'admin',
  wishlist: [],
  addresses: [
    {
      id: 'addr-1',
      fullName: 'Mohyminul Islam',
      phone: '01700000000',
      district: 'Dhaka',
      area: 'Dhanmondi',
      address: 'House 123, Road 45'
    }
  ]
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for a saved user session
    const savedUser = localStorage.getItem('aura_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setProfile(parsedUser);
    }
    setLoading(false);
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setUser(MOCK_USER);
    setProfile(MOCK_USER);
    localStorage.setItem('aura_user', JSON.stringify(MOCK_USER));
    setLoading(false);
  };

  const logout = async () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('aura_user');
  };

  const toggleWishlist = async (productId) => {
    if (!user || !profile) {
      await loginWithGoogle();
      return;
    }

    const currentWishlist = profile.wishlist || [];
    const newWishlist = currentWishlist.includes(productId) ?
      currentWishlist.filter((id) => id !== productId) :
      [...currentWishlist, productId];

    const updatedProfile = { ...profile, wishlist: newWishlist };
    setProfile(updatedProfile);
    setUser(updatedProfile);
    localStorage.setItem('aura_user', JSON.stringify(updatedProfile));
  };

  const updateProfile = (newData) => {
    const updatedProfile = { ...profile, ...newData };
    setProfile(updatedProfile);
    setUser(updatedProfile);
    localStorage.setItem('aura_user', JSON.stringify(updatedProfile));
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, profile, loading, loginWithGoogle, logout, toggleWishlist, updateProfile, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}