import Logo from "./Logo"
import SearchBar from './SearchBar';
import CircleButton from "./CircleButton"


import { HiOutlinePhone } from "react-icons/hi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { HiOutlinePlusSm } from "react-icons/hi";

const Header = () => (
    <header className="flex items-center p-4 bg-background text-text w-full border-b border-primary">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Logo />
      </div>

      {/* Search Bar */}
      <SearchBar />

      {/* Buttons */}
      <div className="flex space-x-4">
        <CircleButton body="+212 628 354575" href="tel:+212628354575" icon={<HiOutlinePhone />} />
        <CircleButton body="Marrakech" href="https://maps.app.goo.gl/z1u3aWaZuMSjftQx8" icon={<HiOutlineLocationMarker />} />
        <CircleButton body="visite our website" href="https://bonsai-marrakech.com/" icon={<HiOutlinePlusSm />} />
      </div>
    </header>
)

export default Header