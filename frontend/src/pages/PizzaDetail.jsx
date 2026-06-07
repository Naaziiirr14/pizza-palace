import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function PizzaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [pizza, setPizza] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    api.get(`/pizzas/${id}`)
      .then(({ data }) => setPizza(data.pizza))
      .catch(() => { toast.error('Pizza not found'); navigate('/menu'); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAdd = () => {
    if (!user) { toast.info('Please login to add to cart'); navigate('/login'); return; }
    for (let i = 0; i < qty; i++) addToCart(pizza);
    toast.success(`${qty}x ${pizza.name} added to cart! 🍕`);
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="skeleton h-80 rounded-2xl" />
      <div className="space-y-4 py-4">
        <div className="skeleton h-8 w-3/4" /><div className="skeleton h-6 w-1/4" />
        <div className="skeleton h-4 w-full" /><div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-12 w-full mt-6" />
      </div>
    </div>
  );

  if (!pizza) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <button onClick={() => navigate('/menu')} className="text-pizza-red text-sm font-medium mb-6 hover:underline">← Back to Menu</button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl overflow-hidden border border-orange-100 h-80">
          <img src={pizza.imageUrl} alt={pizza.name} className="w-full h-full object-cover"
            onError={e => e.target.src = 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80'} />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="py-2">
          <div className="flex gap-2 mb-3">
            <span className="bg-orange-100 text-pizza-orange text-xs font-bold px-3 py-1 rounded-full">{pizza.category}</span>
            {!pizza.isAvailable && <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">Unavailable</span>}
          </div>
          <h1 className="font-display text-3xl text-pizza-dark mb-2">{pizza.name}</h1>
          <div className="text-3xl font-bold text-pizza-red mb-4">₹{pizza.price}</div>
          <p className="text-gray-600 leading-relaxed mb-6">{pizza.description}</p>
          <p className="text-sm text-gray-400 mb-6">🚀 Estimated delivery: 25–35 minutes</p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-600">Quantity:</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 rounded-full border-2 border-orange-200 flex items-center justify-center font-bold text-lg hover:border-pizza-red hover:text-pizza-red transition-colors">−</button>
              <span className="font-bold text-lg w-6 text-center">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="w-9 h-9 rounded-full border-2 border-orange-200 flex items-center justify-center font-bold text-lg hover:border-pizza-red hover:text-pizza-red transition-colors">+</button>
            </div>
            <span className="text-gray-400 text-sm">Total: <strong className="text-pizza-red">₹{pizza.price * qty}</strong></span>
          </div>

          <button onClick={handleAdd} disabled={!pizza.isAvailable} className="btn-primary w-full text-base py-3 disabled:opacity-50">
            {pizza.isAvailable ? '🛒 Add to Cart' : 'Currently Unavailable'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
