'use client';
import Header from '@/components/Header';
import CategoryBar from '@/components/CategoryBar';
import ShoppingCart from '@/components/ShoppingCart';
import Menu from '@/components/Menu';


const Home = () => {
    return (
        <>
            <div className="flex w-full h-screen bg-background">
                <main className="w-3/4 bg-background">
                    <Header />
                    <div className="sticky top-0 z-10 bg-background shadow-md p-4">
                        <CategoryBar />
                    </div>
                    <Menu />
                </main>
                <aside className="fixed right-0 top-0 w-1/4 h-full p-4 bg-background shadow-xl overflow-y-auto z-10">
                    <ShoppingCart />
                </aside>
            </div>
        </>
    )
}

export default Home;
