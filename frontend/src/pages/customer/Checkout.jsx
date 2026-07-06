import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const RAZORPAY_KEY_ID = 'rzp_test_Sw2Pzl29Xjdqqz';

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const delivery = cartTotal >= 499 ? 0 : 49;
  const total = cartTotal + delivery;

  const handlePayment = async () => {
    if (!address.trim()) {
      toast.error('Please enter delivery address');
      return;
    }

    setLoading(true);

    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error('Razorpay failed to load. Check your internet connection.');
        setLoading(false);
        return;
      }

      const { data } = await api.post('/payment/create-order', {
        items: cart.map(i => ({ pizzaId: i.pizza._id, qty: i.qty })),
        deliveryAddress: address,
      });

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: data.amount * 100,
        currency: 'INR',
        name: 'Pizza Palace',
        description: 'Pizza Order Payment',
        order_id: data.razorpayOrderId,

        handler: async (response) => {
          try {
            await api.post('/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: data.orderId,
            });
            clearCart();
            toast.success('🎉 Payment Successful! Order Confirmed.');
            navigate('/orders');
          } catch {
            toast.error('Payment verification failed. Please try again.');
          }
        },

        prefill: {
          name: user.name,
          email: user.email,
          // Use a dummy phone number for Razorpay test mode only
          contact: '9999999999',
        },

        theme: { color: '#C0392B' },

        modal: {
          ondismiss: () => {
            toast.info('Payment cancelled');
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        toast.error('Payment failed: ' + response.error.description);
        setLoading(false);
      });
      rzp.open();

    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
      setLoading(false);
    }
  };

  if (!cart.length) return (
    <div className="max-w-5xl mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">🛒</div>
      <p className="text-gray-500 mb-4">Your cart is empty.</p>
      <Link to="/menu" className="btn-primary">Browse Menu</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl mb-6">Checkout 💳</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

        <div className="lg:col-span-3 space-y-5">

          {/* Delivery */}
          <div className="card p-6">
            <h2 className="font-display text-lg mb-4">📍 Delivery Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input className="input-field" defaultValue={user.name} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input className="input-field" defaultValue={user.email} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  className="input-field"
                  placeholder="Enter any phone number to continue"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Any value is accepted here; test payments use a dummy phone number.</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="Flat / House No, Street, Area, City, Pincode"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="card p-6">
            <h2 className="font-display text-lg mb-3">💳 Payment</h2>

            {/* Test Card Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <p className="font-bold text-blue-700 text-sm mb-3">
                🧪 Razorpay Test Card Details
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between bg-white rounded-lg px-3 py-2">
                  <span className="text-gray-500">Card Number</span>
                  <span className="font-mono font-bold tracking-wider">4111 1111 1111 1111</span>
                </div>
                <div className="flex justify-between bg-white rounded-lg px-3 py-2">
                  <span className="text-gray-500">Expiry</span>
                  <span className="font-mono font-bold">12/28</span>
                </div>
                <div className="flex justify-between bg-white rounded-lg px-3 py-2">
                  <span className="text-gray-500">CVV</span>
                  <span className="font-mono font-bold">123</span>
                </div>
                <div className="flex justify-between bg-white rounded-lg px-3 py-2">
                  <span className="text-gray-500">OTP (if asked)</span>
                  <span className="font-mono font-bold text-green-600">1234</span>
                </div>
              </div>
            
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Opening Razorpay...
                </>
              ) : (
                `Continue Payment ₹${total}`
              )}
            </button>
            <p className="text-center text-xs text-gray-400 mt-2">
              🔒 Secured by Razorpay · Test Mode
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2 card p-5 sticky top-20">
          <h3 className="font-display text-lg mb-4">📋 Order Summary</h3>
          <div className="space-y-3 text-sm">
            {cart.map(({ pizza, qty }) => (
              <div key={pizza._id} className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={pizza.imageUrl}
                    alt={pizza.name}
                    className="w-8 h-8 rounded object-cover flex-shrink-0"
                    onError={e => e.target.style.display = 'none'}
                  />
                  <span className="truncate text-gray-700">
                    {pizza.name} <span className="text-gray-400">×{qty}</span>
                  </span>
                </div>
                <span className="font-semibold flex-shrink-0">₹{pizza.price * qty}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-orange-100 mt-4 pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span><span>₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Delivery</span>
              <span className={delivery === 0 ? 'text-green-600 font-semibold' : ''}>
                {delivery === 0 ? 'FREE' : `₹${delivery}`}
              </span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-orange-100">
              <span>Total</span>
              <span className="text-pizza-red">₹{total}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}