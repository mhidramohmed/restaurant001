import Logo from "./Logo"
import SearchBar from './SearchBar'
import CircleButton from "./CircleButton"
import Link from "next/link"

import { HiOutlinePhone, HiOutlineLocationMarker, HiOutlinePlusSm } from "react-icons/hi"

const Header = ({ setSearchTerm }) => (
  <header className="border-b border-primary p-4">
  <div className="flex flex-row items-center bg-background text-text w-full justify-between ">

    <Link href='/' className="flex-shrink-0">
      <Logo />
    </Link>

    <SearchBar setSearchTerm={setSearchTerm} className={'hidden md:block'} />

    <div className="flex gap-1 md:gap-4">
      <CircleButton href="tel:+212605274561 " icon={<HiOutlinePhone />} />
      <CircleButton href="https://maps.app.goo.gl/z1u3aWaZuMSjftQx8" icon={<HiOutlineLocationMarker />} />
      <CircleButton href="https://bonsai-marrakech.com/" icon={<HiOutlinePlusSm />} />
    </div>
  </div>
  <div>
  <SearchBar setSearchTerm={setSearchTerm} className={'md:hidden mt-4'} />
  </div>
  </header>
)

export default Header
