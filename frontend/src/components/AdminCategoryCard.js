'use client'
import { LuTrash2 } from "react-icons/lu"
import { HiOutlinePlusSm } from "react-icons/hi"
import { FaList } from "react-icons/fa"
import { FiEdit } from "react-icons/fi"
import { useState } from 'react'
import MainButton from './MainButton'
import AddMenuItemModal from './AddMenuItemModal'
import ViewMenuItemsModal from './ViewMenuItemsModal'
import ConfirmDeleteModal from './ConfirmDeleteModal'
import EditCategoryModal from './EditCategoryModal'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const AdminCategoryCard = ({ id, name, image, isReordering }) => {
  const [showAddMenuModal, setShowAddMenuModal] = useState(false)
  const [showViewMenuModal, setShowViewMenuModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isReordering ? 'grab' : 'default',
    zIndex: isDragging ? 100 : 'auto',
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...(isReordering ? listeners : {})}
        className={`flex flex-col items-center space-y-4 py-6 px-2 border border-primary rounded-lg shadow-lg bg-white transition-transform transform hover:scale-105 ${isReordering ? 'cursor-grab active:cursor-grabbing' : ''}`}
      >
        <div className="w-20 h-20 rounded-full overflow-hidden border border-secondary">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = 'https://placehold.co/600x400/orange/white'
            }}
          />
        </div>

        <h3 className="text-lg font-semibold text-text text-center">{name}</h3>

        {!isReordering && (
          <div className="flex flex-wrap justify-center w-full gap-2">
            <MainButton
              onClick={() => setShowAddMenuModal(true)}
              className="bg-primary text-white p-2 rounded-full shadow hover:bg-primary/90 transition-colors min-w-[40px]"
              title="Add Menu Item"
            >
              <HiOutlinePlusSm className="text-xl" />
            </MainButton>

            <MainButton
              onClick={() => setShowViewMenuModal(true)}
              className="bg-secondary text-white p-2 rounded-full shadow hover:bg-secondary/90 transition-colors min-w-[40px]"
              title="View Menu Items"
            >
              <FaList className="text-xl" />
            </MainButton>

            <MainButton
              onClick={() => setShowEditModal(true)}
              className="bg-gray-500 text-white p-2 rounded-full shadow hover:bg-gray-600 transition-colors min-w-[40px]"
              title="Edit Category"
            >
              <FiEdit className="text-xl" />
            </MainButton>

            <MainButton
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 transition-colors min-w-[40px]"
              title="Delete Category"
            >
              <LuTrash2 className="text-xl" />
            </MainButton>
          </div>
        )}
      </div>

      {showAddMenuModal && (
        <AddMenuItemModal
          categoryId={id}
          categoryName={name}
          onClose={() => setShowAddMenuModal(false)}
        />
      )}
      {showViewMenuModal && (
        <ViewMenuItemsModal
          categoryId={id}
          categoryName={name}
          onClose={() => setShowViewMenuModal(false)}
        />
      )}
      {showDeleteModal && (
        <ConfirmDeleteModal
          categoryId={id}
          categoryName={name}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
      {showEditModal && (
        <EditCategoryModal
          categoryId={id}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  )
}

export default AdminCategoryCard