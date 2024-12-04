'use client'
import { useState } from 'react'
import MainButton from './MainButton'
import axios from '@/lib/axios'
import { toast } from 'react-toastify'

const CheckoutForm = ({ onClose, onSuccess, cartItems, totalPrice }) => {
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    client_address: '',
    payment_method: 'cash',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const orderData = {
      client_name: formData.client_name,
      client_email: formData.client_email,
      client_phone: formData.client_phone,
      client_address: formData.client_address,
      total_price: totalPrice,
      payment_method: formData.payment_method,
      order_items: cartItems.map((item) => ({
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    }

    try {
      await axios.post('/api/orders', orderData)
      onSuccess()
    } catch (error) {
      toast.error('Échec de la commande. Réessayez.', { position: 'top-right' })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 px-4 py-6"> {/* Added py-6 */}
      <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-text">Valider la commande</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Client Information Fields */}
          {[
            { name: 'client_name', placeholder: 'Nom Complet' },
            { name: 'client_email', placeholder: 'Adresse Email' },
            { name: 'client_phone', placeholder: 'Numéro de Téléphone' },
            { name: 'client_address', placeholder: 'Adresse de Livraison' },
          ].map(({ name, placeholder }) => (
            <div key={name}>
              <input
                type="text"
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 bg-secondary text-text rounded-lg"
              />
            </div>
          ))}

          {/* Payment Method */}
          <div>
            <label className="text-text font-medium">Payment Method:</label>
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="w-full h-12 px-4 bg-secondary text-text rounded-lg mt-2"
            >
              <option value="cash">Paiement en espèces</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <MainButton type="button" onClick={onClose} className="bg-gray-300 text-text">
              Annuler
            </MainButton>
            <MainButton type="submit" className="bg-primary text-background">
              Confirmer
            </MainButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CheckoutForm
