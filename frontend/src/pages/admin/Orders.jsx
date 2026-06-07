import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const STATUSES = ['Pending','Confirmed','Preparing','Out For Delivery','Delivered','Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchOrders = () => {
    api.get('/orders')
      .then(({ data }) => setOrders(data.orders))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success('Status updated');
      fetchOrders();
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl text-pizza-dark">Order Management 📦</h1>
        <button onClick={fetchOrders} className="text-sm text-pizza-red hover:underline">Refresh</button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {['All', ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filter === s ? 'bg-pizza-red text-white border-pizza-red' : 'border-orange-200 text-gray-500 hover:border-pizza-red'}`}>
            {s} {s !== 'All' && <span className="ml-1">({orders.filter(o => o.status === s).length})</span>}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-orange-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Order</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Items</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-orange-50">
            {loading ? Array(5).fill(0).map((_, i) => (
              <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="skeleton h-4 w-full" /></td></tr>
            )) : filtered.map(o => (
              <tr key={o._id} className="hover:bg-orange-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-bold">#{o._id.slice(-6).toUpperCase()}</div>
                  <div className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{o.customerId?.name || 'N/A'}</div>
                  <div className="text-xs text-gray-400">{o.customerId?.email}</div>
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs max-w-[150px]">
                  {o.items.map(i => `${i.pizza?.name || '?'}×${i.qty}`).join(', ')}
                </td>
                <td className="px-4 py-3 font-bold text-pizza-red">₹{o.totalAmount}</td>
                <td className="px-4 py-3"><span className={`status-badge status-${o.status.replace(/ /g,'')}`}>{o.status}</span></td>
                <td className="px-4 py-3">
                  <select value={o.status} onChange={e => updateStatus(o._id, e.target.value)}
                    className="text-xs border border-orange-200 rounded px-2 py-1.5 focus:outline-none focus:border-pizza-red bg-white">
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && (
          <div className="text-center py-10 text-gray-400">No orders found.</div>
        )}
      </div>
    </div>
  );
}
