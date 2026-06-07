import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../services/api';
import PizzaCard from '../components/common/PizzaCard';
import { PizzaCardSkeleton } from '../components/common/Skeletons';

const categories = [
  { name: 'Veg', emoji: '🥦', desc: 'Fresh garden favourites' },
  { name: 'Non-Veg', emoji: '🍗', desc: 'Meaty & satisfying' },
  { name: 'Specialty', emoji: '⭐', desc: 'Chef\'s signature picks' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/pizzas?available=true')
      .then(({ data }) => setFeatured(data.pizzas.slice(0, 6)))
      .catch(() => toast.error('Failed to load pizzas'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="bg-pizza-dark min-h-[500px] flex items-center px-6 py-16 relative overflow-hidden">
        <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="section-label">🔥 Fresh Out The Oven</span>
            <h1 className="font-display text-4xl md:text-5xl text-white leading-tight mt-3 mb-4">
              Order <span className="text-pizza-orange">Handcrafted</span><br />Pizzas Online
            </h1>
            <p className="text-orange-200 text-base leading-relaxed mb-8">
              15+ signature recipes, wood-fired ovens, delivered in 30 minutes or it's free.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link to="/menu" className="btn-primary text-base">🍕 Explore Menu</Link>
              <Link to="/register" className="btn-outline text-base">Sign Up Free</Link>
            </div>
            <div className="flex gap-6 mt-8 flex-wrap">
              {['⏱ 30 min delivery','🌿 Fresh ingredients','⭐ 4.8 rated'].map(f => (
                <span key={f} className="text-orange-300 text-sm">{f}</span>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="hidden md:flex justify-center animate-float"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-[180px] leading-none select-none">🍕</div>
          </motion.div>
        </div>
      </section>

      {/* Feature strip */}
      <div className="bg-pizza-dark/90 py-3 px-4 flex justify-center gap-8 flex-wrap text-sm text-orange-200 border-t border-orange-900/40">
        {['🚀 Free delivery above ₹499','🔥 Wood-fired ovens','📱 Live order tracking','💳 Secure Razorpay payment'].map(f => (
          <span key={f}>{f}</span>
        ))}
      </div>

      {/* Categories */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="text-center mb-8">
          <span className="section-label">Categories</span>
          <h2 className="font-display text-3xl mt-2">What Are You Craving?</h2>
        </div>
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-14">
          {categories.map(cat => (
            <Link
              key={cat.name}
              to={`/menu?category=${cat.name}`}
              className="card p-5 text-center hover:border-pizza-red hover:shadow-md transition-all group"
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{cat.emoji}</div>
              <div className="font-semibold text-sm">{cat.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">{cat.desc}</div>
            </Link>
          ))}
        </div>

        {/* Featured */}
        <div className="text-center mb-8">
          <span className="section-label">Featured</span>
          <h2 className="font-display text-3xl mt-2">Our Best Sellers</h2>
          <p className="text-gray-500 mt-1">Loved by thousands of pizza fans</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array(6).fill(0).map((_, i) => <PizzaCardSkeleton key={i} />)
            : featured.map(p => <PizzaCard key={p._id} pizza={p} />)
          }
        </div>
        <div className="text-center mt-8">
          <Link to="/menu" className="btn-primary">View Full Menu →</Link>
        </div>
      </section>
    </>
  );
}
