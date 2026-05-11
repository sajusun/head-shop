import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAllPromotions, 
  deletePromotion, 
  resetPromotionState 
} from '../../features/promotions/promotionSlice';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  Tag, 
  Eye,
  Loader2,
  AlertCircle,
  Megaphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Button';
import AdminPromotionForm from './AdminPromotionForm';

const AdminPromotions = () => {
  const dispatch = useDispatch();
  const { all: promotions = [], loading = false, error = null, success = false } = useSelector(state => state.promotions || {});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  useEffect(() => {
    dispatch(fetchAllPromotions());
  }, [dispatch]);

  useEffect(() => {
    if (success && isFormOpen) {
      setIsFormOpen(false);
      setSelectedPromotion(null);
      dispatch(resetPromotionState());
    }
  }, [success, isFormOpen, dispatch]);

  const handleEdit = (promotion) => {
    setSelectedPromotion(promotion);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      dispatch(deletePromotion(id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50">
        <div>
          <h1 className="text-4xl font-black text-black tracking-tighter uppercase mb-2">Promotions</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Marketing Campaigns & Banners</p>
        </div>
        <Button 
          onClick={() => { setSelectedPromotion(null); setIsFormOpen(true); }}
          className="rounded-2xl px-8 h-14 bg-black text-white font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl shadow-black/20 hover:scale-105 transition-all"
        >
          <Plus size={20} /> New Campaign
        </Button>
      </div>

      {loading && promotions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
          <Loader2 className="w-12 h-12 text-black animate-spin mb-4" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Campaigns...</p>
        </div>
      ) : promotions.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Megaphone size={40} className="text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Promotions</h3>
          <p className="text-gray-500 mb-8 max-w-xs mx-auto">Create your first marketing campaign to boost your sales.</p>
          <Button variant="outline" onClick={() => setIsFormOpen(true)}>Create Promotion</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(promotions || []).map((promo) => (
            <motion.div
              layout
              key={promo.id}
              className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:border-black hover:shadow-2xl transition-all duration-500 flex flex-col"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                {promo.banner ? (
                  <img src={promo.banner} alt={promo.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 italic text-xs uppercase tracking-widest font-black">No Banner</div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    promo.status ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
                  }`}>
                    {promo.status ? 'Active' : 'Draft'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-black text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {promo.type}
                  </span>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-black text-black mb-1 group-hover:text-primary transition-colors">{promo.title}</h3>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">{promo.subtitle}</p>
                
                <div className="space-y-3 mb-8 flex-1">
                  <div className="flex items-center gap-3 text-gray-500 text-xs font-medium">
                    <Calendar size={14} className="text-gray-400" />
                    {promo.start_date ? new Date(promo.start_date).toLocaleDateString() : 'Immediate'} - {promo.end_date ? new Date(promo.end_date).toLocaleDateString() : 'Forever'}
                  </div>
                  <div className="flex items-center gap-3 text-gray-500 text-xs font-medium">
                    <Tag size={14} className="text-gray-400" />
                    {promo.products_count || 0} Products Linked
                  </div>
                  {promo.discount_percentage > 0 && (
                    <div className="flex items-center gap-3 text-primary text-xs font-black uppercase tracking-widest">
                      <Tag size={14} />
                      {promo.discount_percentage}% OFF Campaign
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-6 border-t border-gray-50">
                  <button 
                    onClick={() => handleEdit(promo)}
                    className="flex-1 h-12 bg-gray-50 hover:bg-black hover:text-white rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(promo.id)}
                    className="w-12 h-12 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 rounded-xl flex items-center justify-center transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal/Form Overlay */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <AdminPromotionForm 
                promotion={selectedPromotion} 
                onClose={() => setIsFormOpen(false)} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPromotions;
