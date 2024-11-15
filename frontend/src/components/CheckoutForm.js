// components/CheckoutForm.js
'use client';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCreditCard } from 'react-icons/fi';
import { useState } from 'react';
import MainButton from './MainButton';
import axios from '@/lib/axios';

const CheckoutForm = ({ onClose, cartItems, totalPrice }) => {
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    client_address: '',
    payment_method: 'cash', // Default payment method
    card_number: '',
    card_expiry: '',
    card_cvv: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to be sent
    const orderData = {
      client_name: formData.client_name,
      client_email: formData.client_email,
      client_phone: formData.client_phone,
      client_address: formData.client_address,
      total_price: totalPrice,
      payment_method: formData.payment_method,
      // 'status' should not be sent; it's set by the backend
      order_items: cartItems.map(item => ({
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    // If payment method is Visa, include card details
    if (formData.payment_method === 'visa') {
      orderData.card_details = {
        card_number: formData.card_number,
        card_expiry: formData.card_expiry,
        card_cvv: formData.card_cvv,
      };
    }

    try {
      const response = await axios.post('/api/orders', orderData);
      alert('Order placed successfully!');
      onClose();
      // Optionally, clear the cart here
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-text">Checkout</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Client Information Fields */}
          {[
            { name: 'client_name', placeholder: 'Name', icon: <FiUser /> },
            { name: 'client_email', placeholder: 'Email', icon: <FiMail /> },
            { name: 'client_phone', placeholder: 'Phone', icon: <FiPhone /> },
            { name: 'client_address', placeholder: 'Address', icon: <FiMapPin /> },
          ].map(({ name, placeholder, icon }) => (
            <div key={name} className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text">
                {icon}
              </span>
              <input
                type={name.includes('email') ? 'email' : 'text'}
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                required
                className="w-full h-12 pl-10 pr-4 bg-secondary text-text rounded-lg border-none focus:outline-none"
              />
            </div>
          ))}

          {/* Payment Method Selection */}
          <div>
            <label className="text-text font-medium">Payment Method:</label>
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="w-full h-12 px-4 py-2 bg-secondary text-text rounded-lg border-none focus:outline-none mt-2"
            >
              <option value="visa">Visa</option>
              <option value="cash">Cash</option>
            </select>
          </div>

          {/* Conditional Visa Payment Details */}
          {formData.payment_method === 'visa' && (
            <div className="space-y-2">
              {[
                { name: 'card_number', placeholder: 'Card Number' },
                { name: 'card_expiry', placeholder: 'Expiry Date (MM/YY)' },
                { name: 'card_cvv', placeholder: 'CVV' },
              ].map(({ name, placeholder }) => (
                <div key={name} className="relative">
                  <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text" />
                  <input
                    type="text"
                    name={name}
                    placeholder={placeholder}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                    className="w-full h-12 pl-10 pr-4 bg-secondary text-text rounded-lg border-none focus:outline-none"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <MainButton type="button" onClick={onClose} className="bg-gray-300 text-text">Cancel</MainButton>
            <MainButton type="submit" className="bg-primary text-background">
              Confirm Order
            </MainButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
