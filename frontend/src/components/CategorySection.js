'use client';
import Card from './Card';
import useSWR from 'swr';
import axios from '@/lib/axios';

// Define the fetcher function outside of the component without async/await
const fetcher = (url) => axios.get(url).then((res) => res.data.data);


const CategorySection = ({ categoryName, categoryId }) => {
    // useSWR will handle data fetching asynchronously
    const { data: items, error } = useSWR('/api/menu-items', fetcher);

    if (error) return <div>Failed to load items</div>;
    if (!items) return <div>Loading...</div>;
  
    // Filter items based on categoryId
    const categoryItems = items.filter(item => item.category_id === categoryId);

  return (
    <section className="my-8 px-2 md:px-4 lg:px-6">
      <h2 className="text-3xl font-bold text-primary mb-4">
        {categoryName}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categoryItems.map((item) => (
          <Card
            key={item.id}
            id={item.id}
            image={item.image}
            name={item.name}
            price={item.price}
            onAddToCart={() => console.log(`Added ${item.title} to cart`)}
            onDetails={() => console.log(`Details for ${item.title}`)}
          />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
