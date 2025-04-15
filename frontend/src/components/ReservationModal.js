import React, { useEffect } from 'react'
import { useMediaQuery } from "@/hooks/use-media-query"
import ReservationForm from './ReservationForm'

const ReservationModal = ({ onClose, open = true }) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {isDesktop ? (
        // Desktop Modal
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md flex flex-col relative overflow-hidden animate-fadeIn">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
          >
            ✕
          </button>

          <div className="p-6">
            <h2 className="text-xl font-bold text-primary mb-4 text-center">
              Réservation de Table
            </h2>
            
            <ReservationForm onClose={onClose} />
          </div>
        </div>
      ) : (
        // Mobile Drawer
        <div className="bg-white rounded-t-lg shadow-lg w-full max-h-[90vh] absolute bottom-0 left-0 flex flex-col overflow-hidden animate-slideUp">
          {/* Drag handle */}
          <div className="pt-2 pb-4 flex justify-center">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
          >
            ✕
          </button>
          
          <div className="px-4 pb-6 overflow-y-auto">
            <h2 className="text-xl font-bold text-primary mb-4 text-center">
              Réservation de Table
            </h2>
            
            <ReservationForm onClose={onClose} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ReservationModal