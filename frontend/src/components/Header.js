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
        <CircleButton label="Phone Number" icon={<HiOutlinePhone />} />
        <CircleButton label="Address" icon={<HiOutlineLocationMarker />} />
        <CircleButton label="Add to Cart" icon={<HiOutlinePlusSm />} />
      </div>
    </header>
)

export default Header