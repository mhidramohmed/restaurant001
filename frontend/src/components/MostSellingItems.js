'use client';
import { useState } from 'react';
import axios from '@/lib/axios';
import useSWR from 'swr';
import { LuShoppingCart } from 'react-icons/lu'; // You can choose the icon you want
import MainButton from './MainButton';

// Axios fetcher function
const fetcher = async (url) => {
    try {
      const response = await axios.get(url, { withCredentials: true });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Fetch Error:', error);
      throw error;
    }
  };

const MostSellingItems = () => {
    const { data: data, error, isLoading } = useSWR('/api/order-elements', fetcher);

  if (error) return <div>Error loading items</div>;

  if (!data || isLoading) {
    return <div>Loading...</div>;
  }

  // Aggregate quantities by menu_item_id
  const itemSales = {};
  data.forEach((element) => {
    const { menu_item_id, quantity, menu_item } = element;
    if (!itemSales[menu_item_id]) {
      itemSales[menu_item_id] = { ...menu_item, totalQuantity: 0 };
    }
    itemSales[menu_item_id].totalQuantity += quantity;
  });

  // Sort items by total quantity sold
  const sortedItems = Object.values(itemSales).sort((a, b) => b.totalQuantity - a.totalQuantity);

  // Limit to 5 items
  const limitedItems = sortedItems.slice(0, 5);

  return (
    <div className="flex flex-col w-1/3 bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text">Most Selling Items</h2>
      </div>

      <div className="flex-1 overflow-y-auto mt-4">
        {limitedItems.length === 0 ? (
          <p className="text-center text-text">No sales data available.</p>
        ) : (
          <ul className="w-full space-y-4">
            {limitedItems.map((item) => (
              <li key={item.id} className="border-t pt-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-text">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-text">Sold: {item.totalQuantity}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MostSellingItems;