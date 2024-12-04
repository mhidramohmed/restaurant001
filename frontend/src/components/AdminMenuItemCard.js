'use client'
import { useState } from 'react'
import MainButton from './MainButton'
import { FiEye, FiEdit } from "react-icons/fi"
import { LuTrash2 } from "react-icons/lu"
import ConfirmDeleteMenuItemModal from './ConfirmDeleteMenuItemModal'
import Image from 'next/image'

const AdminMenuItemCard = ({ id, image, name, price, description, onEdit }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
  const imageUrl = image?.startsWith('http')
    ? image
    : `${baseURL}/${image.replace(/^\/+/, '')}`

  return (
    <>
      <div className="h-[400px] border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden bg-white">
        <div className="h-1/2">
          <Image
            src={imageUrl}
            alt={name}
            width={300}
            height={300}
            className="w-full h-full object-cover rounded-t-lg"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = 'https://placehold.co/600x400/orange/white'
            }}
          />
        </div>
        
        <div className="h-1/2 p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text mb-1">{name}</h3>
            {showDetails && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {description || 'No description available'}
              </p>
            )}
            <p className="text-primary font-medium">{price} Dhs</p>
          </div>

          <div className="flex items-center justify-end space-x-2 mt-4">
            <MainButton
              onClick={() => setShowDetails(!showDetails)}
              className="bg-secondary text-white p-2 rounded-full"
              title={showDetails ? "Hide Details" : "Show Details"}
            >
              <FiEye className="text-xl" />
            </MainButton>

            <MainButton
              onClick={() => onEdit(id)}
              className="bg-gray-500 text-white p-2 rounded-full"
              title="Edit Item"
            >
              <FiEdit className="text-xl" />
            </MainButton>

            <MainButton
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
              title="Delete Item"
            >
              <LuTrash2 className="text-xl" />
            </MainButton>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <ConfirmDeleteMenuItemModal
          itemId={id}
          itemName={name}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </>
  )
}

export default AdminMenuItemCard