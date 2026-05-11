import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createPromotion, 
  updatePromotion 
} from '../../features/promotions/promotionSlice';
import { fetchProducts } from '../../features/products/productSlice';
import { 
  Save, 
  X, 
  Upload, 
  Calendar, 
  Package, 
  Type,
  Percent,
  Check
} from 'lucide-react';
import Button from '../../components/Button';

const AdminPromotionForm = ({ promotion, onClose }) => {
  const dispatch = useDispatch();
  const { items: products = [] } = useSelector(state => state.products || {});
  const { updateLoading = false } = useSelector(state => state.promotions || {});

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    type: 'banner',
    discount_percentage: '',
    start_date: '',
    end_date: '',
    status: true,
    product_ids: []
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts({ per_page: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (promotion) {
      setFormData({
        title: promotion.title || '',
        subtitle: promotion.subtitle || '',
        description: promotion.description || '',
        type: promotion.type || 'banner',
        discount_percentage: promotion.discount_percentage || '',
        start_date: promotion.start_date ? promotion.start_date.split('T')[0] : '',
        end_date: promotion.end_date ? promotion.end_date.split('T')[0] : '',
        status: promotion.status ?? true,
        product_ids: promotion.products ? promotion.products.map(p => p.id) : []
      });
      setBannerPreview(promotion.banner);
    }
  }, [promotion]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const toggleProduct = (id) => {
    setFormData(prev => ({
      ...prev,
      product_ids: prev.product_ids.includes(id)
        ? prev.product_ids.filter(pid => pid !== id)
        : [...prev.product_ids, id]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'product_ids') {
        formData.product_ids.forEach(id => data.append('product_ids[]', id));
      } else {
        data.append(key, formData[key]);
      }
    });
    if (bannerFile) {
      data.append('banner', bannerFile);
    }

    if (promotion) {
      dispatch(updatePromotion({ id: promotion.id, formData: data }));
    } else {
      dispatch(createPromotion(data));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 className="text-3xl font-black text-black tracking-tighter uppercase mb-1">
            {promotion ? 'Edit Campaign' : 'New Campaign'}
          </h2>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Configure your marketing spotlight</p>
        </div>
        <button type="button" onClick={onClose} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
        {/* Banner Upload */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Campaign Banner</label>
          <div className="relative group aspect-[21/9] bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center hover:border-primary transition-colors cursor-pointer">
            {bannerPreview ? (
              <>
                <img src={bannerPreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload className="text-white" size={32} />
                </div>
              </>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto text-gray-300 mb-2" size={32} />
                <p className="text-xs font-bold text-gray-400 uppercase">Click to upload banner</p>
              </div>
            )}
            <input 
              type="file" 
              onChange={handleFileChange} 
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Main Title</label>
            <input 
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-bold"
              placeholder="e.g. Summer Collection 2024"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Subtitle / Tagline</label>
            <input 
              name="subtitle"
              value={formData.subtitle}
              onChange={handleInputChange}
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-bold"
              placeholder="e.g. Up to 40% OFF"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Promotion Type</label>
            <select 
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-bold appearance-none"
            >
              <option value="banner">Slider Banner</option>
              <option value="flash_sale">Flash Sale</option>
              <option value="seasonal">Seasonal Spot</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Discount % (Optional)</label>
            <div className="relative">
              <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                name="discount_percentage"
                type="number"
                value={formData.discount_percentage}
                onChange={handleInputChange}
                className="w-full p-4 pl-12 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                placeholder="40"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Campaign Status</label>
            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer">
              <input 
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleInputChange}
                className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="text-xs font-black uppercase tracking-widest">Mark as Active</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="w-full p-4 pl-12 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-bold"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                className="w-full p-4 pl-12 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-bold"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Target Products</label>
            <span className="text-[10px] bg-black text-white px-2 py-1 rounded-full font-bold">{formData.product_ids.length} Selected</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-60 overflow-y-auto p-2 border border-gray-100 rounded-3xl custom-scrollbar bg-gray-50/30">
            {(products || []).map(product => (
              <div 
                key={product.id}
                onClick={() => toggleProduct(product.id)}
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer relative group ${
                  formData.product_ids.includes(product.id)
                    ? 'border-black bg-white shadow-md'
                    : 'border-transparent bg-white/50 hover:bg-white hover:border-gray-200'
                }`}
              >
                <div className="aspect-square rounded-xl bg-gray-100 mb-2 overflow-hidden">
                  <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-[10px] font-bold text-gray-900 truncate">{product.name}</p>
                {formData.product_ids.includes(product.id) && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center shadow-lg">
                    <Check size={14} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-10 border-t border-gray-50 bg-gray-50/50">
        <Button 
          type="submit" 
          loading={updateLoading}
          className="w-full h-16 rounded-2xl bg-black text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Save size={20} /> {promotion ? 'Update Campaign' : 'Launch Campaign'}
        </Button>
      </div>
    </form>
  );
};

export default AdminPromotionForm;
