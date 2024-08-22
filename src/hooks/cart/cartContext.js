// contexts/CartContext.js
"use client"
import React, { createContext, useState, useContext, useEffect } from 'react';
import { loadCartFromLocalStorage, saveCartToLocalStorage, calculateTotalPrice } from '@/utils/cartUtils';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const loadedCartItems = loadCartFromLocalStorage();
    setCartItems(Array.isArray(loadedCartItems) ? loadedCartItems : []);
  }, []);

  const addToCart = (course) => {
    if (!cartItems.some(item => item.id === course.id)) {
      const updatedCart = [...cartItems, course];
      setCartItems(updatedCart);
      saveCartToLocalStorage(updatedCart);
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (courseId) => {
    const updatedCart = cartItems.filter(item => item.id !== courseId);
    setCartItems(updatedCart);
    saveCartToLocalStorage(updatedCart);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const totalPrice = calculateTotalPrice(cartItems);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, toggleCart, isCartOpen, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
