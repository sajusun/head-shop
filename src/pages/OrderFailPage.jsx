import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCcw, Headset } from 'lucide-react';
import Button from '../components/Button';
import { motion } from 'framer-motion';

const OrderFailPage = () => {
  return (
    <div className="bg-gray-50/50 min-h-screen py-20 px-4">
      <div className="max-w-xl mx-auto">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[3rem] shadow-2xl shadow-red-500/5 border border-gray-100 overflow-hidden text-center"
        >
          <div className="p-12">
            <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <XCircle size={48} />
            </div>
            <h1 className="text-4xl font-black text-text mb-4">Payment Failed</h1>
            <p className="text-gray-500 text-lg mb-10">
              We couldn't process your payment. This might be due to incorrect details or insufficient funds.
            </p>

            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-text shadow-sm">
                  <RefreshCcw size={20} className="text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold">Try Again</h4>
                  <p className="text-xs text-gray-500">Your bag is still saved and ready.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-text shadow-sm">
                  <Headset size={20} className="text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold">Need Help?</h4>
                  <p className="text-xs text-gray-500">Contact our premium support 24/7.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Link to="/checkout">
                <Button className="w-full rounded-2xl h-14 font-black flex items-center justify-center gap-2 shadow-xl shadow-primary/20">
                  Retry Checkout <RefreshCcw size={20} />
                </Button>
              </Link>
              <Link to="/cart">
                <Button variant="outline" className="w-full rounded-2xl h-14 font-bold border-gray-100 flex items-center justify-center gap-2">
                  <ArrowLeft size={20} /> Return to Bag
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderFailPage;
