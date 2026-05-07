import React from 'react';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';

const SortableHeader = ({ label, sortKey, currentSort, onSort, className = "" }) => {
  const isActive = currentSort.key === sortKey;
  
  return (
    <th 
      className={`px-6 py-4 cursor-pointer hover:bg-gray-100/50 transition-colors group ${className}`}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-2">
        <span className={isActive ? 'text-black font-bold' : ''}>{label}</span>
        <div className={`flex flex-col -space-y-1 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <FiChevronUp 
            size={12} 
            className={`${isActive && currentSort.direction === 'asc' ? 'text-primary' : 'text-gray-300'}`} 
          />
          <FiChevronDown 
            size={12} 
            className={`${isActive && currentSort.direction === 'desc' ? 'text-primary' : 'text-gray-300'}`} 
          />
        </div>
      </div>
    </th>
  );
};

export default SortableHeader;
