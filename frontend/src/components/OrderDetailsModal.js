import React, { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import TimeAgo from 'timeago-react'
import placeholder from '@/assets/svg/placeholder.svg'
import { useMediaQuery } from "@/hooks/use-media-query"

const OrderDetailsModal = ({ order, onClose, mutate, open = true }) => {
  const [orderStatus, setOrderStatus] = useState(order.order_status)
  const [paymentStatus, setPaymentStatus] = useState(order.payment_status)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  // Handle escape key and prevent body scroll
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') onClose()
    }

    if (open) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEscKey)
    }

    return () => {
      document.body.style.overflow = 'auto'
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [open, onClose])

  if (!open) return null

  const handleSaveChanges = async () => {
    await axios.patch(
      `/api/orders/${order.id}`,
      {
        order_status: orderStatus,
        payment_status: paymentStatus,
      },
      {
        withCredentials: true,
      }
    )
    mutate()
    onClose()
  }

  if (!order.order_elements) return <div>Loading...</div>

  const getStatusClass = (currentStatus, status) =>
    currentStatus === status
      ? 'bg-opacity-100 text-white'
      : 'bg-opacity-0 text-gray-600 border'

  const getBgColorClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 border-yellow-500'
      case 'inprocess':
        return 'bg-blue-500 border-blue-500'
      case 'delivered':
        return 'bg-green-500 border-green-500'
      case 'declined':
        return 'bg-red-500 border-red-500'
      case 'paid':
        return 'bg-green-500 border-green-500'
      case 'unpaid':
        return 'bg-red-500 border-red-500'
      default:
        return 'bg-gray-500 border-gray-500'
    }
  }

  const sendWhatsAppMessage = () => {
    let clientPhone = order.client_phone.trim() // Remove spaces
    
    // Check if the phone number already has a country code
    if (clientPhone.startsWith('+')) {
      // Already has international format with + sign, leave it as is
    } else if (clientPhone.startsWith('00')) {
      // Convert 00 international format to + format
      clientPhone = '+' + clientPhone.substring(2)
    } else if (clientPhone.startsWith('0')) {
      // Assume Moroccan number if it starts with 0
      clientPhone = '+212' + clientPhone.substring(1)
    } else {
      // If no country code and doesn't start with 0, assume it's already a Moroccan number without the leading 0
      clientPhone = '+212' + clientPhone
    }
  
    const isPaid = order.payment_method.toLowerCase() === 'visa' && order.payment_status === 'paid'
    
    const orderDetails = order.order_elements
      .map(item => `- ${item.quantity}x ${item.name}`)
      .join('\n')
    
    let message = `Bonjour, nous avons bien reçu votre commande comprenant :\n\n${orderDetails}\n\nElle est en cours de préparation. `
    
    if (isPaid) {
      message += `Notre livreur vous contactera dès que possible.\n\nMerci d'avoir choisi Bonsaï.`
    } else {
      message += `Notre livreur vous contactera dans quelques minutes.\n\nVous paierez ${order.total_price} Dhs lors de la livraison.\n\nMerci d'avoir choisi Bonsaï.`
    }
    
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${clientPhone}?text=${encodedMessage}`, '_blank')
  }

  const baseURL = 'http://bonsai-marrakech.com/backend'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {isDesktop ? (
        // Desktop Dialog
        <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl flex flex-col relative overflow-hidden animate-fadeIn">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
          >
            ✕
          </button>

          <div className="p-6 flex flex-row h-full">
            {/* Left Side: Client/Order Info */}
            <div className="w-1/2 pr-6 border-r border-gray-200 flex flex-col">
              <h2 className="text-xl font-bold text-primary mb-4 text-center">
                Order Details
              </h2>
              <div className="space-y-4 flex-grow">
                {/* Client Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Client Info</h3>
                  <p><strong>Name:</strong> {order.client_name}</p>
                  <p><strong>Email:</strong> {order.client_email}</p>
                  <p><strong>Phone:</strong> {order.client_phone}</p>
                  <p><strong>Address:</strong> {order.client_address}</p>
                </div>

                {/* Order Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Order Info</h3>
                  <p><strong>Total Price:</strong> {order.total_price} Dhs</p>
                  <p><strong>Payment Method:</strong> {order.payment_method}</p>
                  <p><strong>Placed:</strong> <TimeAgo datetime={order.created_at} /></p>
                  <div className="mt-4">
                    <p className="text-gray-600 font-medium">Order Status</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['pending', 'inprocess', 'delivered', 'declined'].map((status) => (
                        <span
                          key={status}
                          className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${getBgColorClass(
                            status
                          )} ${getStatusClass(orderStatus, status)}`}
                          onClick={() => setOrderStatus(status)}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-600 font-medium">Payment Status</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['paid', 'unpaid'].map((status) => (
                        <span
                          key={status}
                          className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${getBgColorClass(
                            status
                          )} ${getStatusClass(paymentStatus, status)}`}
                          onClick={() => setPaymentStatus(status)}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  onClick={sendWhatsAppMessage}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  WhatsApp
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                >
                  Save
                </button>
                <button
                  onClick={onClose}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Right Side: Order Items */}
            <div className="w-1/2 pl-6 overflow-y-auto max-h-[500px]">
              <h2 className="text-xl font-bold text-primary mb-4 text-center">Order Items</h2>
              <ul className="space-y-4">
                {order.order_elements.map((item) => (
                  <li key={item.id} className="flex items-center space-x-4">
                    {/* Item Image */}
                    <img
                      src={
                        item.menu_item?.image?.startsWith('http')
                          ? item.menu_item.image
                          : item.menu_item?.image
                          ? `${baseURL}${item.menu_item.image}`
                          : placeholder
                      }
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    {/* Item Details */}
                    <div>
                      <p className="text-lg font-medium text-primary">{item.name}</p>
                      <p><strong>Category:</strong> {item.menu_item?.category?.name || 'No Category'}</p>
                      <p><strong>Qty:</strong> {item.quantity}</p>
                      <p><strong>Price:</strong> {item.price} Dhs</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        // Mobile Drawer
        <div className="bg-white rounded-t-lg shadow-lg w-full max-h-[90vh] absolute bottom-0 left-0 flex flex-col overflow-hidden animate-slideUp">
          {/* Drag handle */}
          <div className="pt-2 pb-4 flex justify-center">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>
          
          <div className="px-4 pb-6 overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              ✕
            </button>

            {/* Client Info Section */}
            <div className="w-full border-b border-gray-200 pb-4">
              <h2 className="text-xl font-bold text-primary mb-4 text-center">
                Order Details
              </h2>
              <div className="space-y-4">
                {/* Client Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Client Info</h3>
                  <p><strong>Name:</strong> {order.client_name}</p>
                  <p><strong>Email:</strong> {order.client_email}</p>
                  <p><strong>Phone:</strong> {order.client_phone}</p>
                  <p><strong>Address:</strong> {order.client_address}</p>
                </div>

                {/* Order Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Order Info</h3>
                  <p><strong>Total Price:</strong> {order.total_price} Dhs</p>
                  <p><strong>Payment Method:</strong> {order.payment_method}</p>
                  <p><strong>Placed:</strong> <TimeAgo datetime={order.created_at} /></p>
                  <div className="mt-4">
                    <p className="text-gray-600 font-medium">Order Status</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['pending', 'inprocess', 'delivered', 'declined'].map((status) => (
                        <span
                          key={status}
                          className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${getBgColorClass(
                            status
                          )} ${getStatusClass(orderStatus, status)}`}
                          onClick={() => setOrderStatus(status)}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-600 font-medium">Payment Status</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['paid', 'unpaid'].map((status) => (
                        <span
                          key={status}
                          className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${getBgColorClass(
                            status
                          )} ${getStatusClass(paymentStatus, status)}`}
                          onClick={() => setPaymentStatus(status)}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  onClick={sendWhatsAppMessage}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  WhatsApp
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                >
                  Save
                </button>
                <button
                  onClick={onClose}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Order Items Section */}
            <div className="w-full pt-4 max-h-[50vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-primary mb-4 text-center">Order Items</h2>
              <ul className="space-y-4">
                {order.order_elements.map((item) => (
                  <li key={item.id} className="flex items-center space-x-4">
                    {/* Item Image */}
                    <img
                      src={
                        item.menu_item?.image?.startsWith('http')
                          ? item.menu_item.image
                          : item.menu_item?.image
                          ? `${baseURL}${item.menu_item.image}`
                          : placeholder
                      }
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    {/* Item Details */}
                    <div>
                      <p className="text-lg font-medium text-primary">{item.name}</p>
                      <p><strong>Category:</strong> {item.menu_item?.category?.name || 'No Category'}</p>
                      <p><strong>Qty:</strong> {item.quantity}</p>
                      <p><strong>Price:</strong> {item.price} Dhs</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetailsModal