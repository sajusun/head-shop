import React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const Pagination = ({ pagination, onPageChange, onPerPageChange, variant = 'admin' }) => {
  const { current_page, last_page, total, from, to, per_page } = pagination;

  if (!total || total === 0) return null;

  const renderPageButtons = () => {
    const buttons = [];
    const maxVisible = 5;
    let start = Math.max(1, current_page - Math.floor(maxVisible / 2));
    let end = Math.min(last_page, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
            current_page === i
              ? variant === 'admin' 
                ? 'bg-black text-white shadow-lg shadow-black/10'
                : 'bg-primary text-white shadow-lg shadow-primary/20'
              : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className={`px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6 ${variant === 'admin' ? 'border-t border-gray-50 bg-white' : 'mt-12 pt-12 border-t border-gray-100'}`}>
      <div className="flex flex-wrap items-center gap-8">
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">
          Showing <span className="text-text font-black">{from || 0}</span> to <span className="text-text font-black">{to || 0}</span> <span className="mx-1">of</span> <span className="text-text font-black">{total || 0}</span> items
        </div>

        {onPerPageChange && (
          <div className="flex items-center gap-3 pl-8 border-l border-gray-100">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Display</span>
            <div className="relative group">
              <select
                value={per_page || 10}
                onChange={(e) => {
                  onPerPageChange(Number(e.target.value));
                  onPageChange(1);
                }}
                className="bg-gray-50 border border-gray-100 rounded-xl pl-4 pr-10 py-2.5 text-xs font-black text-text outline-none focus:ring-4 focus:ring-black/5 transition-all appearance-none cursor-pointer min-w-[100px]"
              >
                {[10, 20, 50, 100].map(val => (
                  <option key={val} value={val}>{val} Items</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-text transition-colors" size={14} />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page === 1}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-black disabled:opacity-30 transition-all shadow-sm"
        >
          <ChevronLeft size={18} />
        </button>
        
        <div className="flex items-center gap-1.5">
          {renderPageButtons()}
        </div>

        <button
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page === last_page}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-black disabled:opacity-30 transition-all shadow-sm"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
