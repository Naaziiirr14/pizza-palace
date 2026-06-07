import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../services/api';
import PizzaCard from '../components/common/PizzaCard';
import { PizzaCardSkeleton } from '../components/common/Skeletons';

const CATS = ['All', 'Veg', 'Non-Veg', 'Specialty'];

export default function Menu() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [cat, setCat] = useState(searchParams.get('category') || 'All');

  useEffect(() => {
    api.get('/pizzas?available=true')
      .then(({ data }) => setPizzas(data.pizzas))
      .catch(() => toast.error('Failed to load menu'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = pizzas.filter(p => {
    const matchCat = cat === 'All' || p.category === cat;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCat = (c) => {
    setCat(c);
    setSearchParams(c !== 'All' ? { category: c } : {});
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <span className="section-label">Our Menu</span>
        <h1 className="font-display text-3xl mt-2">Choose Your Perfect Pizza</h1>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="🔍 Search pizzas by name or ingredient..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field max-w-lg"
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-3 flex-wrap mb-6">
        {CATS.map(c => (
          <button
            key={c}
            onClick={() => handleCat(c)}
            className={`px-5 py-2 rounded-full border-2 font-medium text-sm transition-all ${
              cat === c ? 'bg-pizza-red border-pizza-red text-white' : 'border-orange-200 text-gray-600 hover:border-pizza-red hover:text-pizza-red bg-white'
            }`}
          >
            {c === 'All' ? '🍕 All' : c === 'Veg' ? '🥦 Veg' : c === 'Non-Veg' ? '🍗 Non-Veg' : '⭐ Specialty'}
          </button>
        ))}
      </div>

      {!loading && (
        <p className="text-gray-500 text-sm mb-4">{filtered.length} pizza{filtered.length !== 1 ? 's' : ''} found</p>
      )}

      <AnimatePresence mode="wait">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(9).fill(0).map((_, i) => <PizzaCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">🍕</div>
            <p className="text-lg">No pizzas found. Try a different search.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map(p => <PizzaCard key={p._id} pizza={p} />)}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
