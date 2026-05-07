import React, { useEffect, useState } from 'react';
import { 
  FiUsers, 
  FiPackage, 
  FiShoppingCart, 
  FiDollarSign, 
  FiTrendingUp, 
  FiClock, 
  FiCheckCircle, 
  FiAlertCircle 
} from 'react-icons/fi';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard-stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats?.total_users || 0, icon: FiUsers, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Products', value: stats?.total_products || 0, icon: FiPackage, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Orders', value: stats?.total_orders || 0, icon: FiShoppingCart, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Revenue', value: `$${stats?.total_revenue?.toLocaleString() || 0}`, icon: FiDollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-2">Welcome back to the Herd Shop management suite.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.bg} p-3 rounded-xl`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <FiTrendingUp className="text-green-500 w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-gray-500">{card.label}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <button className="text-sm font-semibold text-black hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-500 text-xs font-semibold uppercase">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats?.recent_orders?.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-gray-600">#{order.order_number}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">
                          {order.user?.name?.charAt(0) || 'G'}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{order.user?.name || 'Guest'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">${order.total_amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="space-y-6">
          <div className="bg-black text-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-bold mb-4">Store Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Inventory Level</span>
                <span className="font-semibold">84%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5">
                <div className="bg-white h-1.5 rounded-full w-[84%]"></div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-gray-400 text-sm">Customer Rating</span>
                <span className="font-semibold">4.8/5.0</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Pending Tasks</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FiClock className="text-amber-500 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{stats?.pending_orders} Orders to Process</p>
                  <p className="text-xs text-gray-500">Shipping deadline today</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FiAlertCircle className="text-red-500 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-900">3 Low Stock Alerts</p>
                  <p className="text-xs text-gray-500">Inventory check required</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
