'use client';
import { useState } from 'react';
import Card from './Card'; // Assuming you have the Card component
import useSWR from 'swr';
import axios from '@/lib/axios';

// Define the fetcher function outside of the component without async/await
const fetcher = (url) => axios.get(url).then((res) => res.data.data);

const Modal = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const ViewMenuItemsModal = ({ categoryId, categoryName, onClose }) => {
  // Fetch menu items using SWR
  const { data: items, error } = useSWR('/api/menu-items', fetcher);

  if (error) return <div>Failed to load items</div>;
  if (!items) return <div>Loading...</div>;

  // Filter items based on categoryId
  const categoryItems = items.filter(item => item.category_id === categoryId);

  return (
    <Modal onClose={onClose}>
      <h2 className="text-3xl font-bold text-primary mb-4">
        Menu Items for {categoryName}
      </h2>
      
      {/* Scrollable container for items */}
      <div className="max-h-96 overflow-auto">
        {/* Grid layout for items */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryItems.length === 0 ? (
            <p className="text-center text-text">No items available in this category.</p>
          ) : (
            categoryItems.map((item) => (
              <Card
                key={item.id}
                id={item.id}
                image={item.image}
                name={item.name}
                price={item.price}
                onAddToCart={() => console.log(`Added ${item.name} to cart`)}
                onDetails={() => console.log(`Details for ${item.name}`)}
              />
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ViewMenuItemsModal;
