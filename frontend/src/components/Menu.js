"use client";
import CategorySection from "./CategorySection"
import useSWR from 'swr';
import axios from '@/lib/axios';

// Define the fetcher function outside of the component without async/await
const fetcher = (url) => axios.get(url).then((res) => res.data.data);

export default function Menu() {
  // useSWR will handle data fetching asynchronously
  const { data: categories, error } = useSWR('/api/categories', fetcher);

  if (error) return <div>Failed to load categories</div>;
  if (!categories) return <div>Loading...</div>;
  
  return (
    <div>
      {categories.map((category, index) => (
        <CategorySection categoryName={category.name} categoryId={category.id} />
      ))}
    </div>
  )
}
