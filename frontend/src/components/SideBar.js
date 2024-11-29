'use client';
import Link from 'next/link';
import Logo from './Logo';
import MainButton from './MainButton';
import { FaSignOutAlt } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

import { useAuth } from '@/hooks/auth';

const SideBar = () => {
  const { logout } = useAuth();
  const pathname = usePathname();

  return (
    <div className="w-64 h-full min-h-screen bg-background shadow-lg flex flex-col">
      {/* Logo */}
      <div className="flex justify-center items-center p-4">
        <Logo />
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-2 flex-1 space-y-4 px-4 py-6 ">
        <Link href="/dashboard">
          <MainButton
            className={`w-full text-left border-0 text-text hover:bg-secondary hover:text-primary ${
              pathname === '/dashboard' ? 'bg-secondary text-primary' : ''
            }`}
          >
            Dashboard
          </MainButton>
        </Link>
        <Link href="/dashboard/menu">
          <MainButton
            className={`w-full text-left border-0 text-text hover:bg-secondary hover:text-primary ${
              pathname === '/dashboard/menu' ? 'bg-secondary text-primary' : ''
            }`}
          >
            Menu
          </MainButton>
        </Link>
        <Link href="/dashboard/customers">
          <MainButton
            className={`w-full text-left border-0 text-text hover:bg-secondary hover:text-primary ${
              pathname === '/dashboard/customers' ? 'bg-secondary text-primary' : ''
            }`}
          >
            Customers
          </MainButton>
        </Link>
        <Link href="/dashboard/orders">
          <MainButton
            className={`w-full text-left border-0 text-text hover:bg-secondary hover:text-primary ${
              pathname === '/dashboard/orders' ? 'bg-secondary text-primary' : ''
            }`}
          >
            Orders
          </MainButton>
        </Link>
        {/* <Link href="/dashboard/trashed/menu-items">
          <MainButton
            className={`w-full text-left border-0 text-text hover:bg-secondary hover:text-primary ${
              pathname === '/dashboard/trashed/menu-items' ? 'bg-secondary text-primary' : ''
            }`}
          >
            Trashed
          </MainButton>
        </Link> */}
      </div>

      {/* Log Out Button at the bottom */}
      <div className="py-4 px-4 mt-auto">
        <MainButton
          onClick={logout}
          className="w-full text-left bg-primary text-background border-0 hover:bg-opacity-90 flex items-center"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </MainButton>
      </div>
    </div>
  );
};

export default SideBar;
