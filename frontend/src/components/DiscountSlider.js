import useSWR from "swr"
import axios from "@/lib/axios"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/autoplay"

import MainButton from "./MainButton"
import { LuShoppingCart } from "react-icons/lu"
import { useCart } from "@/contexts/CartContext"

const fetcher = async (url) => {
  const response = await axios.get(url)
  return response.data.data || response.data
}

const DiscountSlider = () => {
  const { data: discounts, error } = useSWR("/api/discount", fetcher)
  const { addItem } = useCart()

  if (error) return <div className="text-red-500">Échec du chargement des réductions</div>

  if (!discounts) {
    return (
      <div className="my-8 px-2 md:px-4 lg:px-6">
        <h2 className="text-2xl font-bold text-primary mb-4">Offres Spéciales</h2>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="w-full h-40 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  const activeDiscounts = discounts.filter(discount => discount.is_active)
  if (!activeDiscounts.length) return null

  return (
    <div className="my-8 px-2 md:px-4 lg:px-6">
      <h2 className="text-2xl font-bold text-primary mb-4">Offres Spéciales</h2>

      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 16 },
          1024: { slidesPerView: 3, spaceBetween: 20 }
        }}
        loop={true}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        className="h-52"
      >
        {activeDiscounts.map((discount) => {
          const discountedPrice = (discount.menu_item.price * (1 - discount.discount_percentage / 100)).toFixed(2)
          
          const handleAddToCart = () => {
            addItem({
              id: discount.menu_item.id,
              name: discount.menu_item.name,
              price: discountedPrice,
              originalPrice: discount.menu_item.price,
              image: discount.menu_item.image,
              discount
            })
          }

          return (
            <SwiperSlide key={discount.id}>
              <div 
                className="relative h-52 w-full rounded-lg overflow-hidden bg-gray-300 shadow-md p-4 flex flex-col justify-end"
                style={{
                    backgroundImage: discount.image 
                    ? `url(${discount.image})`
                    : (discount.menu_item ? `url(${discount.menu_item.image})` : 'none'),
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
              >
                {/* Discount badge */}
                <div className="absolute top-2 left-2 bg-primary text-white font-semibold px-3 py-2 rounded-md text-sm shadow-md">
                  -{discount.discount_percentage}%
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent"></div>

                {/* Text content */}
                <div className="relative text-left text-white">
                  <p className="text-lg font-semibold">
                    {discount.menu_item ? discount.menu_item.name : 'Offre Spéciale'}
                  </p>

                  {/* Price & Button side by side */}
                  <div className="flex justify-between items-center mt-2">
                    {discount.menu_item?.price && (
                      <p className="text-yellow-400 text-lg font-bold">{discountedPrice} Dhs</p>
                    )}
                    <MainButton onClick={handleAddToCart} className="bg-primary text-white flex items-center">
                      <LuShoppingCart />
                    </MainButton>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

export default DiscountSlider