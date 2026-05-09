import React, { useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../features/cart/cartSlice';
import api from '../services/api';
import { CheckCircle2, ArrowRight, Package, Calendar, MapPin, Loader2 } from 'lucide-react';
import Button from '../components/Button';
import { motion } from 'framer-motion';

const OrderSuccessPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = React.useState(location.state?.order || null);
  const [loading, setLoading] = React.useState(!order);
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    // 1. Clear the cart immediately
    dispatch(clearCart());

    // 2. If no order in state but we have ID in URL, fetch it
    if (!order && orderId) {
      api.get(`/orders/${orderId}`)
        .then(res => setOrder(res.data.data))
        .catch(err => console.error('Failed to fetch order', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [dispatch, orderId, order]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[3rem] shadow-2xl shadow-green-500/5 border border-gray-100 overflow-hidden"
        >
          <div className="p-12 text-center border-b border-gray-50">
            <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <CheckCircle2 size={48} />
            </div>
            <h1 className="text-4xl font-black text-text mb-4">Payment Successful!</h1>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              Thank you for your purchase. Your order has been placed and is now being processed.
            </p>
          </div>

          <div className="p-12 bg-gray-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest">Order Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-text shadow-sm">
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Order Number</p>
                      <p className="text-sm font-bold">{order?.order_number || '#ORD-UNKNOWN'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-text shadow-sm">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Order Date</p>
                      <p className="text-sm font-bold">{new Date().toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-text shadow-sm">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Shipping To</p>
                      <p className="text-sm font-bold truncate max-w-[200px]">{order?.full_name}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest">Next Steps</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-sm text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</div>
                    We'll send you an email confirmation shortly with tracking details.
                  </li>
                  <li className="flex gap-3 text-sm text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</div>
                    Our warehouse will prepare your premium items for shipment.
                  </li>
                  <li className="flex gap-3 text-sm text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</div>
                    Enjoy your Herd Shop products and don't forget to tag us!
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-8 bg-white flex flex-col sm:flex-row gap-4">
            <Link to="/orders" className="flex-1">
              <Button variant="outline" className="w-full rounded-2xl h-14 font-bold border-gray-100">
                View My Orders
              </Button>
            </Link>
            <Link to="/products" className="flex-1">
              <Button className="w-full rounded-2xl h-14 font-black flex items-center justify-center gap-2">
                Continue Shopping <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
