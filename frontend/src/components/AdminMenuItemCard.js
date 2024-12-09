'use client'
import { useState } from 'react'
import MainButton from './MainButton'
import { FiEye, FiEdit } from "react-icons/fi"
import { LuTrash2 } from "react-icons/lu"
import ConfirmDeleteMenuItemModal from './ConfirmDeleteMenuItemModal'

const AdminMenuItemCard = ({ id, category_id, image, name, price, description, onEdit, onDelete }) => {
    const [showDetails, setShowDetails] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const handleDelete = () => {
        setShowDeleteModal(true)
        if (onDelete) {
            onDelete(id)
        }
    }

    return (
        <>
            <div className="h-[400px] border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden bg-white">
                <div className="h-1/2">
                    <img
                        src={image}
                        alt={name}
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
                            onClick={() => onEdit(category_id, id)}
                            className="bg-gray-500 text-white p-2 rounded-full"
                            title="Edit Item"
                        >
                            <FiEdit className="text-xl" />
                        </MainButton>

                        <MainButton
                            onClick={handleDelete}
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
