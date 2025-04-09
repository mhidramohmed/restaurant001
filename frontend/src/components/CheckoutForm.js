'use client'
import { useState } from 'react'
import MainButton from './MainButton'
import axios from '@/lib/axios'
import { toast } from 'react-toastify'
// import logos from '@/assets/img/logos.png'

// Country codes for selection
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
  // Add more country codes as needed
]

const CheckoutForm = ({ onClose, onSuccess, cartItems, totalPrice }) => {
    const [formData, setFormData] = useState({
        client_name: '',
        client_email: '',
        client_phone: {
            country_code: '+212', // Default to Morocco
            number: ''
        },
        client_address: '',
        payment_method: 'cash',
        card_details: {
            card_number: '',
            card_expiry: '',
            card_cvv: '',
        },
    })

    const [errors, setErrors] = useState({
        client_email: '',
        client_phone_number: '',
    })

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target

        let errorMsg = ''

        if (name === 'client_email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            errorMsg = emailRegex.test(value) ? '' : 'Email invalide'
            
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: errorMsg,
            }))
            
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }))
        } 
        else if (name === 'country_code') {
            setFormData((prevData) => ({
                ...prevData,
                client_phone: {
                    ...prevData.client_phone,
                    country_code: value
                }
            }))
        }
        else if (name === 'phone_number') {
            // Validate phone number (only digits allowed)
            const phoneRegex = /^\d{6,12}$/
            errorMsg = phoneRegex.test(value) ? '' : 'Numéro de téléphone invalide (6-12 chiffres)'
            
            setErrors((prevErrors) => ({
                ...prevErrors,
                client_phone_number: errorMsg,
            }))
            
            setFormData((prevData) => ({
                ...prevData,
                client_phone: {
                    ...prevData.client_phone,
                    number: value
                }
            }))
        }
        else if (name.startsWith('card_')) {
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

        if (errors.client_email || errors.client_phone_number) {
            toast.error("Corrigez les erreurs avant de soumettre.", { position: "top-right" })
            return
        }

        // Combine country code and phone number
        const fullPhoneNumber = formData.client_phone.country_code + formData.client_phone.number

        const orderData = {
            client_name: formData.client_name,
            client_email: formData.client_email,
            client_phone: fullPhoneNumber,
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
            } else if (formData.payment_method === 'cash') {
                onSuccess('cash')
                toast.success('Commande créée avec succès!', { position: 'top-right' })
            }
        } catch (error) {
            toast.error('Échec de la commande. Réessayez.', { position: 'top-right' })
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 px-4 py-6">
            <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-text">Valider la commande</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Client Name */}
                    <div>
                        <input
                            type="text"
                            name="client_name"
                            placeholder="Nom Complet"
                            value={formData.client_name}
                            onChange={handleChange}
                            required
                            className="w-full h-12 px-4 bg-secondary text-text rounded-lg"
                        />
                    </div>
                    
                    {/* Client Email */}
                    <div>
                        <input
                            type="email"
                            name="client_email"
                            placeholder="Adresse Email"
                            value={formData.client_email}
                            onChange={handleChange}
                            required
                            className={`w-full h-12 px-4 bg-secondary text-text rounded-lg ${errors.client_email ? 'border-red-500' : ''}`}
                        />
                        {errors.client_email && <p className="text-red-500 text-sm">{errors.client_email}</p>}
                    </div>
                    
                    {/* Client Phone - Split into country code and number */}
                    <div>
                        <div className="flex gap-2">
                            <select
                                name="country_code"
                                value={formData.client_phone.country_code}
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
                                value={formData.client_phone.number}
                                onChange={handleChange}
                                required
                                className={`w-2/3 h-12 px-4 bg-secondary text-text rounded-lg ${errors.client_phone_number ? 'border-red-500' : ''}`}
                            />
                        </div>
                        {errors.client_phone_number && <p className="text-red-500 text-sm">{errors.client_phone_number}</p>}
                        {/* <p className="text-gray-400 text-xs mt-1">Exemple: {formData.client_phone.country_code} 612345678</p> */}
                        <p className="text-gray-400 text-xs mt-1">Exemple: +212 612345678</p>
                    </div>
                    
                    {/* Client Address */}
                    <div>
                        <input
                            type="text"
                            name="client_address"
                            placeholder="Adresse de Livraison"
                            value={formData.client_address}
                            onChange={handleChange}
                            required
                            className="w-full h-12 px-4 bg-secondary text-text rounded-lg"
                        />
                    </div>

                    {/* City just for client to see*/}
                    <div>
                        <label className="text-text font-medium">Ville:</label>
                        <select
                            name="payment_method"
                            className="w-full h-12 px-4 bg-secondary text-text rounded-lg mt-2"
                        >
                            <option value="marrakech" selected>Marrakech</option>
                        </select>
                    </div>

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