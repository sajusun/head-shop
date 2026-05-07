import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  CreditCard, 
  Truck, 
  MapPin, 
  ArrowLeft, 
  ChevronRight,
  ShieldCheck,
  Package,
  Loader2
} from 'lucide-react';
import { clearCart, selectCartTotal } from '../features/cart/cartSlice';
import Button from '../components/Button';
import Input from '../components/Input';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Stripe Public Key - Placeholder
const stripePromise = loadStripe('pk_test_51Hq7Y2L0Wv2X6y7B6V8Y9Q...'); // Use your real public key

const CheckoutForm = ({ orderData, onSuccess, total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      // 1. Create order in backend
      const orderResponse = await api.post('/orders', orderData);
      const order = orderResponse.data.data;

      if (orderData.payment_method === 'stripe') {
        // 2. Initiate Stripe Payment
        const paymentResponse = await api.post('/payments/stripe/initiate', {
          order_id: order.id
        });
        const { client_secret } = paymentResponse.data.data;

        // 3. Confirm Payment
        const result = await stripe.confirmCardPayment(client_secret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: orderData.full_name,
              email: orderData.email,
            },
          },
        });

        if (result.error) {
          setError(result.error.message);
          setProcessing(false);
        } else {
          if (result.paymentIntent.status === 'succeeded') {
            onSuccess(order);
          }
        }
      } else if (orderData.payment_method === 'sslcommerz') {
        // 2. Initiate SSLCommerz Payment
        const paymentResponse = await api.post('/payments/sslcommerz/initiate', {
          order_id: order.id
        });
        const { redirect_url } = paymentResponse.data.data;
        window.location.href = redirect_url;
      } else {
        // Cash on Delivery
        onSuccess(order);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An unexpected error occurred.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {orderData.payment_method === 'stripe' && (
        <div className="p-4 border border-gray-200 rounded-2xl bg-gray-50">
          <label className="block text-sm font-bold text-gray-700 mb-3">Credit or Debit Card</label>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <CardElement options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#1a1a1a',
                  '::placeholder': { color: '#aab7c4' },
                },
                invalid: { color: '#ef4444' },
              },
            }} />
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
          {error}
        </div>
      )}

      <Button 
        type="submit" 
        size="lg" 
        className="w-full rounded-2xl h-14 text-lg font-black shadow-xl shadow-primary/20"
        disabled={!stripe || processing}
      >
        {processing ? (
          <span className="flex items-center gap-2">
            <Loader2 className="animate-spin" /> Processing...
          </span>
        ) : (
          `Pay $${(total * 1.1).toFixed(2)} & Place Order`
        )}
      </Button>
      
      <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-2">
        <ShieldCheck size={14} className="text-green-500" />
        Secure SSL Encrypted Payment
      </p>
    </form>
  );
};

const CheckoutPage = () => {
  const [step, setStep] = useState('shipping'); // shipping, payment
  const { items } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const total = useSelector(selectCartTotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    postal_code: '',
    payment_method: 'stripe',
    notes: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const orderData = {
    ...formData,
    items: items.map(item => ({
      product_id: item.id,
      product_variant_id: item.product_variant_id,
      quantity: item.quantity,
      selected_color: item.selectedColor,
      selected_size: item.selectedSize
    }))
  };

  const handleSuccess = (order) => {
    dispatch(clearCart());
    navigate('/order/success', { state: { order } });
  };

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <Package size={40} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-black mb-2">Your bag is empty</h2>
        <p className="text-gray-500 mb-8">Add some premium items before checking out.</p>
        <Link to="/products">
          <Button variant="primary" className="rounded-full px-10">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-4">
            <Link to="/cart" className="hover:text-primary transition-colors">Bag</Link>
            <ChevronRight size={14} />
            <span className={step === 'shipping' ? 'text-text' : 'hover:text-primary transition-colors cursor-pointer'} onClick={() => setStep('shipping')}>Shipping</span>
            <ChevronRight size={14} />
            <span className={step === 'payment' ? 'text-text' : ''}>Payment</span>
          </div>
          <h1 className="text-4xl font-black text-text">Checkout</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="wait">
              {step === 'shipping' ? (
                <motion.div 
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Shipping Information</h2>
                      <p className="text-sm text-gray-500">Where should we send your order?</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input 
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                      <input 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Shipping Address</label>
                      <input 
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="123 Main St, Apt 4"
                        className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">City</label>
                      <input 
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="New York"
                        className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Postal Code</label>
                      <input 
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleInputChange}
                        placeholder="10001"
                        className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-gray-50 flex justify-end">
                    <Button 
                      size="lg" 
                      className="rounded-2xl px-12 h-14 font-black"
                      onClick={() => setStep('payment')}
                      disabled={!formData.full_name || !formData.address || !formData.city}
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center">
                        <CreditCard size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">Payment Method</h2>
                        <p className="text-sm text-gray-500">Select how you'd like to pay</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <button 
                        onClick={() => setFormData({...formData, payment_method: 'stripe'})}
                        className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${
                          formData.payment_method === 'stripe' ? 'border-primary bg-primary/5' : 'border-gray-50 hover:border-gray-200'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.payment_method === 'stripe' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                          <CreditCard size={20} />
                        </div>
                        <span className="font-bold text-sm">Stripe Card</span>
                      </button>
                      <button 
                        onClick={() => setFormData({...formData, payment_method: 'sslcommerz'})}
                        className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${
                          formData.payment_method === 'sslcommerz' ? 'border-primary bg-primary/5' : 'border-gray-50 hover:border-gray-200'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.payment_method === 'sslcommerz' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                          <Package size={20} />
                        </div>
                        <span className="font-bold text-sm">SSLCommerz</span>
                      </button>
                      <button 
                        onClick={() => setFormData({...formData, payment_method: 'cod'})}
                        className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${
                          formData.payment_method === 'cod' ? 'border-primary bg-primary/5' : 'border-gray-50 hover:border-gray-200'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.payment_method === 'cod' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                          <Truck size={20} />
                        </div>
                        <span className="font-bold text-sm">Cash on Delivery</span>
                      </button>
                    </div>

                    <Elements stripe={stripePromise}>
                      <CheckoutForm 
                        orderData={orderData} 
                        total={total} 
                        onSuccess={handleSuccess} 
                      />
                    </Elements>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-8">Order Summary</h2>
              <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                      <img src={item.image || item.thumbnail} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-text truncate">{item.name}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {item.selectedSize && `Size: ${item.selectedSize}`}
                        {item.selectedSize && item.selectedColor && ' • '}
                        {item.selectedColor && `Color: ${item.selectedColor}`}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs font-bold text-gray-500">x{item.quantity}</span>
                        <span className="text-sm font-black text-primary">
                          ${((item.effective_price || item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-50">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">Subtotal</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">Shipping</span>
                  <span className="font-bold text-green-500">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">Tax (10%)</span>
                  <span className="font-bold">${(total * 0.1).toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-lg font-black text-text uppercase">Total</span>
                  <span className="text-2xl font-black text-primary">${(total * 1.1).toFixed(2)}</span>
                </div>
              </div>

              {step === 'payment' && (
                <div className="mt-8">
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
                    <Truck className="text-blue-500 shrink-0" size={20} />
                    <p className="text-[10px] text-blue-700 font-medium leading-relaxed">
                      Complimentary premium express shipping included. Expected delivery: {new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
