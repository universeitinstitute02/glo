"use client";

import { useState, useEffect, useCallback } from "react";

const WISHLIST_KEY = "wishlist";

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Helper function to read from localStorage
  const readWishlist = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        const storedWishlist = localStorage.getItem(WISHLIST_KEY);
        return storedWishlist ? JSON.parse(storedWishlist) : [];
      } catch (error) {
        console.error("Error reading wishlist from localStorage:", error);
        return [];
      }
    }
    return [];
  }, []);

  // Initialize state and setup event listeners for cross-component/tab sync
  useEffect(() => {
    setWishlist(readWishlist());
    setIsLoaded(true);

    const handleStorageChange = (e) => {
      if (e.key === WISHLIST_KEY) {
        setWishlist(readWishlist());
      }
    };

    const handleCustomEvent = () => {
      setWishlist(readWishlist());
    };

    // Listen for changes from other tabs
    window.addEventListener("storage", handleStorageChange);
    // Listen for changes from other components in the same window
    window.addEventListener("wishlist-update", handleCustomEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("wishlist-update", handleCustomEvent);
    };
  }, [readWishlist]);

  // Helper function to save to localStorage
  const saveWishlist = (newWishlist) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(newWishlist));
      setWishlist(newWishlist);
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event("wishlist-update"));
    }
  };

  // Add item to wishlist
  const addToWishlist = (product) => {
    if (!product || !product.id) return;

    const currentList = readWishlist();
    if (!currentList.some((item) => item.id === product.id)) {
      // Ensure we only save required fields based on the structure
      const wishlistItem = {
        id: product.id,
        title: product.title || product.name,
        price: product.price,
        image: product.image || (product.images && product.images[0]) || "",
      };
      saveWishlist([...currentList, wishlistItem]);
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = (productId) => {
    const currentList = readWishlist();
    saveWishlist(currentList.filter((item) => item.id !== productId));
  };

  // Toggle wishlist (Add if not exists, remove if exists)
  const toggleWishlist = (product) => {
    if (!product || !product.id) return;

    const currentList = readWishlist();
    if (currentList.some((item) => item.id === product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Check if an item is in the wishlist
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Get all wishlist items
  const getAllWishlistItems = () => {
    return wishlist;
  };

  return {
    wishlist,
    wishlistCount: wishlist.length,
    isLoaded,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getAllWishlistItems,
  };
};
