export const metadata = {
    title: 'Laravel',
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
