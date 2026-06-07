import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import PizzaDetail from './pages/PizzaDetail';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import OrderHistory from './pages/customer/OrderHistory';
import Profile from './pages/customer/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminPayments from './pages/admin/Payments';
import AdminLayout from './components/layout/AdminLayout';

// Loading Spinner
const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-pizza-red border-t-transparent rounded-full animate-spin" />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />; // ← loading முடியும்வரை காத்திரு
  if (!user) return <Navigate to="/login" replace />; // ← login இல்லன்னா login page
  if (user.role !== 'admin') return <Navigate to="/" replace />; // ← admin இல்லன்னா home
  return children; // ← admin ஆ இருந்தா dashboard
};

export default function App() {
  return (
    <>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin/*" element={
          <AdminRoute>
            <AdminLayout>
              <Routes>
                <Route index element={<Navigate to="payments" replace />} />
                <Route path="payments" element={<AdminPayments />} />
              </Routes>
            </AdminLayout>
          </AdminRoute>
        } />

        {/* Public routes */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/pizza/:id" element={<PizzaDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="*" element={
                  <div className="text-center py-24">
                    <h1 className="text-4xl font-display text-pizza-dark">404 — Page Not Found</h1>
                  </div>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </>
  );
}