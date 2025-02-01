'use client'
import { useState } from 'react'
import MainButton from './MainButton'
import axios from '@/lib/axios'
import { toast } from 'react-toastify'
// import logos from '@/assets/img/logos.png'

const CheckoutForm = ({ onClose, onSuccess, cartItems, totalPrice }) => {
    const [formData, setFormData] = useState({
        client_name: '',
        client_email: '',
        client_phone: '',
        client_address: '',
        payment_method: 'cash',
        card_details: {
            card_number: '',
            card_expiry: '',
            card_cvv: '',
        },
    })

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target

        if (name.startsWith('card_')) {
            setFormData((prevData) => ({
                ...prevData,
                card_details: {
                    ...prevData.card_details,
                    [name]: value,
                },
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
            //   card_details: formData.payment_method === 'visa' ? formData.card_details : undefined,
        }

        try {
            const response = await axios.post('/api/orders', orderData)
            const { data } = response



            if (data.success && data.redirect_url && data.payment_data) {
                // Create and submit form for CMI payment
                localStorage.setItem('pendingOrder', JSON.stringify(data.order))

                
                const form = document.createElement('form')
                form.method = 'POST'
                form.action = data.redirect_url

                // Add all payment parameters as hidden fields
                Object.entries(data.payment_data).forEach(([key, value]) => {
                    const input = document.createElement('input')
                    input.type = 'hidden'
                    input.name = key
                    input.value = value
                    form.appendChild(input)
                })

                // Append form to body and submit
                document.body.appendChild(form)
                form.submit()
            } else {
                // Handle successful cash order
                onSuccess(formData.payment_method)
                toast.success('Commande créée avec succès!', { position: 'top-right' })
            }
        } catch (error) {
            toast.error('Échec de la commande. Réessayez.', { position: 'top-right' })
        }

        // try {
        //   await axios.post('/api/orders', orderData)
        //   onSuccess()
        // } catch (error) {
        //   toast.error('Échec de la commande. Réessayez.', { position: 'top-right' })
        // }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 px-4 py-6">
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
                            <option value="visa">Paiement par carte </option>
                        </select>
                    </div>

                    {/* Card Details - Conditionally Rendered
          {formData.payment_method === 'visa' && (
            <div className="space-y-2">
              <div className="flex justify-center">
              <img
          src={logos.src}
          alt="Payment Methods"
          className="h-8 w-auto"
        />
              </div>

              <div>
                <label className="text-text font-medium">Numéro de Carte</label>
                <input
                disabled
                  type="text"
                  name="card_number"
                  placeholder="1234 5678 9123 4567"
                  value={formData.card_details.card_number}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 bg-secondary text-text rounded-lg"
                />
              </div>
              <div className="flex space-x-2">
                <div>
                  <label className="text-text font-medium">Date d'Expiration</label>
                  <input
                  disabled
                    type="text"
                    name="card_expiry"
                    placeholder="MM/YY"
                    value={formData.card_details.card_expiry}
                    onChange={handleChange}
                    required
                    className="w-full h-12 px-4 bg-secondary text-text rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-text font-medium">CVV</label>
                  <input
                  disabled
                    type="text"
                    name="card_cvv"
                    placeholder="123"
                    value={formData.card_details.card_cvv}
                    onChange={handleChange}
                    required
                    className="w-full h-12 px-4 bg-secondary text-text rounded-lg"
                  />
                </div>
              </div>
            </div>
          )} */}

                    {/* Action Buttons */}
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
