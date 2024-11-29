export const metadata = {
    title: 'Login | ' + process.env.NEXT_PUBLIC_APP_NAME,
}

const Layout = ({ children }) => {
    return (
        <div>
            <div className="text-gray-900 antialiased">
                    {children}
            </div>
        </div>
    )
}

export default Layout
