"use client";
import { useState, useEffect } from "react";
import Category from "./Category";
import useSWR from "swr";
import axios from "@/lib/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useSwiper } from "swiper/react";

const fetcher = (url) => axios.get(url).then((res) => res.data.data);

const CategoryBar = () => {
  const { data: categories, error } = useSWR("/api/categories", fetcher);
  const [activeCategory, setActiveCategory] = useState(null);
  const [swiperInstance, setSwiperInstance] = useState(null); // Store the swiper instance

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = document.querySelectorAll("[id^='category-']");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // Automatically scroll to the active category in Swiper
  useEffect(() => {
    if (swiperInstance && activeCategory && categories) {
      const activeIndex = categories.findIndex(
        (category) => `category-${category.id}` === activeCategory
      );
      if (activeIndex !== -1) {
        swiperInstance.slideTo(activeIndex); // Swipe to the active category
      }
    }
  }, [swiperInstance, activeCategory, categories]);

  if (error) return <div>Failed to load categories</div>;
  if (!categories) return <div>Loading...</div>;

  return (
    <Swiper
      slidesPerView="auto"
      spaceBetween={10}
      breakpoints={{
        320: {
          spaceBetween: 10,
        },
        640: {
          spaceBetween: 20,
        },
        1024: {
          spaceBetween: 30,
        },
      }}
      className="bg-background py-2 md:pl-4 space-x-4 ml-2 md:ml-0"
      data-category-bar
      onSwiper={setSwiperInstance} // Get the swiper instance
    >
      {categories.map((category) => (
        <SwiperSlide
          key={category.id}
          style={{ width: "auto", flexShrink: 0 }}
        >
          <Category
            name={category.name}
            image={category.image}
            categoryId={category.id}
            isActive={activeCategory === `category-${category.id}`}
            setActiveCategory={setActiveCategory}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CategoryBar;
