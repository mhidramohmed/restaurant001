'use client'

import { useAuth } from '@/hooks/auth'
import Navigation from '@/app/(app)/Navigation'
import Loading from '@/app/(app)/Loading'
import { useRouter } from 'next/navigation'

const AppLayout = ({ children }) => {
    const { user } = useAuth({ middleware: 'auth' })
    const router = useRouter()

    if (!user) {
        return <Loading />
    }

    // Restrict dashboard to admin role only
    if (user.role !== 'admin' && router.pathname === '/dashboard') {
        router.push('/orders')
        console.log('redirecting to orders page')
        return null // Return null to prevent rendering
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation user={user} />

            <main>{children}</main>
        </div>
    )
}

export default AppLayout
