import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="my-6 mx-4 p-4 bg-primary text-background rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:justify-between items-center">
          <p>&copy; 2024 Bonsai Marrakech. Tous droits réservés.</p>
          <Link href="/conditions-generales">conditions générales</Link>
        </div>
      </footer>
  )
}
