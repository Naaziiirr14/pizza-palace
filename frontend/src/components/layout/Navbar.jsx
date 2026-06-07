import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-pizza-dark sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-pizza-orange text-xl font-bold tracking-wide">
          🍕 <span className="text-white">Pizza</span> Palace
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/" className="text-gray-300 hover:text-pizza-orange transition-colors">Home</Link>
          <Link to="/menu" className="text-gray-300 hover:text-pizza-orange transition-colors">Menu</Link>

          {user?.role === 'customer' && (
            <Link to="/orders" className="text-gray-300 hover:text-pizza-orange transition-colors">Orders</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-pizza-orange font-semibold">Admin Panel</Link>
          )}

          {user ? (
            <>
              <Link to="/profile" className="text-gray-300 hover:text-pizza-orange transition-colors">
                {user.name.split(' ')[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-red-400 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-pizza-orange transition-colors">Login</Link>
              <Link to="/register" className="bg-pizza-red text-white px-4 py-2 rounded-lg hover:bg-pizza-red-dark transition-colors">
                Sign Up
              </Link>
            </>
          )}

          {user?.role === 'customer' && (
            <Link to="/cart" className="relative text-gray-300 hover:text-pizza-orange transition-colors text-xl">
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pizza-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
