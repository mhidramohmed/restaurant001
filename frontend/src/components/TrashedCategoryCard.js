import React from 'react'
import { FiRefreshCcw, FiTrash2 } from "react-icons/fi";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import MainButton from './MainButton'

const TrashedCategoryCard = ({
  id,
  name,
  image,
  onRestore,
  onDelete,
  isRestoring,
  isDeleting,
  processingId
}) => {
  return (
    <div className="flex flex-col items-center space-y-4 py-6 px-2 border border-primary rounded-lg shadow-lg bg-white transition-transform transform hover:scale-105">
        <div className="w-20 h-20 rounded-full overflow-hidden border border-secondary">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = 'https://placehold.co/600x400/orange/white'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold text-text text-center">{name}</h3>

      <div className="flex flex-wrap justify-center w-full gap-2">
        <MainButton
          onClick={onRestore}
          disabled={isRestoring && id === processingId}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-2 px-3 rounded-lg hover:bg-secondary hover:text-primary disabled:bg-gray-400 transition-all"
          title="Restore Category"
        >
          {isRestoring && id === processingId ? (
            <PiDotsThreeOutlineFill />
          ) : (
            <FiRefreshCcw />
          )}
        </MainButton>

        <MainButton
          onClick={onDelete}
          disabled={(isDeleting || isRestoring) && id === processingId}
          className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-all"
          title="Delete Permanently"
        >
          <FiTrash2 />
        </MainButton>
      </div>
    </div>
  )
}

export default TrashedCategoryCard
