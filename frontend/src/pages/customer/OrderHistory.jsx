import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { OrderCardSkeleton } from '../../components/common/Skeletons';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    api.get('/orders/my')
      .then(({ data }) => setOrders(data.orders))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const cancelOrder = async (id) => {
    try {
      await api.delete(`/orders/${id}`);
      toast.success('Order cancelled');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel this order');
    }
  };

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
      {Array(3).fill(0).map((_, i) => <OrderCardSkeleton key={i} />)}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">My Orders 📦</h1>
        <button onClick={fetchOrders} className="text-sm text-pizza-red hover:underline">Refresh</button>
      </div>

      {!orders.length ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="font-display text-xl mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Your order history will appear here.</p>
          <Link to="/menu" className="btn-primary">Order Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div key={order._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                <div>
                  <div className="font-bold text-sm">Order #{order._id.slice(-6).toUpperCase()}</div>
                  <div className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString('en-IN')}</div>
                </div>
                <span className={`status-badge status-${order.status.replace(/ /g, '')}`}>{order.status}</span>
              </div>

              <div className="text-sm text-gray-600 mb-2">
                {order.items.map(i => `${i.pizza?.name || 'Pizza'} ×${i.qty}`).join(' · ')}
              </div>
              <div className="text-xs text-gray-400 mb-2">📍 {order.deliveryAddress}</div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-pizza-red text-lg">₹{order.totalAmount}</span>
                {order.status === 'Pending' && (
                  <button onClick={() => cancelOrder(order._id)} className="text-xs text-red-400 border border-red-200 px-3 py-1 rounded hover:bg-red-50 transition-colors">
                    Cancel Order
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
