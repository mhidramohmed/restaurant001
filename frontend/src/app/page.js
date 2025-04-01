'use client'
import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import Header from '@/components/Header'
import CategoryBar from '@/components/CategoryBar'
import ShoppingCart from '@/components/ShoppingCart'
import Menu from '@/components/Menu'
import MainButton from '@/components/MainButton'
import Footer from '@/components/Footer'
import { LuShoppingCart } from "react-icons/lu"



import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import DiscountSlider from '@/components/DiscountSlider'



const Home = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { items, getTotal, } = useCart()
  const [isCartVisible, setIsCartVisible] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Main Content */}
      <main className="flex-grow w-full sm:w-3/4 bg-background">
        <Header setSearchTerm={setSearchTerm} />
        <div className="sticky top-0 z-20 bg-background shadow-md py-4 pl-2 md:px-4">
          <CategoryBar />
        </div>
        <Suspense fallback={null}>
          <HandleSearchParams />
        </Suspense>
        <DiscountSlider />
        <Menu searchTerm={searchTerm} />
        <Footer />
      </main>

      {/* Shopping Cart */}
      <aside
        className={`fixed right-0 top-0 w-full sm:w-1/4 h-full p-4 bg-background shadow-xl overflow-y-auto z-20 transition-all duration-300 ${
          isCartVisible ? 'block' : 'hidden sm:block'
        }`}
      >
        <ShoppingCart isCartVisible={isCartVisible} setIsCartVisible={setIsCartVisible} />
      </aside>

      {/* Floating Cart Button */}
      <MainButton
        className={`fixed bottom-4 left-1/2 w-4/5 z-10 sm:hidden p-4 bg-primary text-background ${
          isCartVisible ? 'hidden' : 'block md:hidden'
        } transform -translate-x-1/2`}
        onClick={() => setIsCartVisible(!isCartVisible)}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="bg-background text-primary px-4 py-4 rounded-lg">
            <LuShoppingCart />
          </div>
          <div className="flex flex-col items-start">
            <h2 className="text-xl font-bold">PANIER</h2>
            <p>{getTotal()} Dhs</p>
          </div>
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-light text-background text-xl font-bold">
            {items.length}
          </span>
        </div>
      </MainButton>
    </div>
  )
}
//codewithchakir

const HandleSearchParams = () => {
  const { clearCart } = useCart()
  const searchParams = useSearchParams()
  const router = useRouter()
  const message = searchParams.get('message')

  useEffect(() => {
    if (!message) return

    // Show toast notification
    const decodedMessage = decodeURIComponent(message)

    if (decodedMessage === 'Payment Fail') {
      toast.error(decodedMessage)
    } else if (decodedMessage === 'Payment Success') {
      toast.success(decodedMessage)
      clearCart()
    }

    // Remove the message param from URL *without causing a re-render loop*
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete('message')

    router.replace(`?${newParams.toString()}`, { scroll: false }, { shallow: true })

  }, [message]) // Only trigger effect when message changes

  return null
}

export default Home
