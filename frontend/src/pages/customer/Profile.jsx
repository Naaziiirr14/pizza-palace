import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user.name, password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password && form.password.length < 6) { toast.error('Password min 6 characters'); return; }
    setLoading(true);
    try {
      const payload = { name: form.name };
      if (form.password) payload.password = form.password;
      await updateProfile(payload);
      toast.success('Profile updated!');
      setForm(f => ({ ...f, password: '', confirm: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="font-display text-2xl mb-6">My Profile 👤</h1>
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-pizza-red text-white flex items-center justify-center font-display text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-lg">{user.name}</div>
            <div className="text-gray-500 text-sm">{user.email}</div>
            <span className="text-xs bg-orange-100 text-pizza-orange px-2 py-0.5 rounded-full capitalize font-medium">{user.role}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email <span className="text-gray-400">(cannot change)</span></label>
            <input className="input-field opacity-60" value={user.email} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New Password <span className="text-gray-400">(leave blank to keep)</span></label>
            <input type="password" className="input-field" placeholder="New password" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <input type="password" className="input-field" placeholder="Repeat new password" value={form.confirm}
              onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
