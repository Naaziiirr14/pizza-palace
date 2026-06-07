import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

function StatCard({ label, value, sub, icon }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</div>
          <div className="font-display text-3xl font-bold text-pizza-dark">{value}</div>
          {sub && <div className="text-xs text-green-600 mt-1">{sub}</div>}
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/orders'),
      api.get('/payment/all'),
      api.get('/pizzas?available=false'),
    ]).then(([o, p, pz]) => {
      setOrders(o.data.orders);
      setPayments(p.data.payments);
      setPizzas(pz.data.pizzas);
    }).finally(() => setLoading(false));
  }, []);

  const revenue = payments.filter(p => p.status === 'success').reduce((s, p) => s + p.amount, 0);
  const pending = orders.filter(o => o.status === 'Pending').length;

  const statusCounts = ['Pending','Confirmed','Preparing','Out For Delivery','Delivered'].map(s => ({
    status: s, count: orders.filter(o => o.status === s).length
  }));

  return (
    <div>
      <h1 className="font-display text-2xl mb-6 text-pizza-dark">Dashboard Overview 📊</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue" value={`₹${revenue.toLocaleString()}`} sub="↑ All time" icon="💰" />
        <StatCard label="Total Orders" value={orders.length} sub={`${pending} pending`} icon="📦" />
        <StatCard label="Total Pizzas" value={pizzas.length} sub={`${pizzas.filter(p=>p.isAvailable).length} available`} icon="🍕" />
        <StatCard label="Payments" value={payments.length} sub={`${payments.filter(p=>p.status==='success').length} success`} icon="💳" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Orders */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-gray-700">Recent Orders</h2>
          </div>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-orange-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Order</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-50">
                {loading ? Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={3} className="px-4 py-3"><div className="skeleton h-4 w-full" /></td></tr>
                )) : orders.slice(0, 6).map(o => (
                  <tr key={o._id} className="hover:bg-orange-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium">#{o._id.slice(-6).toUpperCase()}</td>
                    <td className="px-4 py-3 font-semibold text-pizza-red">₹{o.totalAmount}</td>
                    <td className="px-4 py-3"><span className={`status-badge status-${o.status.replace(/ /g,'')}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status chart */}
        <div>
          <h2 className="font-semibold text-gray-700 mb-3">Order Status Breakdown</h2>
          <div className="card p-5">
            <div className="space-y-3">
              {statusCounts.map(({ status, count }) => {
                const pct = orders.length ? Math.round(count / orders.length * 100) : 0;
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{status}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                    <div className="h-2 bg-orange-50 rounded-full overflow-hidden">
                      <div className="h-full bg-pizza-red rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-semibold text-gray-700 mb-3">Quick Actions</h2>
        <div className="flex gap-3 flex-wrap">
          <Link to="/admin/payments" className="btn-outline text-sm py-2 px-4">View Payments</Link>
        </div>
      </div>
    </div>
  );
}
