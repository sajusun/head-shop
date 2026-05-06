import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { removeFromCart, updateQuantity, selectCartTotal } from '../features/cart/cartSlice';
import Button from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';

const CartPage = () => {
  const { items } = useSelector(state => state.cart);
  const total = useSelector(selectCartTotal);
  const dispatch = useDispatch();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingBag size={48} className="text-gray-300" />
        </div>
        <h1 className="text-3xl font-black text-text mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-10 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Explore our collection to find something you love.</p>
        <Link to="/products">
          <Button size="lg" className="rounded-full px-10">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black text-text mb-12">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-6 bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-2xl overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-text truncate sm:text-lg">{item.name}</h3>
                    <button 
                      onClick={() => dispatch(removeFromCart(item))}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.category}</span>
                    {item.selectedColor && (
                      <span className="text-xs font-bold text-primary flex items-center gap-1.5 before:content-[''] before:w-1 before:h-1 before:bg-gray-300 before:rounded-full">
                        Color: {item.selectedColor}
                      </span>
                    )}
                    {item.selectedSize && (
                      <span className="text-xs font-bold text-primary flex items-center gap-1.5 before:content-[''] before:w-1 before:h-1 before:bg-gray-300 before:rounded-full">
                        Size: {item.selectedSize}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-100 rounded-xl p-1 bg-gray-50">
                      <button 
                        onClick={() => dispatch(updateQuantity({ 
                          id: item.id, 
                          selectedColor: item.selectedColor, 
                          selectedSize: item.selectedSize,
                          quantity: Math.max(1, item.quantity - 1) 
                        }))}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
                      ><Minus size={14} /></button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => dispatch(updateQuantity({ 
                          id: item.id, 
                          selectedColor: item.selectedColor, 
                          selectedSize: item.selectedSize,
                          quantity: item.quantity + 1 
                        }))}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
                      ><Plus size={14} /></button>
                    </div>
                    <div className="flex flex-col items-end">
                      {item.offerPrice && (
                        <span className="text-xs text-gray-400 line-through mb-0.5">${(item.price * item.quantity).toFixed(2)}</span>
                      )}
                      <span className="text-lg font-black text-primary">
                        ${((item.offerPrice || item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <Link to="/products" className="inline-flex items-center gap-2 text-primary font-bold hover:underline py-4">
            <ArrowLeft size={18} /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl sticky top-24">
            <h2 className="text-xl font-bold text-text mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-8 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-text">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-500 font-bold">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-bold text-text">${(total * 0.1).toFixed(2)}</span>
              </div>
              <div className="h-px bg-gray-100 my-4"></div>
              <div className="flex justify-between text-lg font-black text-text">
                <span>Total</span>
                <span>${(total * 1.1).toFixed(2)}</span>
              </div>
            </div>

            <Link to="/checkout">
              <Button size="lg" className="w-full rounded-2xl h-14">Checkout Now</Button>
            </Link>
            
            <p className="mt-6 text-center text-xs text-gray-400">
              Secure Checkout Powered by HerdPay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
