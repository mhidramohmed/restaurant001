'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/navigation'
import SideBar from '@/components/SideBar'
import Loading from '@/app/(app)/Loading'

const AppLayout = ({ children }) => {
    const { user } = useAuth({ middleware: 'auth' })
    const router = useRouter()
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    // Initialize sidebar state based on screen size
    useEffect(() => {
        setSidebarCollapsed(window.innerWidth < 768)
    }, [])

    if (!user) {
        return <Loading />
    }

    if (user.role !== 'admin' && router.pathname === '/dashboard') {
        router.push('/orders')
        return null 
    }

    // Handle sidebar toggle from child component
    const handleSidebarToggle = (collapsed) => {
        setSidebarCollapsed(collapsed)
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-screen z-50 transition-all duration-300 ${
                sidebarCollapsed ? 'w-16' : 'w-64'
            }`}>
                <SideBar 
                    onToggle={handleSidebarToggle} 
                    isCollapsed={sidebarCollapsed} 
                />
            </aside>

            {/* Main Content */}
            <main className={`flex-1 p-6 transition-all duration-300 ${
                sidebarCollapsed ? 'ml-16' : 'ml-64'
            }`}>
                {children}
            </main>
        </div>
    )
}

export default AppLayout