'use client';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

// Create the context with a default value of an empty array
const CartContext = createContext([]);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// CartProvider component
export const CartProvider = ({ children }) => {
  // Load cart from localStorage on hook initialization
  const [cart, setCart] = useState([]);
  const firstRender=useRef(true)

// Save cart to localStorage whenever it changes
useEffect(() => {
if(firstRender.current){
   setCart(JSON.parse(localStorage.getItem('cart')))
   firstRender.current=false;
 }else{
 localStorage.setItem('cart', JSON.stringify(cart));}
 }, [cart]);

  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const removeFromCart = (item) => {
    setCart((prevCart) => prevCart.filter((cartItem) => cartItem.id !== item.id));
  };

  const isInCart = (item) => cart.some((cartItem) => cartItem.id === item.id);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, isInCart }}>
      {children}
    </CartContext.Provider>
  );
};
