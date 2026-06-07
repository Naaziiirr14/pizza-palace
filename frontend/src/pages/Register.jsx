import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Please login 🍕');
      navigate('/login'); // ← இதுமட்டும் மாத்தினேன்
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const upd = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="card p-8 w-full max-w-md">
        <h1 className="font-display text-2xl mb-1">Create Account 🍕</h1>
        <p className="text-gray-500 text-sm mb-6">Join Pizza Palace today — it's free!</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input required className="input-field" placeholder="Your full name" value={form.name} onChange={upd('name')} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" required className="input-field" placeholder="you@example.com" value={form.email} onChange={upd('email')} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" required className="input-field" placeholder="Min. 6 characters" value={form.password} onChange={upd('password')} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input type="password" required className="input-field" placeholder="Repeat password" value={form.confirm} onChange={upd('confirm')} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-pizza-red font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}