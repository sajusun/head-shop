import React from 'react';
import { motion } from 'framer-motion';
import { Package, ChevronRight, ExternalLink, Clock, CheckCircle2, Truck, ArrowLeft } from 'lucide-react';
import { mockOrders } from '../mock/orders';
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';

const OrdersPage = () => {
  const navigate = useNavigate();
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                    <Link to={`/product/${item.id}`} className="p-2 text-gray-400 hover:text-primary transition-colors">
                      <ExternalLink size={16} />
                    </Link>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-50 flex justify-end gap-3">
                <Button variant="outline" size="sm" className="rounded-xl">Track Order</Button>
                <Button size="sm" className="rounded-xl">Order Details</Button>
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
    </div>
  );
};

export default OrdersPage;
