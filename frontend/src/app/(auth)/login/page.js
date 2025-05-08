'use client'

import MainButton from '@/components/MainButton'
import InputError from '@/components/InputError'
import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthSessionStatus from '@/app/(auth)/AuthSessionStatus'
import Logo from '@/components/Logo'
import bgImage from '@/assets/img/bonsai-bg.jpg'

const Login = () => {
    const router = useRouter()
    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (router.reset?.length > 0 && errors.length === 0) {
            setStatus(atob(router.reset))
        } else {
            setStatus(null)
        }
    })

    const submitForm = async event => {
        event.preventDefault()
        setIsLoading(true)
        
        try {
            await login({
                email,
                password,
                remember: false, // Removed the remember option
                setErrors,
                setStatus,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-cover bg-center" 
            style={{ backgroundImage: `url(${bgImage.src})` }}>
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <div className="flex items-center justify-center mb-6 text-center">
                    <Logo className="mx-auto" />
                </div>
                <AuthSessionStatus className="mb-4" status={status} />
                <form onSubmit={submitForm}>
                    {/* Email Address */}
                    <div>
                        <label htmlFor="email" className="block text-text font-medium">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            className="block mt-2 w-full p-3 bg-secondary text-text rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-primary"
                            onChange={event => setEmail(event.target.value)}
                            required
                            autoFocus
                            disabled={isLoading}
                        />
                        <InputError messages={errors.email} className="mt-2 text-sm text-red-500" />
                    </div>

                    {/* Password */}
                    <div className="mt-4">
                        <label htmlFor="password" className="block text-text font-medium">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            className="block mt-2 w-full p-3 bg-secondary text-text rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-primary"
                            onChange={event => setPassword(event.target.value)}
                            required
                            autoComplete="current-password"
                            disabled={isLoading}
                        />
                        <InputError messages={errors.password} className="mt-2 text-sm text-red-500" />
                    </div>

                    {/* Submit Button with loading state */}
                    <div className="mt-6">
                        <MainButton 
                            type="submit" 
                            className="w-full py-3 bg-primary text-background rounded-lg hover:bg-primary-dark transition flex justify-center items-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : 'Login'}
                        </MainButton>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login