import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiPackage, 
  FiShoppingCart, 
  FiUsers, 
  FiSettings, 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiBell,
  FiFileText,
  FiMail,
  FiMessageSquare
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const navItems = [
    { label: 'Dashboard', icon: FiHome, path: '/admin' },
    { label: 'Products', icon: FiPackage, path: '/admin/products' },
    { label: 'Orders', icon: FiShoppingCart, path: '/admin/orders' },
    { label: 'Users', icon: FiUsers, path: '/admin/users' },
    { label: 'Journal', icon: FiFileText, path: '/admin/journal' },
    { label: 'Newsletter', icon: FiMail, path: '/admin/newsletter' },
    { label: 'Contact', icon: FiMessageSquare, path: '/admin/contact' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transition-transform duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-black tracking-tighter text-black uppercase">Herd <span className="text-gray-400">Shop</span></span>
            </Link>
            <div className="mt-2 flex items-center space-x-2 px-2 py-1 bg-black text-white text-[10px] font-bold rounded uppercase w-fit">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              Admin Panel
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  location.pathname === item.path 
                    ? 'bg-black text-white shadow-lg shadow-black/10' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <item.icon className={`w-5 h-5 ${location.pathname === item.path ? 'text-white' : 'text-gray-400 group-hover:text-black'}`} />
                <span className="font-semibold text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-50">
            <div className="flex items-center space-x-3 px-4 py-3 rounded-2xl bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                {user?.name?.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="mt-2 w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
            >
              <FiLogOut className="w-5 h-5" />
              <span className="font-semibold text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-black relative">
              <FiBell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-100 mx-2"></div>
            <Link to="/settings" className="p-2 text-gray-400 hover:text-black">
              <FiSettings size={20} />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
