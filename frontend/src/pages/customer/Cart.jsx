import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';

export default function Cart() {
  const { cart, updateQty, removeFromCart, cartTotal, clearCart } = useCart();
  const delivery = cartTotal >= 499 ? 0 : 49;

  if (!cart.length) return (
    <div className="max-w-5xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="font-display text-2xl mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Looks like you haven't added anything yet!</p>
      <Link to="/menu" className="btn-primary">Browse Menu</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">Your Cart 🛒</h1>
        <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-600 hover:underline">Clear Cart</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {cart.map(({ pizza, qty }) => (
              <motion.div key={pizza._id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -30 }}
                className="card p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-orange-50">
                  <img src={pizza.imageUrl} alt={pizza.name} className="w-full h-full object-cover"
                    onError={e => e.target.src='https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&q=80'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{pizza.name}</div>
                  <div className="text-pizza-red font-bold text-sm">₹{pizza.price}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(pizza._id, -1)} className="w-7 h-7 rounded-full border border-orange-200 flex items-center justify-center font-bold hover:border-pizza-red hover:text-pizza-red transition-colors">−</button>
                  <span className="font-bold w-5 text-center">{qty}</span>
                  <button onClick={() => updateQty(pizza._id, 1)} className="w-7 h-7 rounded-full border border-orange-200 flex items-center justify-center font-bold hover:border-pizza-red hover:text-pizza-red transition-colors">+</button>
                </div>
                <div className="font-bold text-right min-w-[60px]">₹{pizza.price * qty}</div>
                <button onClick={() => removeFromCart(pizza._id)} className="text-gray-300 hover:text-red-400 transition-colors ml-1">🗑️</button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="card p-5 sticky top-20">
          <h3 className="font-display text-lg mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm text-gray-600">
            {cart.map(({ pizza, qty }) => (
              <div key={pizza._id} className="flex justify-between">
                <span className="truncate mr-2">{pizza.name} ×{qty}</span>
                <span className="font-medium">₹{pizza.price * qty}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-orange-100 mt-3 pt-3 flex justify-between text-sm text-gray-600">
            <span>Delivery</span>
            <span className={delivery === 0 ? 'text-green-600 font-semibold' : ''}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
          </div>
          <div className="border-t border-orange-100 mt-2 pt-3 flex justify-between font-bold text-base">
            <span>Total</span>
            <span className="text-pizza-red">₹{cartTotal + delivery}</span>
          </div>
          {delivery > 0 && <p className="text-xs text-gray-400 mt-1 text-center">Add ₹{499 - cartTotal} more for free delivery</p>}
          <Link to="/checkout" className="btn-primary block text-center mt-4 py-3">Proceed to Checkout →</Link>
        </div>
      </div>
    </div>
  );
}
