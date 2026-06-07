import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin/payments', label: '💳 Payments', end: true },
];

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('Logged out');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 bg-pizza-dark flex-shrink-0 flex flex-col">
        <div className="p-4 font-display text-pizza-orange text-lg border-b border-orange-900/30">
          🍕 Admin Panel
        </div>
        <nav className="flex-1 py-4">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `block px-5 py-3 text-sm font-medium border-l-4 transition-colors ${
                  isActive
                    ? 'border-pizza-orange text-pizza-orange bg-orange-900/10'
                    : 'border-transparent text-gray-400 hover:text-pizza-orange hover:bg-orange-900/5'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-orange-900/30">
          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-red-400 hover:text-red-300 transition-colors px-1 py-2"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-pizza-cream overflow-auto">
        <div className="p-6 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
