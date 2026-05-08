import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ pagination, onPageChange, onPerPageChange }) => {
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
          className={`w-10 h-10 rounded-lg text-xs font-bold transition-all ${
            current_page === i
              ? 'bg-black text-white shadow-lg shadow-black/10'
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
    <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-6">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Showing <span className="text-text font-bold">{from || 0}</span> to <span className="text-text font-bold">{to || 0}</span> of <span className="text-text font-bold">{total || 0}</span> items
        </div>

        {onPerPageChange && (
          <div className="flex items-center gap-2 pl-6 border-l border-gray-200">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Show</span>
            <select
              value={per_page || 10}
              onChange={(e) => {
                onPerPageChange(Number(e.target.value));
                onPageChange(1); // Reset to first page
              }}
              className="bg-white border border-gray-100 rounded-lg px-2 py-1 text-[10px] font-black text-text outline-none focus:ring-4 focus:ring-black/5 transition-all appearance-none cursor-pointer min-w-[50px] text-center"
            >
              {[10, 25, 50, 100].map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page === 1}
          className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-black disabled:opacity-50 transition-all"
        >
          <FiChevronLeft size={18} />
        </button>
        
        <div className="flex items-center gap-1.5">
          {renderPageButtons()}
        </div>

        <button
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page === last_page}
          className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-black disabled:opacity-50 transition-all"
        >
          <FiChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
