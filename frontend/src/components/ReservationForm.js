'use client'
import { useState } from 'react'
import axios from '@/lib/axios'
import { toast } from 'react-toastify'
import MainButton from './MainButton'

// Country codes for selection (same as in CheckoutForm)
const countryCodes = [
  { code: '+212', country: 'Morocco' },
  { code: '+1', country: 'USA/Canada' },
  { code: '+33', country: 'France' },
  { code: '+34', country: 'Spain' },
  { code: '+44', country: 'UK' },
  { code: '+49', country: 'Germany' },
  { code: '+39', country: 'Italy' },
  { code: '+31', country: 'Netherlands' },
  { code: '+32', country: 'Belgium' },
  { code: '+41', country: 'Switzerland' },
  { code: '+351', country: 'Portugal' },
  { code: '+971', country: 'UAE' },
  { code: '+966', country: 'Saudi Arabia' },
  { code: '+20', country: 'Egypt' },
  { code: '+216', country: 'Tunisia' },
  { code: '+213', country: 'Algeria' },
]

const ReservationForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: {
      country_code: '+212', // Default to Morocco
      number: ''
    },
    date: '',
    time: '',
    guests: 1,
    notes: '',
  })

  const [errors, setErrors] = useState({
    phone_number: '',
  })

  // Generate time options (30 minute intervals)
  const generateTimeOptions = () => {
    const options = []
    for (let hour = 11; hour <= 22; hour++) {
      for (let minute of ['00', '30']) {
        // Skip times before 11:30
        if (hour === 11 && minute === '00') continue
        
        const time = `${hour}:${minute}`
        options.push(time)
      }
    }
    return options
  }

  const timeOptions = generateTimeOptions()

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target

    let errorMsg = ''

    if (name === 'country_code') {
      setFormData((prevData) => ({
        ...prevData,
        phone: {
          ...prevData.phone,
          country_code: value
        }
      }))
    }
    else if (name === 'phone_number') {
      if (value) { // Only validate if phone is provided (it's optional)
        // Validate phone number (only digits allowed)
        const phoneRegex = /^\d{6,12}$/
        errorMsg = phoneRegex.test(value) ? '' : 'Numéro de téléphone invalide (6-12 chiffres)'
      }
      
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone_number: errorMsg,
      }))
      
      setFormData((prevData) => ({
        ...prevData,
        phone: {
          ...prevData.phone,
          number: value
        }
      }))
    }
    else if (name === 'guests') {
      // Ensure guests is at least 1
      const guestCount = Math.max(1, parseInt(value) || 1)
      
      setFormData((prevData) => ({
        ...prevData,
        [name]: guestCount,
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }))
    }
  }

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault()
  
    // Check for empty phone when submitting
    if (!formData.phone.number) {
      setErrors(prev => ({
        ...prev,
        phone_number: 'Numéro de téléphone est obligatoire'
      }))
      toast.error("Le numéro de téléphone est obligatoire.", { position: "top-right" })
      return
    }
  
    if (errors.email || errors.phone_number) {
      toast.error("Corrigez les erreurs avant de soumettre.", { position: "top-right" })
      return
    }
  
    // Always combine country code and phone number
    const fullPhoneNumber = (formData.phone.country_code + formData.phone.number).replace(/\s+/g, '')  
    const reservationData = {
      name: formData.name,
      phone: fullPhoneNumber,
      date: formData.date,
      time: formData.time,
      guests: formData.guests,
      notes: formData.notes || null,
      status: 'pending' // Default status
    }
  
    try {
        await axios.post('/api/reservations', reservationData)
        
        toast.success('Réservation créée avec succès!', { position: 'top-right' })
        onClose()
      } catch (error) {
        console.error('Reservation error:', error.response?.data || error)
        
        // More detailed error message
        const errorMessage = error.response?.data?.message || 'Échec de la réservation. Réessayez.'
        toast.error(errorMessage, { position: 'top-right' })
      }
  }

  // Get tomorrow's date in YYYY-MM-DD format for min date attribute
  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <input
          type="text"
          name="name"
          placeholder="Nom Complet"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full h-12 px-4 bg-secondary text-text rounded-lg"
        />
      </div>
      
      {/* Phone - Split into country code and number */}
      <div>
        <div className="flex gap-2">
          <select
            name="country_code"
            value={formData.phone.country_code}
            onChange={handleChange}
            className="w-1/3 h-12 px-2 bg-secondary text-text rounded-lg"
          >
            {countryCodes.map((country) => (
              <option key={country.code} value={country.code}>
                {country.code} ({country.country})
              </option>
            ))}
          </select>
          
          <input
  type="tel"
  name="phone_number"
  placeholder="Numéro de Téléphone"
  value={formData.phone.number}
  onChange={handleChange}
  required
  className={`w-2/3 h-12 px-4 bg-secondary text-text rounded-lg ${errors.phone_number ? 'border-red-500' : ''}`}
/>
        </div>
        {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number}</p>}
        <p className="text-gray-400 text-xs mt-1">Exemple: 612345678 (sans le zéro initial)</p>
      </div>
      
      {/* Date */}
      <div>
        <input
          type="date"
          name="date"
          min={getTomorrowDate()}
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full h-12 px-4 bg-secondary text-text rounded-lg"
        />
      </div>
      
      {/* Time */}
      <div>
        <select
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
          className="w-full h-12 px-4 bg-secondary text-text rounded-lg"
        >
          <option value="">Sélectionner l'heure</option>
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>
      
      {/* Guests */}
      <div>
        <div className="flex items-center">
          <label className="mr-4 text-text">Nombre de personnes:</label>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => handleChange({ target: { name: 'guests', value: Math.max(1, formData.guests - 1) } })}
              className="bg-secondary text-text h-10 w-10 flex items-center justify-center rounded-l-lg"
            >
              -
            </button>
            <input
              type="number"
              name="guests"
              min="1"
              value={formData.guests}
              onChange={handleChange}
              className="w-16 h-10 text-center bg-secondary text-text border-x border-background"
            />
            <button
              type="button"
              onClick={() => handleChange({ target: { name: 'guests', value: formData.guests + 1 } })}
              className="bg-secondary text-text h-10 w-10 flex items-center justify-center rounded-r-lg"
            >
              +
            </button>
          </div>
        </div>
      </div>
      
      {/* Notes */}
      <div>
        <textarea
          name="notes"
          placeholder="Remarques ou demandes spéciales (optionnel)"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-2 bg-secondary text-text rounded-lg"
        ></textarea>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 mt-6">
        <MainButton type="button" onClick={onClose} className="bg-gray-300 text-text">
          Annuler
        </MainButton>
        <MainButton type="submit" className="bg-primary text-background">
          Confirmer
        </MainButton>
      </div>
    </form>
  )
}

export default ReservationForm