import Link from 'next/link'
import Logo from '@/components/Logo'
import { useAuth } from '@/hooks/auth'

const Navigation = () => {
    const { logout } = useAuth()

    return (
        <header className="bg-background border-b border-primary p-4">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                {/* Logo and Page Title */}
                <div className="flex items-center space-x-4">
                    <Link href="/">
                        <Logo />
                    </Link>
                </div>

                {/*Logout */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={logout}
                        className="bg-primary text-background text-sm py-2 px-4 rounded-md hover:bg-opacity-90 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Navigation
