'use client'

import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/navigation'
import SideBar from '@/components/SideBar'
import Loading from '@/app/(app)/Loading'

const AppLayout = ({ children }) => {
    const { user } = useAuth({ middleware: 'auth' })
    const router = useRouter()

    if (!user) {
        return <Loading />
    }

    if (user.role !== 'admin' && router.pathname === '/dashboard') {
        router.push('/orders')
        return null 
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="fixed top-0 left-0 h-screen w-64 bg-primary shadow-lg z-50">
                <SideBar />
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-6">
                {children}
            </main>
        </div>
    )
}

export default AppLayout
