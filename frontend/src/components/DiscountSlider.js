import { useState, useEffect } from "react"
import useSWR from "swr"
import axios from "@/lib/axios"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/autoplay"

import Card from "./Card"
import { useMediaQuery } from "@/hooks/use-media-query"
import { LuX } from "react-icons/lu"

const fetcher = async (url) => {
  const response = await axios.get(url)
  return response.data.data || response.data
}

const DiscountSlider = () => {
  const { data: discounts, error } = useSWR("/api/discount", fetcher)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [selectedDiscount, setSelectedDiscount] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isModalOpen])

  const handleDiscountClick = (discount) => {
    setSelectedDiscount(discount)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  

  if (error) return <div className="text-red-500">Échec du chargement des réductions</div>

  if (!discounts) {
    return (
      <div className="my-8 px-2 md:px-4 lg:px-6">
        <h2 className="text-2xl font-bold text-primary mb-4">Offres Spéciales</h2>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(isDesktop ? 2 : 3)].map((_, index) => (
            <div key={index} className="w-full h-40 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  // Filter out discounts that are inactive or have no menu items
  const validDiscounts = discounts.filter(discount => 
    discount.is_active && discount.menuItems && discount.menuItems.length > 0
  )

  if (!validDiscounts.length) return null

  return (
    <div className="my-8 px-2 md:px-4 lg:px-6">
      <h2 className="text-2xl font-bold text-primary mb-4">Offres Spéciales</h2>

      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: isDesktop ? 2 : 2, spaceBetween: 16 },
          1024: { slidesPerView: isDesktop ? 2 : 3, spaceBetween: 20 }
        }}
        loop={true}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        className="h-52"
      >
        {validDiscounts.map((discount) => (
          <SwiperSlide key={discount.id}>
            <div 
              className="relative h-52 w-full rounded-lg overflow-hidden bg-gray-300 shadow-md p-4 flex flex-col justify-end cursor-pointer"
              style={{
                backgroundImage: discount.image ? `url(${discount.image})` : 
                  (discount.menuItems && discount.menuItems[0] ? `url(${discount.menuItems[0].image})` : null),
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              onClick={() => handleDiscountClick(discount)}
            >
              {/* Discount badge */}
              <div className="absolute top-2 left-2 bg-primary text-white font-semibold px-3 py-2 rounded-md text-sm shadow-md">
                -{discount.discount_percentage}%
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent"></div>

              {/* Text content */}
              <div className="relative text-left text-white">
                <p className="text-lg font-semibold">{discount.name || "Offre Spéciale"}</p>
                <p className="text-sm opacity-90">{discount.description || `${discount.discount_percentage}% de réduction`}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Modal for showing menu items of the selected discount */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50" 
            onClick={closeModal}
          ></div>
          
          {/* Modal content */}
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold text-primary">
                {selectedDiscount?.name || "Offre Spéciale"}
              </h3>
              <button 
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <LuX size={24} />
              </button>
            </div>
            
            {/* Body with scroll */}
            <div className="flex-1 overflow-y-auto p-4">
              {selectedDiscount && (
                <>
                  <div className="mb-4">
                    <span className="inline-block bg-primary text-white font-semibold px-3 py-1 rounded-md text-sm mb-2">
                      -{selectedDiscount.discount_percentage}%
                    </span>
                    <p className="text-gray-700">{selectedDiscount.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedDiscount.menuItems.map((item) => {
                      const discountedPrice = (item.price * (1 - selectedDiscount.discount_percentage / 100)).toFixed(2)
                      const itemWithDiscount = {
                        ...item,
                        discount: {
                          discount_percentage: selectedDiscount.discount_percentage,
                          discounted_price: discountedPrice, // Keep this if your Card also uses it somewhere
                          new_price: parseFloat(discountedPrice), // Add this property that Card expects
                          expires_at: selectedDiscount.expires_at || null, // Pass if available
                          is_active: selectedDiscount.is_active || true // Pass if available, default to true
                        }
                      }
                      
                      return (
                        <Card
                          key={item.id}
                          id={item.id}
                          image={item.image}
                          name={item.name}
                          price={item.price}
                          discount={itemWithDiscount.discount}
                        />
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DiscountSlider