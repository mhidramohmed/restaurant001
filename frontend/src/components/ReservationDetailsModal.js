import React, { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import TimeAgo from 'timeago-react'
import { useMediaQuery } from "@/hooks/use-media-query"
import { Calendar, Clock, Users, MessageSquare, Edit, Save, X } from 'lucide-react'

//function to format date in French
const formatDateFrench = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('fr-FR', options)
  }

const ReservationDetailsModal = ({ reservation, onClose, mutate, open = true }) => {
  const [status, setStatus] = useState(reservation.status)
  const [guests, setGuests] = useState(reservation.guests)
  const [notes, setNotes] = useState(reservation.notes || '')
  const [date, setDate] = useState(reservation.date)
  const [time, setTime] = useState(reservation.time)
  const [isEditing, setIsEditing] = useState(false)
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

  // Reset editing state when modal closes
  useEffect(() => {
    if (!open) {
      setIsEditing(false)
    }
  }, [open])

  // Enable edit mode
  const handleEnableEditing = () => {
    setIsEditing(true)
  }

  // Cancel editing and revert changes
  const handleCancelEditing = () => {
    setGuests(reservation.guests)
    setNotes(reservation.notes || '')
    setDate(reservation.date)
    setTime(reservation.time)
    setIsEditing(false)
  }

  if (!open) return null

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified'
    
    try {
      // Parse time in HH:MM:SS format
      const [hours, minutes] = timeString.split(':')
      const date = new Date()
      date.setHours(parseInt(hours, 10))
      date.setMinutes(parseInt(minutes, 10))
      
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch (e) {
      return timeString // Fallback to original string if parsing fails
    }
  }

  const handleSaveChanges = async () => {
    await axios.patch(
      `/api/reservations/${reservation.id}`,
      {
        status,
        guests,
        notes,
        date,
        time
      },
      {
        withCredentials: true,
      }
    )
    mutate()
    setIsEditing(false)
  }

  // Update status directly without requiring edit mode
  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus)
    
    // If not in editing mode, save status change immediately
    if (!isEditing) {
      await axios.patch(
        `/api/reservations/${reservation.id}`,
        { status: newStatus },
        { withCredentials: true }
      )
      mutate()
    }
  }

  const getStatusClass = (currentStatus, status) =>
    currentStatus === status
      ? 'bg-opacity-100 text-white'
      : 'bg-opacity-0 text-gray-600 border'

  const getBgColorClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500 border-green-500'
      case 'pending':
        return 'bg-yellow-500 border-yellow-500'
      case 'canceled':
        return 'bg-red-500 border-red-500'
      case 'completed':
        return 'bg-blue-500 border-blue-500'
      default:
        return 'bg-gray-500 border-gray-500'
    }
  }

  const sendWhatsAppMessage = () => {
    let clientPhone = reservation.phone.trim() // Remove spaces
    
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
    
    // Use French date format
    const formattedDate = formatDateFrench(date)
    const formattedTime = formatTime(time)
    
    let message = `Bonjour ${reservation.name}, nous avons bien reçu votre réservation pour ${guests} personnes le ${formattedDate} à ${formattedTime}.\n\nNous avons hâte de vous accueillir.\n\nMerci d'avoir choisi Bonsaï.`
    
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${clientPhone}?text=${encodedMessage}`, '_blank')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {isDesktop ? (
        // Desktop Dialog
        <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl flex flex-col relative overflow-hidden animate-fadeIn">
          {/* Header with Edit Button */}
          <div className="border-b border-gray-200 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-primary">
              Reservation Details
            </h2>
            <div className="flex space-x-2">
              {!isEditing ? (
                <button
                  onClick={handleEnableEditing}
                  className="bg-gray-400 text-white px-3 py-1 rounded-md flex items-center text-sm"
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit Details
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancelEditing}
                    className="bg-gray-400 text-white px-3 py-1 rounded-md flex items-center text-sm"
                  >
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="bg-green-500 text-white px-3 py-1 rounded-md flex items-center text-sm"
                  >
                    <Save className="h-4 w-4 mr-1" /> Save
                  </button>
                </div>
              )}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-6 flex flex-col h-full">
            
            {/* Reservation Info */}
            <div className="space-y-6 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                    <Users className="mr-2 h-5 w-5" /> Customer Information
                  </h3>
                  <p><strong>Name:</strong> {reservation.name}</p>
                  <p><strong>Phone:</strong> {reservation.phone}</p>
                  
                  {/* Guests Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Guests
                    </label>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-400 mr-2" />
                      {isEditing ? (
                        <input
                          type="number"
                          min="1"
                          value={guests}
                          onChange={(e) => setGuests(parseInt(e.target.value))}
                          className="border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                        />
                      ) : (
                        <span>{guests} people</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Reservation Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                    <Calendar className="mr-2 h-5 w-5" /> Reservation Details
                  </h3>
                  
                  {/* Date Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      {isEditing ? (
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                        />
                      ) : (
                        <span>{formatDate(date)}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Time Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-2" />
                      {isEditing ? (
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                        />
                      ) : (
                        <span>{formatTime(time)}</span>
                      )}
                    </div>
                  </div>
                  
                  <p><strong>Created:</strong> <TimeAgo datetime={reservation.created_at} /></p>
                </div>
              </div>
              
              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <div className="flex items-start">
                  <MessageSquare className="h-5 w-5 text-gray-400 mr-2 mt-2" />
                  {isEditing ? (
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      placeholder="Add special requests or notes..."
                    />
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-md w-full">
                      {notes ? notes : <span className="text-gray-400">No notes</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Status Selection - Always Accessible */}
            <div className="">
              <p className="text-gray-600 font-medium mb-2">Reservation Status</p>
              <div className="flex flex-wrap gap-2">
                {['confirmed', 'pending', 'canceled', 'completed'].map((statusOption) => (
                  <span
                    key={statusOption}
                    className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${getBgColorClass(
                      statusOption
                    )} ${getStatusClass(status, statusOption)}`}
                    onClick={() => handleStatusChange(statusOption)}
                  >
                    {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto flex flex-wrap gap-2 justify-end">
            <button
  onClick={sendWhatsAppMessage}
  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
>
  <MessageSquare className="h-5 w-5 mr-1" /> Confirm
</button>
              <button
                onClick={onClose}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Mobile Drawer
        <div className="bg-white rounded-t-lg shadow-lg w-full max-h-[90vh] absolute bottom-0 left-0 flex flex-col overflow-hidden animate-slideUp">
          {/* Drag handle */}
          <div className="pt-2 pb-2 flex justify-center">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>
          
          {/* Header with Edit Button */}
          <div className="border-b border-gray-200 px-4 pb-2 flex justify-between items-center">
            <h2 className="text-xl font-bold text-primary">
              Reservation Details
            </h2>
            <div className="flex space-x-2">
              {!isEditing ? (
                <button
                  onClick={handleEnableEditing}
                  className="bg-gray-400 text-white px-3 py-1 rounded-md flex items-center text-sm"
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit Details
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancelEditing}
                    className="bg-gray-400 text-white px-3 py-1 rounded-md flex items-center text-sm"
                  >
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="bg-green-500 text-white px-3 py-1 rounded-md flex items-center text-sm"
                  >
                    <Save className="h-4 w-4 mr-1" /> Save
                  </button>
                </div>
              )}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="px-4 py-4 overflow-y-auto">
            
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                  <Users className="mr-2 h-5 w-5" /> Customer Information
                </h3>
                <p><strong>Name:</strong> {reservation.name}</p>
                <p><strong>Phone:</strong> {reservation.phone}</p>
                
                {/* Guests Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Guests
                  </label>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-2" />
                    {isEditing ? (
                      <input
                        type="number"
                        min="1"
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                        className="border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      />
                    ) : (
                      <span>{guests} people</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Reservation Details */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                  <Calendar className="mr-2 h-5 w-5" /> Reservation Details
                </h3>
                
                {/* Date Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    {isEditing ? (
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      />
                    ) : (
                      <span>{formatDate(date)}</span>
                    )}
                  </div>
                </div>
                
                {/* Time Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    {isEditing ? (
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      />
                    ) : (
                      <span>{formatTime(time)}</span>
                    )}
                  </div>
                </div>
                
                <p><strong>Created:</strong> <TimeAgo datetime={reservation.created_at} /></p>
              </div>
              
              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <div className="flex items-start">
                  <MessageSquare className="h-5 w-5 text-gray-400 mr-2 mt-2" />
                  {isEditing ? (
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      placeholder="Add special requests or notes..."
                    />
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-md w-full">
                      {notes ? notes : <span className="text-gray-400">No notes</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Status Selection - Always Accessible */}
            <div className="mt-6">
              <p className="text-gray-600 font-medium mb-2">Reservation Status</p>
              <div className="flex flex-wrap gap-2">
                {['confirmed', 'pending', 'canceled', 'completed'].map((statusOption) => (
                  <span
                    key={statusOption}
                    className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${getBgColorClass(
                      statusOption
                    )} ${getStatusClass(status, statusOption)}`}
                    onClick={() => handleStatusChange(statusOption)}
                  >
                    {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-2">
            <button
  onClick={sendWhatsAppMessage}
  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
>
  <MessageSquare className="h-5 w-5 mr-1" /> Confirm
</button>
              <button
                onClick={onClose}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReservationDetailsModal