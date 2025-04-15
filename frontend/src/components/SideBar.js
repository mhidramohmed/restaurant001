'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from './Logo'
import MainButton from './MainButton'
import { FaSignOutAlt } from 'react-icons/fa'
import { HiOutlineViewGrid } from 'react-icons/hi'
import { HiOutlineMenu } from 'react-icons/hi'
import { HiOutlineUser } from 'react-icons/hi'
import { HiOutlineShoppingCart } from 'react-icons/hi'
import { HiOutlineTag } from 'react-icons/hi'
import { HiOutlineTrash } from 'react-icons/hi'
import { HiOutlineChevronLeft, HiOutlineChevronRight  } from 'react-icons/hi'
import { LuCalendarClock } from "react-icons/lu"
import { usePathname } from 'next/navigation'

import { useAuth } from '@/hooks/auth'

const SideBar = ({ onToggle, isCollapsed }) => {
  const { logout } = useAuth()
  const pathname = usePathname()
  
  // Get the initial collapsed state from props with a default
  const [collapsed, setCollapsed] = useState(isCollapsed !== undefined ? isCollapsed : false)
  
  // Update local state when prop changes
  useEffect(() => {
    if (isCollapsed !== undefined) {
      setCollapsed(isCollapsed)
    }
  }, [isCollapsed])
  
  // Set initial collapsed state based on screen size only when component mounts
  useEffect(() => {
    const handleInitialResize = () => {
      const shouldCollapse = window.innerWidth < 768
      setCollapsed(shouldCollapse)
      
      // Notify parent component about the initial state
      if (onToggle) {
        onToggle(shouldCollapse)
      }
    }
    
    // Only set initial state if isCollapsed prop isn't provided
    if (isCollapsed === undefined) {
      handleInitialResize()
    }
  }, [onToggle, isCollapsed])

  const toggleSidebar = () => {
    const newCollapsedState = !collapsed
    setCollapsed(newCollapsedState)
    
    // Notify parent component about the toggle
    if (onToggle) {
      onToggle(newCollapsedState)
    }
  }

  return (
    <div 
      className={`h-full min-h-screen bg-background shadow-lg flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo and Toggle Button */}
      <div className="flex justify-between items-center p-4">
        {!collapsed && <Logo />}
        <button 
          onClick={toggleSidebar} 
          className="p-1 rounded-full hover:bg-secondary text-text"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? 
            <HiOutlineChevronRight className="text-xl" /> : 
            <HiOutlineChevronLeft className="text-xl" />
          }
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-2 flex-1 space-y-4 px-2 py-6">
        <Link href="/dashboard">
          <MainButton
            className={`w-full border-0 text-text hover:bg-secondary hover:text-primary ${
              pathname === '/dashboard' ? 'bg-secondary text-primary' : ''
            } ${collapsed ? 'justify-center' : 'flex items-center'}`}
          >
            <HiOutlineViewGrid className={`${collapsed ? '' : 'mr-2'} text-xl`} />
            {!collapsed && <span>Dashboard</span>}
          </MainButton>
        </Link>
        <Link href="/dashboard/menu">
          <MainButton
            className={`w-full border-0 text-text hover:bg-secondary hover:text-primary ${
              pathname === '/dashboard/menu' ? 'bg-secondary text-primary' : ''
            } ${collapsed ? 'justify-center' : 'flex items-center'}`}
          >
            <HiOutlineMenu className={`${collapsed ? '' : 'mr-2'} text-xl`} />
            {!collapsed && <span>Menu</span>}
          </MainButton>
        </Link>
        
        <Link href="/dashboard/orders">
          <MainButton
            className={`w-full border-0 text-text hover:bg-secondary hover:text-primary ${
              pathname === '/dashboard/orders' ? 'bg-secondary text-primary' : ''
            } ${collapsed ? 'justify-center' : 'flex items-center'}`}
          >
            <HiOutlineShoppingCart className={`${collapsed ? '' : 'mr-2'} text-xl`} />
            {!collapsed && <span>Orders</span>}
          </MainButton>
        </Link>
        <Link href="/dashboard/reservations">
          <MainButton
            className={`w-full border-0 text-text hover:bg-secondary hover:text-primary ${
              pathname === '/dashboard/reservations' ? 'bg-secondary text-primary' : ''
            } ${collapsed ? 'justify-center' : 'flex items-center'}`}
          >
            <LuCalendarClock className={`${collapsed ? '' : 'mr-2'} text-xl`} />
            {!collapsed && <span>Reservations</span>}
          </MainButton>
        </Link>
        <Link href="/dashboard/discounts">
          <MainButton
            className={`w-full border-0 text-text hover:bg-secondary hover:text-primary ${
              pathname === '/dashboard/discounts' ? 'bg-secondary text-primary' : ''
            } ${collapsed ? 'justify-center' : 'flex items-center'}`}
          >
            <HiOutlineTag className={`${collapsed ? '' : 'mr-2'} text-xl`} />
            {!collapsed && <span>Discounts</span>}
          </MainButton>
        </Link>
        <Link href="/dashboard/customers">
          <MainButton
            className={`w-full border-0 text-text hover:bg-secondary hover:text-primary ${
              pathname === '/dashboard/customers' ? 'bg-secondary text-primary' : ''
            } ${collapsed ? 'justify-center' : 'flex items-center'}`}
          >
            <HiOutlineUser className={`${collapsed ? '' : 'mr-2'} text-xl`} />
            {!collapsed && <span>Customers</span>}
          </MainButton>
        </Link>
        <Link href="/dashboard/trash">
          <MainButton
            className={`w-full border-0 text-text hover:bg-secondary hover:text-primary ${
              pathname === '/dashboard/trash' ? 'bg-secondary text-primary' : ''
            } ${collapsed ? 'justify-center' : 'flex items-center'}`}
          >
            <HiOutlineTrash className={`${collapsed ? '' : 'mr-2'} text-xl`} />
            {!collapsed && <span>Trashed</span>}
          </MainButton>
        </Link>
        
      </div>

      {/* Log Out Button at the bottom */}
      <div className="py-4 px-2 mt-auto">
        <MainButton
          onClick={logout}
          className={`w-full bg-primary text-background border-0 hover:bg-opacity-90 ${
            collapsed ? 'justify-center' : 'flex items-center'
          }`}
        >
          <FaSignOutAlt className={`${collapsed ? '' : 'mr-2'}`} />
          {!collapsed && <span>Logout</span>}
        </MainButton>
      </div>
    </div>
  )
}

export default SideBar