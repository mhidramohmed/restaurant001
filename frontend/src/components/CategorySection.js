import { useState } from 'react';
import Card from './Card';
import MenuItemModal from './MenuItemModal';
import useSWR from 'swr';
import axios from '@/lib/axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const fetcher = (url) => axios.get(url).then((res) => res.data.data);

const CategorySection = ({ categoryName, categoryId, searchTerm }) => {
  const { data: items, error } = useSWR('/api/menu-items', fetcher);
  const [selectedItem, setSelectedItem] = useState(null);
  
  if (error) return <div>Failed to load items</div>;
  if (!items) return <div>Loading...</div>;
  
  const categoryItems = items
    .filter(item => item.category_id === categoryId)
    .filter(item => item.name.toLowerCase().startsWith(searchTerm));
  
  if (!categoryItems.length) return null;

  const handleCardClick = (item) => {
    setSelectedItem(item); // Set the selected item to open the modal
  };

  const closeModal = () => {
    setSelectedItem(null); // Close the modal by clearing the selected item
  };
  
  
  return (
    <section id={`category-${categoryId}`} className="my-8 px-2 md:px-4 lg:px-6">
      <h2 className="text-3xl font-bold text-primary mb-4">
        {categoryName}
      </h2>
      <div className="block md:hidden">
      <Swiper
        breakpoints={{
          0: {
            slidesPerView: 1.5,
            spaceBetween: 10,
          },
          720: {
            slidesPerView: 3,
            spaceBetween:20,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
      >
        {categoryItems.map((item) => (
          <SwiperSlide key={item.id} className='pt-2 pb-6'>
            <Card
              id={item.id}
              image={item.image}
              name={item.name}
              price={item.price}
              onAddToCart={() => console.log(`Added ${item.name} to cart`)}
              onDetails={() => handleCardClick(item)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      </div>
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {categoryItems.map((item) => (
            <Card
              id={item.id}
              image={item.image}
              name={item.name}
              price={item.price}
              onAddToCart={() => console.log(`Added ${item.name} to cart`)}
              onDetails={() => handleCardClick(item)}
            />
        ))}
      </div>
      {selectedItem && (
        <MenuItemModal item={selectedItem} onClose={closeModal} /> // Display modal when an item is selected
      )}
    </section>
  );
};

export default CategorySection;