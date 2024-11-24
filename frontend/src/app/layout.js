import { Nunito } from 'next/font/google'
import '@/app/global.css'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CartProvider } from '@/contexts/CartContext';

const nunitoFont = Nunito({
    subsets: ['latin'],
    display: 'swap',
})

const RootLayout = ({ children }) => {
    return (
        <html lang="en" className={nunitoFont.className}>
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
    title: 'restaurant001',
}

export default RootLayout
