// context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchWithTokenRefresh } from "../utils/auth";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // In cartProvider or wherever fetchCart is defined
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = async (userId) => {
    try {
      const response = await fetch(
        `https://farmus-wallet-backend.vercel.app/api/cart?id=${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }
      const data = await response.json();

      // Map over items to handle Decimal128 conversion
      const formattedItems = data.items.map((item) => ({
        ...item,
        price: parseFloat(item.price.$numberDecimal), // Convert price to a number
        productId: {
          ...item.productId,
          price: parseFloat(item.productId.price.$numberDecimal), // Handle nested price
        },
      }));

      setCart(formattedItems);
    } catch (error) {
      console.error("Error in fetchCart:", error);
      setCart([]); // Handle the error by setting cart to an empty array
    }
  };

  const addToCart = async (userId, productId, price) => {
    const response = await fetchWithTokenRefresh(
      `https://farmus-wallet-backend.vercel.app/api/cart/add?id=${userId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1, price }),
      }
    );
    const updatedCart = await response.json();
    setCart(updatedCart.items);
  };

  const updateCartItem = async (userId, itemId, quantity) => {
    const response = await fetchWithTokenRefresh(
      `https://farmus-wallet-backend.vercel.app/api/cart/update?id=${userId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity }),
      }
    );
    const updatedCart = await response.json();
    setCart(updatedCart.items);
  };

  const removeFromCart = async (userId, itemId) => {
    const response = await fetchWithTokenRefresh(
      `https://farmus-wallet-backend.vercel.app/api/cart/remove?id=${userId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      }
    );
    const updatedCart = await response.json();
    setCart(updatedCart.items);
  };

  return (
    <CartContext.Provider
      value={{ cart, fetchCart, addToCart, updateCartItem, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
