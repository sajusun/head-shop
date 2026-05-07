import React, { useEffect, useState } from 'react';
import { FiEye, FiTruck, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import api from '../../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/orders', {
        params: { status: statusFilter }
      });
      setOrders(response.data.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-purple-100 text-purple-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm">Monitor and manage customer purchases.</p>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {['', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
              statusFilter === status 
                ? 'bg-black text-white' 
                : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            {status === '' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-500 text-xs font-semibold uppercase">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm">#{order.order_number}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{order.user?.name}</div>
                      <div className="text-xs text-gray-500">{order.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      ${order.total_amount}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="text-xs font-bold border-none bg-gray-50 rounded-lg px-2 py-1 focus:ring-0 cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
