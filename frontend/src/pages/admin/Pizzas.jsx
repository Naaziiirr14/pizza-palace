import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const EMPTY = { name: '', description: '', price: '', category: 'Veg', imageUrl: '', isAvailable: true };

function PizzaModal({ pizza, onClose, onSaved }) {
  const [form, setForm] = useState(pizza || EMPTY);
  const [loading, setLoading] = useState(false);

  const upd = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (pizza?._id) {
        await api.put(`/pizzas/${pizza._id}`, { ...form, price: Number(form.price) });
        toast.success('Pizza updated!');
      } else {
        await api.post('/pizzas', { ...form, price: Number(form.price) });
        toast.success('Pizza added!');
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save pizza');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display text-xl">{pizza ? 'Edit Pizza' : 'Add New Pizza'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div><label className="block text-sm font-medium mb-1">Name</label><input required className="input-field" value={form.name} onChange={upd('name')} placeholder="e.g. Margherita Classica" /></div>
          <div><label className="block text-sm font-medium mb-1">Description</label><textarea required className="input-field" rows={2} value={form.description} onChange={upd('description')} /></div>
          <div><label className="block text-sm font-medium mb-1">Price (₹)</label><input required type="number" min="0" className="input-field" value={form.price} onChange={upd('price')} /></div>
          <div><label className="block text-sm font-medium mb-1">Category</label>
            <select className="input-field" value={form.category} onChange={upd('category')}>
              {['Veg','Non-Veg','Specialty'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium mb-1">Image URL</label><input className="input-field" value={form.imageUrl} onChange={upd('imageUrl')} placeholder="https://..." /></div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="avail" checked={form.isAvailable} onChange={upd('isAvailable')} className="accent-pizza-red" />
            <label htmlFor="avail" className="text-sm">Available on menu</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Saving...' : 'Save Pizza'}</button>
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminPizzas() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | pizza object

  const fetchPizzas = () => {
    api.get('/pizzas?available=false')
      .then(({ data }) => setPizzas(data.pizzas))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPizzas(); }, []);

  const toggleAvail = async (pizza) => {
    try {
      await api.put(`/pizzas/${pizza._id}`, { isAvailable: !pizza.isAvailable });
      toast.success(`${pizza.name} ${!pizza.isAvailable ? 'enabled' : 'hidden'}`);
      fetchPizzas();
    } catch { toast.error('Failed to update'); }
  };

  const deletePizza = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/pizzas/${id}`);
      toast.success('Pizza deleted');
      fetchPizzas();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl text-pizza-dark">Pizza Management 🍕</h1>
        <button onClick={() => setModal('add')} className="btn-primary text-sm py-2">+ Add Pizza</button>
      </div>

      <div className="card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-orange-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Pizza</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Available</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-orange-50">
            {loading ? Array(6).fill(0).map((_, i) => (
              <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="skeleton h-4 w-full" /></td></tr>
            )) : pizzas.map(p => (
              <tr key={p._id} className="hover:bg-orange-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-orange-50"
                      onError={e => e.target.style.display='none'} />
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-xs text-gray-400 truncate max-w-[180px]">{p.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><span className="text-xs bg-orange-100 text-pizza-orange px-2 py-0.5 rounded-full font-medium">{p.category}</span></td>
                <td className="px-4 py-3 font-bold text-pizza-red">₹{p.price}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleAvail(p)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${p.isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${p.isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => setModal(p)} className="text-xs border border-pizza-orange text-pizza-orange px-3 py-1 rounded hover:bg-pizza-orange hover:text-white transition-colors">Edit</button>
                    <button onClick={() => deletePizza(p._id, p.name)} className="text-xs border border-red-300 text-red-400 px-3 py-1 rounded hover:bg-red-400 hover:text-white transition-colors">Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <PizzaModal
          pizza={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); fetchPizzas(); }}
        />
      )}
    </div>
  );
}
