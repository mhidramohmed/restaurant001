import { useState } from "react";
import Card from "./Card";
import SkeletonCard from "./skeleton/SkeletonCard";
import MenuItemModal from "./MenuItemModal";
import useSWR from "swr";
import axios from "@/lib/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const fetcher = (url) => axios.get(url).then((res) => res.data.data);

const CategorySection = ({ categoryName, categoryId, searchTerm }) => {
  const { data: items, error } = useSWR("/api/menu-items", fetcher);
  const [selectedItem, setSelectedItem] = useState(null);

  if (error) return <div>Failed to load items</div>;

  if (!items) {
    return (
      <section
        id={`category-${categoryId}`}
        className="my-8 px-2 md:px-4 lg:px-6"
      >
        {/* Category title skeleton */}
        <div className="h-8 bg-gray-300 rounded w-1/3 md:w-1/6 mb-4"></div>

        {/* Mobile View Skeleton */}
        <div className="block md:hidden">
          <Swiper
            breakpoints={{
              0: {
                slidesPerView: 1.5,
                spaceBetween: 10,
                allowTouchMove: false,
              },
              720: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
            }}
            className="swiper-container"
          >
            {Array(4).fill(null).map((_, index) => (
              <SwiperSlide key={`skeleton-${index}`} className="pt-2 pb-6">
                <SkeletonCard />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop View Skeleton */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(null).map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
          ))}
        </div>
      </section>
    );
  }

  const categoryItems = items
    .filter((item) => item.category_id === categoryId)
    .filter((item) => item.name.toLowerCase().startsWith(searchTerm));

  if (!categoryItems.length) return null;

  const handleCardClick = (item) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <section
      id={`category-${categoryId}`}
      className="my-8 px-2 md:px-4 lg:px-6"
    >
      <h2 className="text-3xl font-bold text-primary mb-4">{categoryName}</h2>

      {/* Mobile View */}
      <div className="block md:hidden">
        <Swiper
          breakpoints={{
            0: {
              slidesPerView: 1.5,
              spaceBetween: 10,
              allowTouchMove: false,
            },
            720: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
          }}
          className="swiper-container"
        >
          {categoryItems.map((item) => (
            <SwiperSlide key={item.id} className="pt-2 pb-6">
              <Card
                id={item.id}
                image={item.image}
                name={item.name}
                price={item.price}
                onDetails={() => handleCardClick(item)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop View */}
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categoryItems.map((item) => (
          <Card
            key={item.id}
            id={item.id}
            image={item.image}
            name={item.name}
            price={item.price}
            onDetails={() => handleCardClick(item)}
          />
        ))}
      </div>

      {selectedItem && <MenuItemModal item={selectedItem} onClose={closeModal} />}
    </section>
  );
};

export default CategorySection;