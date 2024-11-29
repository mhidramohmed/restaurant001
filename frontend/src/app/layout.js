import { Poppins } from 'next/font/google'
import '@/app/global.css'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CartProvider } from '@/contexts/CartContext';

const poppinsFont = Poppins({
    weight: '500',
    subsets: ['latin'],
    display: 'swap',
})

const RootLayout = ({ children }) => {
    return (
        <html lang="en" className={poppinsFont.className}>
            <body className="antialiased bg-background">
            <CartProvider>
                <ToastContainer />
                {children}
            </CartProvider>
            </body>
        </html>
    )
}

export const metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME,
}

export default RootLayout
