"use client";
import { useState } from 'react';
import MainButton from '@/components/MainButton';
import useSWR from 'swr';
import axios from '@/lib/axios';
import AdminCategoryCard from '@/components/AdminCategoryCard';
import AddCategoryModal from '@/components/addCategoryModal';
import { toast } from 'react-toastify';

const fetcher = (url) => axios.get(url).then((res) => res.data.data);

const CategoryBar = () => {
  const { data: categories, error, mutate } = useSWR('/api/categories', fetcher);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  if (error) {
    toast.error('Failed to load categories');
    return <div>Failed to load categories</div>;
  }
  
  if (!categories) return <div>Loading...</div>;

  const handleCategoryAddSuccess = () => {
    // toast.success('Category added successfully!');
    setShowAddCategoryModal(false);
    mutate(); // Refresh categories
  };

  return (
    <div>
      <header className="bg-background pb-4 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Categories</h1>
          <MainButton
            className="bg-primary text-background border-2 border-primary hover:bg-opacity-90 transition"
            onClick={() => setShowAddCategoryModal(true)}
          >
            Add New Category
          </MainButton>
        </div>
      </header>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 bg-background py-2 px-2 md:px-4 lg:px-6">
        {categories.map((category) => (
          <AdminCategoryCard
            key={category.id}
            id={category.id}
            name={category.name}
            image={category.image}
          />
        ))}
      </div>
      {showAddCategoryModal && (
        <AddCategoryModal
          onClose={() => setShowAddCategoryModal(false)}
          onSuccess={handleCategoryAddSuccess}
        />
      )}
    </div>
  );
};

export default CategoryBar;