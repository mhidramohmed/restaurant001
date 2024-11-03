'use client';
// import LoginLinks from '@/app/LoginLinks'
import Header from '@/components/Header';
import CategoryBar from '@/components/CategoryBar';
// import MainButton from '@/components/MainButton'
import Menu from '@/components/Menu';


const Home = () => {
    return (
        <>
            <div className="flex w-full h-screen bg-background">
                <main className="w-3/4 bg-background"> {/* Use your custom background color */}
                    <Header />
                    {/* Sticky Category Bar with a larger shadow */}
                    <div className="sticky top-0 z-10 bg-background shadow-md p-4">
                        <CategoryBar />
                    </div>
                    <Menu />
                </main>
                {/* Shopping Cart with a stronger shadow */}
                <aside className="fixed right-0 top-0 w-1/4 h-full p-4 bg-background shadow-xl overflow-y-auto z-10">
                    <h2 className="text-xl font-bold">Shopping Cart</h2>
                    {/* Add your shopping cart content here */}
                    {/* <MainButton className='bg-primary text-background'>Add Item</MainButton> */}
                </aside>
                {/* <LoginLinks /> */}
            </div>
        </>
    )
}

export default Home;
