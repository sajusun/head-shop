import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, ShieldCheck, AlertCircle } from 'lucide-react';
import { removeFromCart, updateQuantity, selectCartTotal } from '../features/cart/cartSlice';
import Button from '../components/Button';

const CartPage = () => {
  const { items } = useSelector(state => state.cart);
  const total = useSelector(selectCartTotal);
  const dispatch = useDispatch();

  // Defensive check for items
  const cartItems = useMemo(() => Array.isArray(items) ? items : [], [items]);

  const getPrice = (item) => {
    const p = item.offer_price || item.offerPrice || item.effective_price || item.price;
    return Number(p || 0);
  };

  const getRegularPrice = (item) => {
    return Number(item.price || item.regularPrice || 0);
  };

  const getItemCategory = (item) => {
    if (typeof item.category === 'string') return item.category;
    if (item.category && typeof item.category === 'object') return item.category.name || 'General';
    return 'General';
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200">
          <ShoppingBag size={64} />
        </div>
        <h1 className="text-4xl font-black text-text mb-4">Your bag is empty</h1>
        <p className="text-gray-500 mb-10 max-w-md mx-auto text-lg">
          Looks like you haven't added anything to your bag yet. 
        </p>
        <Link to="/products">
          <Button size="lg" className="rounded-2xl px-12 h-14 font-black">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-text">My Bag</h1>
          <p className="text-gray-500 mt-2 font-medium">Review your selection before checkout</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, idx) => {
              const activePrice = getPrice(item);
              const regularPrice = getRegularPrice(item);
              const hasDiscount = activePrice < regularPrice;
              const itemKey = `${item.id}-${item.product_variant_id || idx}`;

              return (
                <div 
                  key={itemKey}
                  className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm"
                >
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-3xl overflow-hidden shrink-0">
                    <img 
                      src={item.image || item.thumbnail || '/placeholder-product.png'} 
                      alt="" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-text truncate text-lg">{item.name || 'Product'}</h3>
                      <button 
                        onClick={() => dispatch(removeFromCart(item))}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                      {getItemCategory(item)}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {item.selectedColor && (
                        <span className="text-[10px] font-bold bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                          COLOR: {item.selectedColor}
                        </span>
                      )}
                      {item.selectedSize && (
                        <span className="text-[10px] font-bold bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                          SIZE: {item.selectedSize}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                        <button 
                          onClick={() => dispatch(updateQuantity({ 
                            ...item,
                            quantity: Math.max(1, (item.quantity || 1) - 1) 
                          }))}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary"
                        ><Minus size={14} /></button>
                        <span className="w-8 text-center text-sm font-black">{item.quantity || 1}</span>
                        <button 
                          onClick={() => dispatch(updateQuantity({ 
                            ...item,
                            quantity: (item.quantity || 1) + 1 
                          }))}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary"
                        ><Plus size={14} /></button>
                      </div>
                      <div className="text-right">
                        {hasDiscount && (
                          <p className="text-xs text-gray-400 line-through">${(regularPrice * (item.quantity || 1)).toFixed(2)}</p>
                        )}
                        <p className="text-xl font-black text-primary">${(activePrice * (item.quantity || 1)).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <Link to="/products" className="flex items-center gap-2 text-gray-400 font-bold hover:text-primary transition-colors py-4">
              <ArrowLeft size={18} /> Continue Shopping
            </Link>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl sticky top-24">
              <h2 className="text-2xl font-black text-text mb-8">Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-text font-bold">${Number(total || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Shipping</span>
                  <span className="text-green-500 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Tax (10%)</span>
                  <span className="text-text font-bold">${(Number(total || 0) * 0.1).toFixed(2)}</span>
                </div>
                <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-lg font-black text-text uppercase">Total</span>
                  <span className="text-3xl font-black text-primary">${(Number(total || 0) * 1.1).toFixed(2)}</span>
                </div>
              </div>

              <Link to="/checkout">
                <Button size="lg" className="w-full rounded-2xl h-14 text-lg font-black shadow-lg shadow-primary/20">
                  Proceed to Checkout
                </Button>
              </Link>
              
              <div className="mt-8 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-black tracking-widest uppercase">
                  <ShieldCheck size={14} className="text-green-500" />
                  Secure Transaction
                </div>
                <div className="flex gap-3 opacity-30">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg" alt="Visa" className="h-3" />
                   <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
