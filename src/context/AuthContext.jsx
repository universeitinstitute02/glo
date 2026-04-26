"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

import mockUsers from '@/data/users.json';

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
    // 1. Initialize aura_users with mockUsers if empty
    if (typeof window !== 'undefined' && !localStorage.getItem('aura_users')) {
      localStorage.setItem('aura_users', JSON.stringify(mockUsers));
    }

    // 2. Check localStorage for a saved user session
    const savedUser = localStorage.getItem('aura_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Ensure the restored session is robust
        if (!parsedUser.token) {
          parsedUser.token = `mock-jwt-restored-${Math.random().toString(36).substr(2)}`;
        }
        setUser(parsedUser);
        setProfile(parsedUser);
        console.log("Session restored for:", parsedUser.email);
      } catch (e) {
        console.error("Failed to restore session:", e);
        localStorage.removeItem('aura_user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const allUsers = JSON.parse(localStorage.getItem('aura_users') || '[]');
    const foundUser = allUsers.find(u => u.email === email);
    
    // In a real app, we'd verify the password hash
    if (foundUser) {
      const userWithToken = { 
        ...foundUser, 
        token: `mock-jwt-${Math.random().toString(36).substr(2)}` 
      };
      setUser(userWithToken);
      setProfile(userWithToken);
      localStorage.setItem('aura_user', JSON.stringify(userWithToken));
      setLoading(false);
      return { success: true };
    }
    
    setLoading(false);
    return { success: false, error: 'Invalid email or password' };
  };

  const signup = async (userData) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const allUsers = JSON.parse(localStorage.getItem('aura_users') || '[]');
    if (allUsers.find(u => u.email === userData.email)) {
      setLoading(false);
      return { success: false, error: 'Email already exists' };
    }
    
    const newUser = {
      uid: `user-${Math.random().toString(36).substr(2, 9)}`,
      role: 'customer',
      createdAt: new Date().toISOString(),
      wishlist: [],
      addresses: [],
      ...userData,
    };
    
    const userWithToken = { 
      ...newUser, 
      token: `mock-jwt-${Math.random().toString(36).substr(2)}` 
    };
    
    const updatedUsers = [...allUsers, newUser];
    localStorage.setItem('aura_users', JSON.stringify(updatedUsers));
    
    setUser(userWithToken);
    setProfile(userWithToken);
    localStorage.setItem('aura_user', JSON.stringify(userWithToken));
    setLoading(false);
    return { success: true };
  };

  const signupGuest = async (guestData) => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const allUsers = JSON.parse(localStorage.getItem('aura_users') || '[]');
    const existingUser = allUsers.find(u => u.email === guestData.email);
    
    if (existingUser) {
      // If user exists, just log them in as this session (simplified for guest flow)
      const userWithToken = { 
        ...existingUser, 
        token: `mock-jwt-guest-${Math.random().toString(36).substr(2)}` 
      };
      setUser(userWithToken);
      setProfile(userWithToken);
      localStorage.setItem('aura_user', JSON.stringify(userWithToken));
      setLoading(false);
      return { success: true };
    }

    const newUser = {
      uid: `guest-${Math.random().toString(36).substr(2, 9)}`,
      role: 'customer',
      isGuest: true,
      password: 'default@123',
      createdAt: new Date().toISOString(),
      wishlist: [],
      addresses: [],
      ...guestData,
    };
    
    const userWithToken = { 
      ...newUser, 
      token: `mock-jwt-guest-${Math.random().toString(36).substr(2)}` 
    };
    
    const updatedUsers = [...allUsers, newUser];
    localStorage.setItem('aura_users', JSON.stringify(updatedUsers));
    
    setUser(userWithToken);
    setProfile(userWithToken);
    localStorage.setItem('aura_user', JSON.stringify(userWithToken));
    setLoading(false);
    return { success: true };
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const userWithToken = { 
      ...MOCK_USER, 
      token: `mock-jwt-google-${Math.random().toString(36).substr(2)}` 
    };
    setUser(userWithToken);
    setProfile(userWithToken);
    localStorage.setItem('aura_user', JSON.stringify(userWithToken));
    setLoading(false);
  };

  const logout = async () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('aura_user');
  };

  const toggleWishlist = async (productId) => {
    if (!user || !profile) {
      return { success: false, error: 'Login required' };
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
    
    // Also update in aura_users
    const allUsers = JSON.parse(localStorage.getItem('aura_users') || '[]');
    const updatedUsers = allUsers.map(u => u.uid === profile.uid ? updatedProfile : u);
    localStorage.setItem('aura_users', JSON.stringify(updatedUsers));
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, signup, signupGuest, loginWithGoogle, logout, toggleWishlist, updateProfile, isAdmin }}>
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