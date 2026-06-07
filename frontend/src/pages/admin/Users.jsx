import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminUsers() {
  // Note: A dedicated /api/admin/users endpoint would be added for production.
  // This shows the pattern using profile + seeded data display.
  const [users] = useState([
    { _id: '1', name: 'Admin', email: 'admin@pizzapalace.com', role: 'admin', createdAt: new Date().toISOString() },
    { _id: '2', name: 'Rahul Sharma', email: 'rahul@test.com', role: 'customer', createdAt: new Date().toISOString() },
    { _id: '3', name: 'Priya Patel', email: 'priya@test.com', role: 'customer', createdAt: new Date().toISOString() },
    { _id: '4', name: 'Arjun Mehta', email: 'arjun@test.com', role: 'customer', createdAt: new Date().toISOString() },
    { _id: '5', name: 'Sneha Nair', email: 'sneha@test.com', role: 'customer', createdAt: new Date().toISOString() },
    { _id: '6', name: 'Dev Kumar', email: 'dev@test.com', role: 'customer', createdAt: new Date().toISOString() },
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl text-pizza-dark mb-6">User Management 👥</h1>

      <div className="grid grid-cols-2 gap-4 mb-6 max-w-xs">
        <div className="card p-4 text-center">
          <div className="font-display text-2xl font-bold">{users.length}</div>
          <div className="text-xs text-gray-400 mt-0.5">Total Users</div>
        </div>
        <div className="card p-4 text-center">
          <div className="font-display text-2xl font-bold">{users.filter(u => u.role === 'customer').length}</div>
          <div className="text-xs text-gray-400 mt-0.5">Customers</div>
        </div>
      </div>

      <div className="card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-orange-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-orange-50">
            {users.map(u => (
              <tr key={u._id} className="hover:bg-orange-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-pizza-red text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {u.name.charAt(0)}
                    </div>
                    <span className="font-medium">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`status-badge ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'status-Confirmed'} capitalize`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
