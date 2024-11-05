"use client";
import Category from './Category';
import useSWR from 'swr';
import axios from '@/lib/axios';
import styles from '@/assets/styles/CategoryBar.module.css'

// Define the fetcher function outside of the component without async/await
const fetcher = (url) => axios.get(url).then((res) => res.data.data);

const CategoryBar = () => {
  // useSWR will handle data fetching asynchronously
  const { data: categories, error } = useSWR('/api/categories', fetcher);

  if (error) return <div>Failed to load categories</div>;
  if (!categories) return <div>Loading...</div>;

  return (
    <div className={`${styles.categoryBar} ${styles.scrollbarHide} flex overflow-x-auto bg-background py-2 px-2 md:px-4 lg:px-6 space-x-4`}>
      {categories.map((category, index) => (
        <Category
          key={index}
          name={category.name}
          image={category.image}
        />
      ))}
    </div>
  );
};

export default CategoryBar;
