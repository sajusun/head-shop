import React, { useEffect, useState } from 'react';
import { 
  FiEye, 
  FiTruck, 
  FiCheckCircle, 
  FiClock, 
  FiXCircle, 
  FiSearch, 
  FiFilter, 
  FiX, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiCreditCard,
  FiShoppingBag
} from 'react-icons/fi';
import api from '../../services/api';
import SortableHeader from '../../components/admin/SortableHeader';
import Pagination from '../../components/common/Pagination';
import { useMemo } from 'react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedOrders = useMemo(() => {
    const items = [...orders];
    items.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (aVal === bVal) return 0;
      const result = aVal < bVal ? -1 : 1;
      return sortConfig.direction === 'asc' ? result : -result;
    });
    return items;
  }, [orders, sortConfig]);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, paymentStatusFilter, searchTerm, page, perPage]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/orders', {
        params: { 
          status: statusFilter || undefined,
          payment_status: paymentStatusFilter || undefined,
          search: searchTerm || undefined,
          page: page,
          per_page: perPage
        }
      });
      setOrders(response.data.data);
      setPagination(response.data.pagination || { current_page: 1, last_page: 1, total: 0 });
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, field, value) => {
    setUpdating(true);
    try {
      await api.put(`/admin/orders/${id}/status`, { [field]: value });
      if (selectedOrder && selectedOrder.id === id) {
        fetchOrderDetails(id);
      }
      fetchOrders();
    } catch (error) {
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const fetchOrderDetails = async (id) => {
    try {
      const response = await api.get(`/admin/orders/${id}`);
      setSelectedOrder(response.data.data);
      setDetailsModalOpen(true);
    } catch (error) {
      alert('Failed to fetch order details');
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

  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'refunded': return 'bg-gray-100 text-gray-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-500 text-sm">Monitor sales, track shipments, and manage payment statuses.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order #, Name, Email..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 text-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-xl text-sm font-semibold bg-white">
            <FiFilter className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent outline-none cursor-pointer"
            >
              <option value="">All Order Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-xl text-sm font-semibold bg-white">
            <FiCreditCard className="text-gray-400" />
            <select
              value={paymentStatusFilter}
              onChange={(e) => {
                setPaymentStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent outline-none cursor-pointer"
            >
              <option value="">All Payment Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-500 text-xs font-semibold uppercase">
              <tr>
                <SortableHeader label="Order Details" sortKey="order_number" currentSort={sortConfig} onSort={handleSort} />
                <SortableHeader label="Customer" sortKey="full_name" currentSort={sortConfig} onSort={handleSort} />
                <SortableHeader label="Amount" sortKey="total_amount" currentSort={sortConfig} onSort={handleSort} />
                <SortableHeader label="Status" sortKey="status" currentSort={sortConfig} onSort={handleSort} />
                <SortableHeader label="Payment" sortKey="payment_status" currentSort={sortConfig} onSort={handleSort} />
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
                sortedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm font-bold text-gray-900">#{order.order_number}</div>
                      <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-1">
                        <FiClock size={10} />
                        {new Date(order.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{order.full_name}</div>
                      <div className="text-xs text-gray-500">{order.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">${order.total_amount}</div>
                      <div className="text-[10px] text-gray-400 capitalize">{order.payment_method?.replace('_', ' ')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getPaymentStatusStyle(order.payment_status)}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => fetchOrderDetails(order.id)}
                          className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FiEye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination 
          pagination={pagination} 
          onPageChange={setPage} 
          onPerPageChange={setPerPage}
        />
      </div>

      {/* Order Details Modal */}
      {detailsModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-8 border-b border-gray-50">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusStyle(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">ID: {selectedOrder.order_number} • {new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setDetailsModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
                <FiX size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Items */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-gray-50 rounded-3xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FiShoppingBag />
                      Order Items
                    </h3>
                    <div className="space-y-4">
                      {selectedOrder.items?.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                          <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                            <img 
                              src={item.product?.primary_image?.image_path || 'https://via.placeholder.com/100'} 
                              alt={item.product?.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 truncate">{item.product?.name}</h4>
                            <p className="text-[10px] text-gray-500 flex items-center gap-2 mt-0.5">
                              {item.selected_color && <span>Color: {item.selected_color}</span>}
                              {item.selected_size && <span>Size: {item.selected_size}</span>}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs font-medium text-gray-400">Qty: {item.quantity}</span>
                              <span className="text-sm font-bold text-black">${item.price * item.quantity}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-semibold">${selectedOrder.subtotal}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Shipping</span>
                        <span className="font-semibold">${selectedOrder.shipping_cost}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                        <span>Total Amount</span>
                        <span>${selectedOrder.total_amount}</span>
                      </div>
                    </div>
                  </div>

                  {selectedOrder.notes && (
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                      <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Customer Note</h4>
                      <p className="text-sm text-amber-800 italic">"{selectedOrder.notes}"</p>
                    </div>
                  )}
                </div>

                {/* Right Column: Customer & Shipping */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <FiUser />
                      Customer Details
                    </h3>
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3 shadow-sm">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700">
                          {selectedOrder.full_name?.charAt(0)}
                        </div>
                        <span className="font-bold">{selectedOrder.full_name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <FiMail className="shrink-0" />
                        <span className="truncate">{selectedOrder.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <FiPhone className="shrink-0" />
                        <span>{selectedOrder.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <FiMapPin />
                      Shipping Address
                    </h3>
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-1 shadow-sm">
                      <p className="text-sm text-gray-700 leading-relaxed">{selectedOrder.address}</p>
                      <p className="text-sm text-gray-700 font-medium">{selectedOrder.city}, {selectedOrder.postal_code}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <FiTruck />
                      Manage Status
                    </h3>
                    <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Order Status</label>
                        <select 
                          value={selectedOrder.status}
                          onChange={(e) => handleStatusUpdate(selectedOrder.id, 'status', e.target.value)}
                          disabled={updating}
                          className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-black/5 disabled:opacity-50"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Payment Status</label>
                        <select 
                          value={selectedOrder.payment_status}
                          onChange={(e) => handleStatusUpdate(selectedOrder.id, 'payment_status', e.target.value)}
                          disabled={updating}
                          className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-black/5 disabled:opacity-50"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 border-t border-gray-50 bg-gray-50/50 flex justify-end">
              <button 
                onClick={() => setDetailsModalOpen(false)}
                className="px-8 py-3 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
