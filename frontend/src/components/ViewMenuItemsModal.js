'use client'
import { useState } from 'react'
import AdminMenuItemCard from './AdminMenuItemCard'
import useSWR, { mutate } from 'swr'
import axios from '@/lib/axios'
import EditMenuItemModal from './EditMenuItemModal'

const Modal = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  )
}

const ViewMenuItemsModal = ({ categoryId, categoryName, onClose }) => {
  const [editingItemId, setEditingItemId] = useState(null)
  const [editingCategoryId, setEditingCategoryId] = useState(null)

  const { data: items, error } = useSWR('/api/menu-items', (url) =>
    axios.get(url).then((res) => res.data.data)
  )

    const handleEdit = ( categoryId, itemId) => {
    setEditingItemId(itemId)
    setEditingCategoryId(categoryId)
  }

  const handleEditComplete = () => {
    setEditingItemId(null)
    setEditingCategoryId(null)
    mutate('/api/menu-items')
  }

  if (error) {
    return (
      <Modal onClose={onClose}>
        <div className="text-red-500">Failed to load items</div>
      </Modal>
    )
  }

  if (!items) {
    return (
      <Modal onClose={onClose}>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </Modal>
    )
  }

  const categoryItems = items.filter((item) => item.category_id === categoryId)

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col h-full">
        <h2 className="text-2xl font-bold text-primary mb-4">
          Menu Items for {categoryName}
        </h2>

        {/* Scrollable area for menu items */}
        <div className="flex-1 overflow-auto px-2">
          {categoryItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No items available in this category.
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {categoryItems.map((item) => (
                <AdminMenuItemCard
                  key={item.id}
                  {...item}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {editingItemId && (
        <EditMenuItemModal
          itemId={editingItemId}
          categoryId={editingCategoryId}
          onClose={() => setEditingItemId(null)}
          onSuccess={handleEditComplete}
        />
      )}
    </Modal>
  )
}

export default ViewMenuItemsModal
