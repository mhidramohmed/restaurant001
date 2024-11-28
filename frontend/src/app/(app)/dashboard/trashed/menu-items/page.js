"use client";

import { useState } from 'react';
// import MainButton from '@/components/MainButton';
import useSWR from 'swr';
import axios from '@/lib/axios';
import AdminMenuItemCard from '@/components/AdminMenuItemCard'; 
import { toast } from 'react-toastify';

const fetcher = (url) =>
  axios
    .get(url, { withCredentials: true }) // Ensure credentials are included
    .then((res) => res.data.data);

const DeletedMenuItems = () => {
  const { data: trashedMenuItems, error, mutate } = useSWR(
    '/menu-items/trashed',
    fetcher
  );

  // const [isRestoring, setIsRestoring] = useState(false);

  if (error) {
    toast.error('Failed to load trashed menu items');
    return <div>Failed to load trashed menu items</div>;
  }

  if (!trashedMenuItems) return <div>Loading...</div>;

  // const handleRestoreSuccess = () => {
  //   toast.success('Menu item restored successfully!');
  //   mutate(); // Refresh the trashed menu items
  // };

  return (
    <div>
      <header className="bg-background pb-4 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Trashed Menu Items</h1>
        </div>
      </header>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 bg-background py-2 px-2 md:px-4 lg:px-6">
        {trashedMenuItems.map((item) => (
          <AdminMenuItemCard
            key={item.id}
            id={item.id}
            name={item.name}
            image={item.image}
            // onRestore={() => {
            //   setIsRestoring(true);
            //   axios
            //     .post(`/menu-items/${item.id}/restore`, {}, { withCredentials: true })
            //     .then(() => handleRestoreSuccess())
            //     .catch(() => toast.error('Failed to restore menu item'))
            //     .finally(() => setIsRestoring(false));
            // }}
          />
        ))}
      </div>
    </div>
  );
};

export default DeletedMenuItems;
