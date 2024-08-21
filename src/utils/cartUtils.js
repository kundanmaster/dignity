// utils/cartUtils.js

export const saveCartToLocalStorage = (cartItems) => {
  localStorage.setItem("cart", JSON.stringify(cartItems));
};

export const loadCartFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  }
  return []; // Return an empty array if running server-side
};

export const addToCart = (course) => {
  const currentCart = loadCartFromLocalStorage();
  const updatedCart = [...currentCart, course];
  saveCartToLocalStorage(updatedCart);
};

export const removeFromCart = (itemToRemove) => {
  if (typeof window !== "undefined") {
    const cart = loadCartFromLocalStorage();
    const updatedCart = cart.filter((item) => item.id !== itemToRemove.id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }
};

export const calculateTotalPrice = (items) => {
  // Ensure items is always an array
  const validItems = Array.isArray(items) ? items : [];

  // Calculate the total price
  return validItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};
