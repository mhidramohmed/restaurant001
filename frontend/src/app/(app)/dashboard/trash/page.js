"use client"

import { useState } from 'react'
import useSWR from 'swr'
import axios from '@/lib/axios'
import TrashedMenuItemCard from '@/components/TrashedMenuItemCard'
import TrashedCategoryCard from '@/components/TrashedCategoryCard'
import { toast } from 'react-toastify'

const fetcher = (url) =>
  axios
    .get(url, { withCredentials: true }) 
    .then((res) => res.data.data)
    .catch(error => {
      console.error("Error fetching data:", error);
      throw error;
    })

const Page = () => {
  // State to handle selection between menu items and categories
  const [activeSection, setActiveSection] = useState('menu-items')
  
  // Define the correct API path for each section
  const apiEndpoints = {
    'menu-items': '/api/menu-items/trashed',
    'categories': '/api/categories/trashed' 
  }
  
  // Fetch data based on active section
  const { data: trashedItems, error, mutate } = useSWR(
    apiEndpoints[activeSection],
    fetcher
  )

  const [isRestoring, setIsRestoring] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  if (error) {
    toast.error(`Failed to load trashed ${activeSection.replace('-', ' ')}`)
    return <div>Failed to load trashed {activeSection.replace('-', ' ')}</div>
  }

  if (!trashedItems) return <div>Loading...</div>

  const handleRestoreItem = (itemId) => {
    setIsRestoring(true);
    setProcessingId(itemId);
    
    // Different API patterns for menu items vs categories
    const endpoint = activeSection === 'menu-items' 
      ? `/api/menu-items/${itemId}/restore` 
      : `/api/categories/${itemId}/restore`;
    
    axios
      .post(endpoint, {}, { withCredentials: true })
      .then(() => {
        toast.success(`${activeSection === 'menu-items' ? 'Menu item' : 'Category'} restored successfully!`);
        mutate(); 
      })
      .catch(() => toast.error(`Failed to restore ${activeSection === 'menu-items' ? 'menu item' : 'category'}`))
      .finally(() => {
        setIsRestoring(false);
        setProcessingId(null);
      });
  };

  const openDeleteModal = (itemId) => {
    setItemToDelete(itemId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleDeleteItem = () => {
    if (!itemToDelete) return;
    
    setIsDeleting(true);
    setProcessingId(itemToDelete);
    
    // Handle the fact that permanent delete might not be implemented for categories yet
    const endpoint = activeSection === 'menu-items'
      ? `/api/menu-items/${itemToDelete}/force`
      : `/api/categories/${itemToDelete}/force`; 
    
    // For categories, you need to add a permanentlyDeleteCategory method in your CategoryController
    const method = activeSection === 'menu-items' ? 'delete' : 'delete';
    
    axios({
      method: method,
      url: endpoint,
      withCredentials: true
    })
      .then(() => {
        toast.success(`${activeSection === 'menu-items' ? 'Menu item' : 'Category'} permanently deleted!`);
        mutate(); 
        closeDeleteModal();
      })
      .catch(() => toast.error(`Failed to permanently delete ${activeSection === 'menu-items' ? 'menu item' : 'category'}`))
      .finally(() => {
        setIsDeleting(false);
        setProcessingId(null);
      });
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div>
      <header className="bg-background pb-4 px-6">
        <div className="flex justify-between items-center mb-4 gap-4">
          <h1 className="text-2xl font-bold">Trash</h1>

          {/* Navigation Selection */}
<div className="relative w-48">
  <select
    value={activeSection}
    onChange={(e) => handleSectionChange(e.target.value)}
    className="block w-full px-4 py-2 text-sm bg-white border border-primary rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer hover:bg-secondary transition-all duration-200"
  >
    <option
      value="menu-items"
      className="text-text hover:text-primary"
    >
      Menu Items
    </option>
    <option
      value="categories"
      className="text-text hover:text-primary"
    >
      Categories
    </option>
  </select>
</div>
        </div>
        
        

      </header>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h3 className="text-lg font-medium mb-4">Confirm Permanent Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete this {activeSection === 'menu-items' ? 'menu item' : 'category'}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteItem}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center"
                disabled={isDeleting}
              >
                {isDeleting && itemToDelete === processingId ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete Permanently'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {trashedItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No trashed {activeSection === 'menu-items' ? 'menu items' : 'categories'} found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-background py-2 px-2 md:px-4 lg:px-6">
          {activeSection === 'menu-items' ? (
            trashedItems.map((item) => (
              <TrashedMenuItemCard
                key={item.id}
                id={item.id}
                name={item.name}
                image={item.image}
                category={item.category}
                onRestore={() => handleRestoreItem(item.id)}
                onDelete={() => openDeleteModal(item.id)}
                isRestoring={isRestoring}
                isDeleting={isDeleting}
                processingId={processingId}
              />
            ))
          ) : (
            trashedItems.map((category) => (
              <TrashedCategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                image={category.image}
                onRestore={() => handleRestoreItem(category.id)}
                onDelete={() => openDeleteModal(category.id)}
                isRestoring={isRestoring}
                isDeleting={isDeleting}
                processingId={processingId}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Page