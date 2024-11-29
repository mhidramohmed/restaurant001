'use client';
import { LuTrash2 } from "react-icons/lu";
import { HiOutlinePlusSm } from "react-icons/hi";
import { FaList } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { useState } from 'react';
import MainButton from './MainButton';
import AddMenuItemModal from './AddMenuItemModal';
import ViewMenuItemsModal from './ViewMenuItemsModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import EditCategoryModal from './EditCategoryModal';

const AdminCategoryCard = ({ id, name, image }) => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [showViewMenuModal, setShowViewMenuModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const imageUrl = image?.startsWith('http')
    ? image
    : image.includes('CategoriesImages')
        ? `${baseURL}/${image.replace(/^\/+/, '')}`
        : `${baseURL}/CategoriesImages/${image.replace(/^\/+/, '')}`;


  return (
    <>
      <div className="flex flex-col items-center space-y-4 py-6 px-2 border border-primary rounded-lg shadow-lg bg-white transition-transform transform hover:scale-105">
        <div className="w-20 h-20 rounded-full overflow-hidden border border-secondary">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/600x400/orange/white';
            }}
          />
        </div>

        <h3 className="text-lg font-semibold text-text text-center">{name}</h3>

        <div className="flex justify-evenly w-full gap-2">
          <MainButton
            onClick={() => setShowAddMenuModal(true)}
            className="bg-primary text-white p-2 rounded-full shadow hover:bg-primary/90 transition-colors"
            title="Add Menu Item"
          >
            <HiOutlinePlusSm className="text-xl" />
          </MainButton>

          <MainButton
            onClick={() => setShowViewMenuModal(true)}
            className="bg-secondary text-white p-2 rounded-full shadow hover:bg-secondary/90 transition-colors"
            title="View Menu Items"
          >
            <FaList className="text-xl" />
          </MainButton>

          <MainButton
            onClick={() => setShowEditModal(true)}
            className="bg-gray-500 text-white p-2 rounded-full shadow hover:bg-gray-600 transition-colors"
            title="Edit Category"
          >
            <FiEdit className="text-xl" />
          </MainButton>

          <MainButton
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 transition-colors"
            title="Delete Category"
          >
            <LuTrash2 className="text-xl" />
          </MainButton>
        </div>
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
  );
};

export default AdminCategoryCard;