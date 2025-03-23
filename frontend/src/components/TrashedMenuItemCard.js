import React from 'react';
import { FiRefreshCcw, FiTrash2 } from "react-icons/fi";
import { PiDotsThreeOutlineFill } from "react-icons/pi";

const TrashedMenuItemCard = ({ id, name, image, category, onRestore, onDelete, isRestoring, isDeleting, processingId }) => {
  const isProcessingThis = processingId === id;

  return (
    <div className="h-[370px] border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden relative">
      <div className="h-2/3">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover rounded-t-lg"
        />
      </div>

      <div className="h-1/3 p-4 flex flex-col justify-between">
        <h3 className="text-lg font-semibold text-text leading-tight">{name}</h3>
        {category && (
          <p className="text-sm text-gray-600">Category: {category.name}</p>
        )}
        
        <div className="flex items-center justify-between mt-2 gap-2">
          <button
            onClick={onRestore}
            disabled={isRestoring || isDeleting}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-2 px-3 rounded-lg hover:bg-secondary hover:text-primary disabled:bg-gray-400 transition-all"
          >
            
            {isProcessingThis && isRestoring ? <PiDotsThreeOutlineFill /> : <FiRefreshCcw />}
          </button>
          
          <button
            onClick={onDelete}
            disabled={isDeleting || isRestoring}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-all"
          >
            {isProcessingThis && isDeleting ? <PiDotsThreeOutlineFill /> : <FiTrash2 />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrashedMenuItemCard;
