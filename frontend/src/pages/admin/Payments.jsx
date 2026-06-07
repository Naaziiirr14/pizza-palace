import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/payment/all')
      .then(({ data }) => setPayments(data.payments))
      .catch(() => toast.error('Failed to load payments'))
      .finally(() => setLoading(false));
  }, []);

  const total = payments.filter(p => p.status === 'success').reduce((s, p) => s + p.amount, 0);
  const successRate = payments.length ? Math.round(payments.filter(p => p.status === 'success').length / payments.length * 100) : 0;

  return (
    <div>
      <h1 className="font-display text-2xl text-pizza-dark mb-6">Payment Management 💳</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Revenue', value: `₹${total.toLocaleString()}`, icon: '💰' },
          { label: 'Transactions', value: payments.length, icon: '🔄' },
          { label: 'Success Rate', value: `${successRate}%`, icon: '✅' },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">{s.label}</div>
            <div className="font-display text-2xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-orange-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Payment ID</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Order</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Razorpay ID</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-orange-50">
            {loading ? Array(5).fill(0).map((_, i) => (
              <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="skeleton h-4 w-full" /></td></tr>
            )) : payments.map(p => (
              <tr key={p._id} className="hover:bg-orange-50/50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs">#{p._id.slice(-6).toUpperCase()}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{p.userId?.name || 'N/A'}</div>
                  <div className="text-xs text-gray-400">{p.userId?.email}</div>
                </td>
                <td className="px-4 py-3 font-medium">#{p.orderId?._id?.slice(-6).toUpperCase() || 'N/A'}</td>
                <td className="px-4 py-3 font-bold text-pizza-red">₹{p.amount}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-400 max-w-[120px] truncate">{p.razorpayPaymentId || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`status-badge ${p.status === 'success' ? 'status-Delivered' : p.status === 'failed' ? 'status-Cancelled' : 'status-Pending'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && payments.length === 0 && (
          <div className="text-center py-10 text-gray-400">No payments found.</div>
        )}
      </div>
    </div>
  );
}
