'use client';

import useSWR from 'swr';
import axios from '@/lib/axios';
import { toast } from 'react-toastify';
import MainButton from '@/components/MainButton';
import { useState } from 'react';

const fetcher = async (url) => {
  try {
    const response = await axios.get(url, { withCredentials: true });
    console.log('Response from API:', response.data);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Fetch Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};


const DeletedItemsPage = () => {
  const { data: deletedCategories, error: categoryError, mutate: mutateCategories } = useSWR('/categories/trash', fetcher);
  const { data: deletedMenuItems, error: menuError, mutate: mutateMenuItems } = useSWR('/menu-items/trash', fetcher);

  const handleRestore = async (type, id) => {
    try {
      const endpoint = type === 'category' ? `/categories/${id}` : `/menu-items/${id}`;
      await axios.post(endpoint, {}, { withCredentials: true });
      toast.success(`${type === 'category' ? 'Category' : 'Menu Item'} restored successfully!`);
      if (type === 'category') mutateCategories();
      if (type === 'menuItem') mutateMenuItems();
    } catch (error) {
      toast.error(`Failed to restore ${type === 'category' ? 'Category' : 'Menu Item'}`);
    }
  };

  if (categoryError || menuError) {
    return <div className="p-6 text-red-600">Error loading data.</div>;
  }

  if (!deletedCategories || !deletedMenuItems) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Deleted Categories and Menu Items</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Deleted Categories</h2>
        {deletedCategories.length > 0 ? (
          <ul className="space-y-4">
            {deletedCategories.map((category) => (
              <li key={category.id} className="flex items-center justify-between p-4 border rounded">
                <div>
                  <p className="font-medium">{category.name}</p>
                </div>
                <MainButton onClick={() => handleRestore('category', category.id)}>Restore</MainButton>
              </li>
            ))}
          </ul>
        ) : (
          <p>No deleted categories available.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Deleted Menu Items</h2>
        {deletedMenuItems.length > 0 ? (
          <ul className="space-y-4">
            {deletedMenuItems.map((menuItem) => (
              <li key={menuItem.id} className="flex items-center justify-between p-4 border rounded">
                <div>
                  <p className="font-medium">{menuItem.name}</p>
                </div>
                <MainButton onClick={() => handleRestore('menuItem', menuItem.id)}>Restore</MainButton>
              </li>
            ))}
          </ul>
        ) : (
          <p>No deleted menu items available.</p>
        )}
      </section>
    </div>
  );
};

export default DeletedItemsPage;
