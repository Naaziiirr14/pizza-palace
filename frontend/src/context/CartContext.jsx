import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pp_cart')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('pp_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (pizza) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.pizza._id === pizza._id);
      if (existing) return prev.map((i) => i.pizza._id === pizza._id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { pizza, qty: 1 }];
    });
  };

  const updateQty = (pizzaId, delta) => {
    setCart((prev) =>
      prev.map((i) => i.pizza._id === pizzaId ? { ...i, qty: i.qty + delta } : i)
         .filter((i) => i.qty > 0)
    );
  };

  const removeFromCart = (pizzaId) => setCart((prev) => prev.filter((i) => i.pizza._id !== pizzaId));

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((s, i) => s + i.pizza.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
