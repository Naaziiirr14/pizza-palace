import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function PizzaCard({ pizza }) {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.info('Please login to add items to cart'); return; }
    addToCart(pizza);
    toast.success(`${pizza.name} added to cart! 🍕`);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card overflow-hidden cursor-pointer group"
    >
      <Link to={`/pizza/${pizza._id}`} className="block">
        <div className="relative h-44 overflow-hidden bg-orange-50">
          <img
            src={pizza.imageUrl}
            alt={pizza.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80'; }}
          />
          <span className="absolute top-2 left-2 bg-pizza-orange text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase">
            {pizza.category}
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-display font-bold text-lg text-pizza-dark mb-1 leading-tight">{pizza.name}</h3>
          <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">{pizza.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-pizza-red font-bold text-lg">₹{pizza.price}</span>
            <button
              onClick={handleAdd}
              className="w-9 h-9 rounded-full bg-pizza-red text-white text-xl flex items-center justify-center hover:bg-pizza-red-dark transition-colors shadow-sm"
              title="Add to cart"
            >
              +
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
