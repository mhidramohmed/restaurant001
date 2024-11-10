'use client'

import MainButton from '@/components/MainButton'
import InputError from '@/components/InputError'
import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthSessionStatus from '@/app/(auth)/AuthSessionStatus'
import Logo from '@/components/Logo'
import Image from 'next/image';
import bgImage from '@/assets/img/bonsai-bg.jpg'

const Login = () => {
    const router = useRouter()

    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [shouldRemember, setShouldRemember] = useState(false)
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)

    useEffect(() => {
        if (router.reset?.length > 0 && errors.length === 0) {
            setStatus(atob(router.reset))
        } else {
            setStatus(null)
        }
    })

    const submitForm = async event => {
        event.preventDefault()

        login({
            email,
            password,
            remember: shouldRemember,
            setErrors,
            setStatus,
        })
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-cover bg-center" 
        style={{ backgroundImage: `url(${bgImage.src})` }}
        >
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
                        />
                        <InputError messages={errors.password} className="mt-2 text-sm text-red-500" />
                    </div>

                    {/* Remember Me */}
                    <div className="block mt-4">
                        <label htmlFor="remember_me" className="inline-flex items-center">
                            <input
                                id="remember_me"
                                type="checkbox"
                                name="remember"
                                className="rounded border-gray-300 text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                onChange={event => setShouldRemember(event.target.checked)}
                            />
                            <span className="ml-2 text-sm text-text">Remember me</span>
                        </label>
                    </div>

                    {/* Forgot Password Link */}
                    <div className="flex items-center justify-between mt-4">
                        {/* Submit Button */}
                        <MainButton type="submit" className="w-full py-3 bg-primary text-background rounded-lg hover:bg-primary-dark transition">
                            Login
                        </MainButton>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
