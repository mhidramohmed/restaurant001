import Logo from "./Logo"
import SearchBar from './SearchBar'
import CircleButton from "./CircleButton"
import Link from "next/link"
import { useState } from 'react'
import ReservationModal from './ReservationModal'

import { HiOutlinePhone, HiOutlineLocationMarker, HiOutlineCalendar } from "react-icons/hi"

const Header = ({ setSearchTerm }) => {
  const [showReservationModal, setShowReservationModal] = useState(false)

  return (
    <header className="border-b border-primary p-4">
      <div className="flex flex-row items-center bg-background text-text w-full justify-between ">

        <Link href='/' className="flex-shrink-0">
          <Logo />
        </Link>

        <SearchBar setSearchTerm={setSearchTerm} className={'hidden md:block'} />

        <div className="flex gap-1 md:gap-4 items-center">
          <CircleButton href="tel:+212605274561 " icon={<HiOutlinePhone />} />
          <CircleButton href="https://maps.app.goo.gl/z1u3aWaZuMSjftQx8" icon={<HiOutlineLocationMarker />} />
          
          {/* Wider reservation button replacing the previous CircleButton */}
          <button 
            onClick={() => setShowReservationModal(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition-all"
          >
            <HiOutlineCalendar className="text-lg" />
            <span className="hidden md:inline">Réservation</span>
          </button>
        </div>
      </div>
      <div>
        <SearchBar setSearchTerm={setSearchTerm} className={'md:hidden mt-4'} />
      </div>
      
      {/* Reservation Modal */}
      {showReservationModal && (
        <ReservationModal 
          onClose={() => setShowReservationModal(false)} 
          open={showReservationModal}
        />
      )}
    </header>
  )
}

export default Header