import React from 'react'
import Link from 'next/link'
import logos from '@/assets/img/logos.png'

export default function Footer() {
  return (
    <footer className="my-6 mx-4 p-4 bg-primary text-background rounded-lg shadow-md md:mb-6 mb-[100px]">
      <div className="flex flex-col md:flex-row md:justify-between items-center">
        <p>&copy; 2024 Bonsai Marrakech. Tous droits réservés.</p>
        <Link href="/conditions-generales">conditions générales</Link>
      </div>
      
      {/* Payment Logos */}
      <div className="flex justify-center mt-4">
        <img 
          src={logos.src} 
          alt="Payment Methods" 
          className="h-8 w-auto" 
        />
      </div>
    </footer>
  )
}
