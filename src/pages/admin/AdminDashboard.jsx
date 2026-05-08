import React, { useEffect, useState, useMemo } from 'react';
import { 
  FiUsers, 
  FiPackage, 
  FiShoppingCart, 
  FiDollarSign, 
  FiTrendingUp, 
  FiClock, 
  FiCheckCircle, 
  FiAlertCircle,
  FiArrowUpRight,
  FiArrowDownRight,
  FiActivity
} from 'react-icons/fi';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import api from '../../services/api';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon: Icon, color, bg, trend, trendValue }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`${bg} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${
          trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          {trend === 'up' ? <FiArrowUpRight /> : <FiArrowDownRight />}
          {trendValue}%
        </div>
      )}
    </div>
    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
    <h3 className="text-2xl font-bold text-text mt-1">{value}</h3>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard-stats');
        setStats(response.data.data || response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const chartData = useMemo(() => {
    if (!stats?.chart_data?.length) {
      return [
        { name: 'Mon', sales: 0 },
        { name: 'Tue', sales: 0 },
        { name: 'Wed', sales: 0 },
        { name: 'Thu', sales: 0 },
        { name: 'Fri', sales: 0 },
        { name: 'Sat', sales: 0 },
        { name: 'Sun', sales: 0 },
      ];
    }
    return stats.chart_data;
  }, [stats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Analytics Overview</h1>
          <p className="text-gray-500 font-medium text-sm">Real-time performance metrics for Herd Shop.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-100 text-xs font-bold text-gray-500 shadow-sm">
          <FiActivity className="text-primary animate-pulse" />
          Live System Update: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Revenue" 
          value={`$${Number(stats?.total_revenue || 0).toLocaleString()}`} 
          icon={FiDollarSign} 
          color="text-emerald-600" 
          bg="bg-emerald-50"
          trend="up"
          trendValue="12.5"
        />
        <StatCard 
          label="Total Orders" 
          value={stats?.total_orders || 0} 
          icon={FiShoppingCart} 
          color="text-blue-600" 
          bg="bg-blue-50"
          trend="up"
          trendValue="8.2"
        />
        <StatCard 
          label="Total Products" 
          value={stats?.total_products || 0} 
          icon={FiPackage} 
          color="text-purple-600" 
          bg="bg-purple-50"
        />
        <StatCard 
          label="Active Users" 
          value={stats?.total_users || 0} 
          icon={FiUsers} 
          color="text-amber-600" 
          bg="bg-amber-50"
          trend="up"
          trendValue="4.1"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-text">Revenue Growth</h3>
              <p className="text-xs text-gray-400 font-medium">Weekly sales performance analysis.</p>
            </div>
            <select className="text-xs font-bold text-gray-500 bg-gray-50 border-none rounded-lg px-3 py-2 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#000" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Stats */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-text mb-2">Inventory Status</h3>
          <p className="text-xs text-gray-400 font-medium mb-8">Stock and publication distribution.</p>
          
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Published</span>
                <span className="text-sm font-bold text-text">{stats?.product_stats?.active || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-black h-1.5 rounded-full transition-all duration-1000" 
                  style={{ width: `${(stats?.product_stats?.active / stats?.total_products) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Drafts</span>
                <span className="text-sm font-bold text-text">{stats?.product_stats?.draft || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-gray-400 h-1.5 rounded-full transition-all duration-1000" 
                  style={{ width: `${(stats?.product_stats?.draft / stats?.total_products) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-lg flex items-center justify-center">
                  <FiAlertCircle size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-text">{stats?.pending_orders} Pending Orders</p>
                  <p className="text-[10px] text-gray-400 font-medium">Needs immediate attention</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center">
                  <FiCheckCircle size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-text">{stats?.published_blogs} Published Stories</p>
                  <p className="text-[10px] text-gray-400 font-medium">Journal is performing well</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-text">Recent Transactions</h3>
            <button className="text-xs font-bold text-primary hover:underline">View All Orders</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats?.recent_orders?.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-gray-400">#{order.order_number}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-500 group-hover:bg-black group-hover:text-white transition-colors">
                          {order.user?.name?.charAt(0) || 'G'}
                        </div>
                        <span className="text-sm font-bold text-text">{order.user?.name || 'Guest Customer'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-text">${order.total_amount}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-tighter ${
                        order.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                        order.status === 'delivered' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
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
      </div>
    </div>
  );
};

export default AdminDashboard;
