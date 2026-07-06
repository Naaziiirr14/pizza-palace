import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-pizza-dark text-gray-400 py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="font-display text-pizza-orange text-xl mb-2">🍕 Pizza Palace</div>
          <p className="text-sm leading-relaxed">Handcrafted pizzas delivered to your door. Fresh ingredients, wood-fired ovens, every single time.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-pizza-orange transition-colors">Home</Link></li>
            <li><Link to="/menu" className="hover:text-pizza-orange transition-colors">Menu</Link></li>
            <li><Link to="/orders" className="hover:text-pizza-orange transition-colors">Track Order</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>📍 123 Main Street, Bangalore</li>
            <li>📞 +91 98765 43210</li>
            <li>✉️ Pizza@pizzapalace.com</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs mt-8 opacity-50">
        © {new Date().getFullYear()} Pizza Palace · Built with MERN Stack 
      </div>
    </footer>
  );
}
