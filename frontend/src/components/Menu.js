import CategorySection from "./CategorySection";
import useSWR from 'swr';
import axios from '@/lib/axios';

const fetcher = (url) => axios.get(url).then((res) => res.data.data);

export default function Menu({ searchTerm }) {
  const { data: categories, error } = useSWR('/api/categories', fetcher);

  if (error) return <div>Failed to load categories</div>;
  if (!categories) return <div>Loading...</div>;

  return (
    <div>
      {categories.map((category) => (
        <CategorySection
          key={category.id}
          categoryName={category.name}
          categoryId={category.id}
          searchTerm={searchTerm}
        />
      ))}
    </div>
  );
}
