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
  const { data: allCategories, error } = useSWR("/api/categories", fetcher)
  const [activeCategory, setActiveCategory] = useState(null)
  const [swiperInstance, setSwiperInstance] = useState(null)

  // Filter categories to only show those with menu items
  const categories = allCategories?.filter(category => 
    category.menu_items && category.menu_items.length > 0
  )

  useEffect(() => {
    if (!categories) return

    const SCROLL_OFFSET = 125
    const VIEWPORT_PERCENTAGE = 0.3  // Adjustable percentage from top

    const handleScroll = () => {
      // Get all category sections
      const sections = document.querySelectorAll("[id^='category-']")
      
      // Calculate the reference point in the viewport
      const viewportReferencePoint = window.innerHeight * VIEWPORT_PERCENTAGE + SCROLL_OFFSET

      // Find the section that is most centered around the reference point
      let mostCenteredSection = null
      let minDistance = Infinity

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        const sectionTop = rect.top + window.scrollY
        const sectionMiddle = sectionTop + rect.height / 2

        // Calculate distance from the reference point
        const distance = Math.abs(sectionMiddle - (window.scrollY + viewportReferencePoint))

        if (distance < minDistance) {
          minDistance = distance
          mostCenteredSection = section
        }
      })

      // Update active category if a section is found
      if (mostCenteredSection) {
        const newActiveCategory = mostCenteredSection.id
        if (newActiveCategory !== activeCategory) {
          setActiveCategory(newActiveCategory)
        }
      }
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll)
    
    // Initial call to set the first category
    handleScroll()

    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [categories, activeCategory])

  useEffect(() => {
    if (swiperInstance && activeCategory && categories) {
      const activeIndex = categories.findIndex(
        (category) => `category-${category.id}` === activeCategory
      )
      if (activeIndex !== -1) {
        swiperInstance.slideTo(activeIndex, 300, false)
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