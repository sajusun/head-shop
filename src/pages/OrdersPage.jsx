import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  ChevronRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  Truck,
  ArrowLeft,
  MapPin,
  CreditCard,
  Calendar,
  Info,
  ShieldCheck,
  Circle
} from 'lucide-react';
import { mockOrders } from '../mock/orders';
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'details', 'track'

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'text-green-500 bg-green-50 border-green-100';
      case 'In Transit': return 'text-blue-500 bg-blue-50 border-blue-100';
      case 'Pending': return 'text-amber-500 bg-amber-50 border-amber-100';
      default: return 'text-gray-500 bg-gray-50 border-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <CheckCircle2 size={14} />;
      case 'In Transit': return <Truck size={14} />;
      case 'Pending': return <Clock size={14} />;
      default: return null;
    }
  };

  const handleViewOrder = (order, type) => {
    setSelectedOrder(order);
    setView(type);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedOrder(null);
  };

  const renderOrderList = () => (
    <div className="space-y-6">
      {mockOrders.map((order, index) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Order Header */}
          <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex flex-wrap gap-6 justify-between items-center">
            <div className="flex gap-8">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Order ID</p>
                <p className="text-sm font-black text-text">{order.id}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Date Placed</p>
                <p className="text-sm font-bold text-text">{order.date}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Total Amount</p>
                <p className="text-sm font-black text-primary">${order.total.toFixed(2)}</p>
              </div>
            </div>

            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              {order.status}
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6">
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-text truncate">{item.name}</h4>
                    <p className="text-xs text-gray-400">Qty: {item.quantity} × ${item.price}</p>
                  </div>
                  <Link to={`/product/${item.slug}`} className="p-2 text-gray-400 hover:text-primary transition-colors">
                    <ExternalLink size={16} />
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50 flex justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => handleViewOrder(order, 'track')}
              >
                Track Order
              </Button>
              <Button
                size="sm"
                className="rounded-xl"
                onClick={() => handleViewOrder(order, 'details')}
              >
                Order Details
              </Button>
            </div>
          </div>
        </motion.div>
      ))}

      {mockOrders.length === 0 && (
        <div className="text-center py-24 bg-white rounded-[40px] border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="text-gray-300" size={40} />
          </div>
          <h3 className="text-xl font-bold text-text mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-8">When you buy something, it will appear here.</p>
          <Link to="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      )}
    </div>
  );

  const renderOrderDetails = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handleBackToList}
          className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Orders
        </button>
        <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-bold ${getStatusColor(selectedOrder.status)}`}>
          {getStatusIcon(selectedOrder.status)}
          {selectedOrder.status}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Items and Summary */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden p-8">
            <h3 className="text-xl font-black text-text mb-6 flex items-center gap-2">
              <Package size={20} className="text-primary" />
              Order Items
            </h3>
            <div className="space-y-6">
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                  <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-text mb-1">{item.name}</h4>
                    <p className="text-sm text-gray-500 mb-2">Quantity: {item.quantity}</p>
                    <p className="text-primary font-black">${item.price.toFixed(2)}</p>
                  </div>
                  <Link to={`/product/${item.slug}`}>
                    <Button variant="outline" size="sm" className="rounded-xl px-4">Buy Again</Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
            <h3 className="text-xl font-black text-text mb-6 flex items-center gap-2">
              <Info size={20} className="text-primary" />
              Order Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-bold text-text">${selectedOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="font-bold text-text">${selectedOrder.shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Tax</span>
                <span className="font-bold text-text">${selectedOrder.tax.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-lg font-black text-text">Total</span>
                <span className="text-2xl font-black text-primary">${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Address and Payment */}
        <div className="space-y-8">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
            <h3 className="text-lg font-black text-text mb-6 flex items-center gap-2">
              <MapPin size={20} className="text-primary" />
              Shipping Address
            </h3>
            <div className="space-y-1 text-gray-500 text-sm">
              <p className="font-bold text-text text-base mb-2">{selectedOrder.shippingAddress.name}</p>
              <p>{selectedOrder.shippingAddress.street}</p>
              <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}</p>
              <p>{selectedOrder.shippingAddress.country}</p>
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
            <h3 className="text-lg font-black text-text mb-6 flex items-center gap-2">
              <CreditCard size={20} className="text-primary" />
              Payment Method
            </h3>
            <p className="text-gray-500 text-sm flex items-center gap-2">
              <span className="w-8 h-5 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-[10px] font-bold">CARD</span>
              {selectedOrder.paymentMethod}
            </p>
          </div>

          <div className="bg-primary/5 rounded-[32px] border border-primary/10 p-8">
            <h3 className="text-lg font-black text-text mb-4 flex items-center gap-2">
              <ShieldCheck size={20} className="text-primary" />
              Need Help?
            </h3>
            <p className="text-sm text-gray-600 mb-6">If you have any issues with your order, our support team is here to help 24/7.</p>
            <Link to="/contact" state={{ orderId: selectedOrder.id, subject: 'Order Support' }}>
              <Button className="w-full rounded-2xl">Contact Support</Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderTrackOrder = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-12">
        <button
          onClick={handleBackToList}
          className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors group mb-8"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Orders
        </button>

        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 font-black mb-2">Tracking Order</p>
              <h2 className="text-3xl font-black text-text">{selectedOrder.id}</h2>
            </div>
            <div className={`px-6 py-3 rounded-2xl border text-base font-black flex items-center gap-2 ${getStatusColor(selectedOrder.status)}`}>
              {getStatusIcon(selectedOrder.status)}
              {selectedOrder.status}
            </div>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100"></div>

            <div className="space-y-12">
              {selectedOrder.trackingHistory.map((step, idx) => (
                <div key={idx} className="relative pl-12">
                  {/* Timeline Dot */}
                  <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${step.completed ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                    {step.completed ? <CheckCircle2 size={14} /> : <Circle size={10} fill="currentColor" />}
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <h4 className={`text-lg font-black ${step.completed ? 'text-text' : 'text-gray-400'}`}>{step.status}</h4>
                      <p className="text-sm text-gray-500">{step.location}</p>
                    </div>
                    <div className="text-right md:text-right">
                      <p className="text-sm font-bold text-text">{step.date}</p>
                      <p className="text-xs text-gray-400">{step.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 p-8 bg-gray-50 rounded-[32px] border border-gray-100 flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
              <Truck size={32} />
            </div>
            <div>
              <h4 className="font-black text-text">Estimated Delivery</h4>
              <p className="text-gray-500">Your package is expected to arrive by Monday, April 25th.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
            </button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div>
                <h1 className="text-4xl font-black text-text mb-2">My Orders</h1>
                <p className="text-gray-500">Track and manage your recent purchases</p>
              </div>
            </div>

            {renderOrderList()}
          </motion.div>
        ) : view === 'details' ? (
          renderOrderDetails()
        ) : (
          renderTrackOrder()
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage;

