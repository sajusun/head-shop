import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, CreditCard, Truck, MapPin, ArrowLeft } from 'lucide-react';
import { clearCart, selectCartTotal } from '../features/cart/cartSlice';
import Button from '../components/Button';
import Input from '../components/Input';
import { motion } from 'framer-motion';

const CheckoutPage = () => {
  const [step, setStep] = useState('shipping'); // shipping, payment, success
  const { items } = useSelector(state => state.cart);
  const total = useSelector(selectCartTotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setStep('success');
    dispatch(clearCart());
  };

  if (step === 'success') {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h1 className="text-4xl font-black text-text mb-4">Order Placed!</h1>
        <p className="text-gray-500 mb-10">Thank you for your purchase. We've sent a confirmation email to your inbox.</p>
        <Link to="/products">
          <Button size="lg" className="rounded-full px-10">Back to Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black text-text mb-12">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Info */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <MapPin size={20} />
              </div>
              <h2 className="text-xl font-bold">Shipping Details</h2>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name" placeholder="John Doe" required />
              <Input label="Email Address" placeholder="john@example.com" type="email" required />
              <Input label="Phone Number" placeholder="+1 (555) 000-0000" className="md:col-span-2" />
              <Input label="Shipping Address" placeholder="123 Main St, Apt 4" className="md:col-span-2" required />
              <Input label="City" placeholder="New York" required />
              <Input label="Postal Code" placeholder="10001" required />
            </form>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm opacity-50 pointer-events-none">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                <CreditCard size={20} />
              </div>
              <h2 className="text-xl font-bold">Payment Method</h2>
            </div>
            <p className="text-sm text-gray-500 italic">Payment processing is integrated for production builds.</p>
          </div>

          <div className="flex justify-between items-center">
            <Link to="/cart" className="text-gray-500 font-medium hover:text-primary flex items-center gap-2">
              <ArrowLeft size={18} /> Return to Cart
            </Link>
            <Button size="lg" className="rounded-xl px-12" onClick={handlePlaceOrder}>
              Complete Order
            </Button>
          </div>
        </div>

        {/* Mini Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-8 rounded-3xl sticky top-24">
            <h2 className="text-lg font-bold mb-6">In Your Bag</h2>
            <div className="space-y-4 mb-8">
              {items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-gray-100">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold truncate">{item.name}</h4>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    <p className="text-sm font-black text-primary mt-1">
                      ${((item.offerPrice || item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-px bg-gray-200 mb-6"></div>
            <div className="flex justify-between items-center text-xl font-black">
              <span>Total</span>
              <span>${(total * 1.1).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
