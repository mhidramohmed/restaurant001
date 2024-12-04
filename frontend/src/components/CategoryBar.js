"use client"
import { useState, useEffect } from "react"
import Category from "./Category"
import useSWR from "swr"
import axios from "@/lib/axios"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import SkeletonCategory from "./skeleton/SkeletonCategory"
import '@/app/global.css'

const fetcher = (url) => axios.get(url).then((res) => res.data.data)

const CategoryBar = () => {
  const { data: categories, error } = useSWR("/api/categories", fetcher)
  const [activeCategory, setActiveCategory] = useState(null)
  const [swiperInstance, setSwiperInstance] = useState(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id)
          }
        })
      },
      { threshold: 0.5 }
    )

    const sections = document.querySelectorAll("[id^='category-']")
    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [])

  useEffect(() => {
    if (swiperInstance && activeCategory && categories) {
      const activeIndex = categories.findIndex(
        (category) => `category-${category.id}` === activeCategory
      )
      if (activeIndex !== -1) {
        swiperInstance.slideTo(activeIndex)
      }
    }
  }, [swiperInstance, activeCategory, categories])

  if (error) return <div>Failed to load categories</div>

  return (
    <Swiper
      slidesPerView="auto"
      spaceBetween={10}
      breakpoints={{
        320: { spaceBetween: 10 },
        640: { spaceBetween: 20 },
        1024: { spaceBetween: 30 },
      }}
      className="bg-background py-2 md:pl-4 space-x-4 ml-2 md:ml-0"
      data-category-bar
      onSwiper={setSwiperInstance}
    >
      {!categories
        ? Array(5).fill(null).map((_, index) => (
          <SwiperSlide
            key={`skeleton-${index}`}
            className="skeleton-category-slide"
            style={{ width: "auto", flexShrink: 0 }}
          >
            <SkeletonCategory />
          </SwiperSlide>
          ))
        : categories.map((category) => (
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
  )
}

export default CategoryBar