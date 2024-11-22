import Logo from "./Logo";
import SearchBar from './SearchBar';
import CircleButton from "./CircleButton";

import { HiOutlinePhone, HiOutlineLocationMarker, HiOutlinePlusSm } from "react-icons/hi";

const Header = ({ setSearchTerm }) => (
  <header className="border-b border-primary p-4">
  <div className="flex flex-row items-center bg-background text-text w-full justify-between ">

    <div className="flex-shrink-0">
      <Logo />
    </div>

    <SearchBar setSearchTerm={setSearchTerm} className={'hidden md:block'} />

    <div className="flex gap-1 md:gap-4">
      <CircleButton body="+212 628 354575" href="tel:+212628354575" icon={<HiOutlinePhone />} />
      <CircleButton body="Marrakech" href="https://maps.app.goo.gl/z1u3aWaZuMSjftQx8" icon={<HiOutlineLocationMarker />} />
      <CircleButton body="Visit our website" href="https://bonsai-marrakech.com/" icon={<HiOutlinePlusSm />} />
    </div>
  </div>
  <div>
  <SearchBar setSearchTerm={setSearchTerm} className={'md:hidden mt-4'} />
  </div>
  </header>
);

export default Header;
