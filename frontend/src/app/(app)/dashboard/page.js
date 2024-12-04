'use client'

import useSWR from 'swr'
import axios from '@/lib/axios'
import { LuShoppingCart } from 'react-icons/lu'
import { MdAttachMoney } from 'react-icons/md'
import { AiOutlineLoading } from 'react-icons/ai'
import { IoWarningOutline } from 'react-icons/io5'

import MostSellingItems from '@/components/MostSellingItems'

const fetcher = async (url) => {
    const response = await axios.get(url, { withCredentials: true })
    return response.data.data || response.data
}

const Dashboard = () => {
  const { data: orders, error, isLoading } = useSWR('/api/orders', fetcher)
  // const { data: mostSellingProducts, error: productsError, isLoading: isLoadingProducts } = useSWR('/api/most-selling-products', fetcher);

  const calculateStats = (orders = []) => {
    let totalOrders = 0
    let totalProfit = 0
    let declinedOrders = 0

    orders.forEach((order) => {
      totalOrders += 1
      if (order.payment_status === 'paid') {
        totalProfit += parseFloat(order.total_price)
      }
      if (order.status === 'declined') {
        declinedOrders += 1
      }
    })

    return { totalOrders, totalProfit, declinedOrders }
  }

  const stats = orders
    ? calculateStats(orders)
    : { totalOrders: 0, totalProfit: 0, declinedOrders: 0 }

  if (isLoading) {
    return (
      <div className="text-center text-primary">
        <AiOutlineLoading className="animate-spin text-3xl mx-auto" />
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Error loading data.</p>
      </div>
    )
  }

  return (
    <div className="py-2 px-6 space-y-8">
      {/* Dashboard Overview */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-secondary p-4 rounded-lg shadow-md text-center flex items-center justify-between">
          <LuShoppingCart className="text-4xl text-primary" />
          <div>
            <h2 className="text-xl font-semibold text-text">Total Orders</h2>
            <p className="text-3xl font-bold text-primary">
              {stats.totalOrders}
            </p>
          </div>
        </div>

        <div className="bg-secondary p-4 rounded-lg shadow-md text-center flex items-center justify-between">
          <MdAttachMoney className="text-4xl text-primary" />
          <div>
            <h2 className="text-xl font-semibold text-text">Total Profit</h2>
            <p className="text-3xl font-bold text-primary">
              {stats.totalProfit.toFixed(2)} Dhs
            </p>
          </div>
        </div>

        <div className="bg-secondary p-4 rounded-lg shadow-md text-center flex items-center justify-between">
          <IoWarningOutline className="text-4xl text-red-500" />
          <div>
            <h2 className="text-xl font-semibold text-text">
              Declined Orders
            </h2>
            <p className="text-3xl font-bold text-red-500">
              {stats.declinedOrders}
            </p>
          </div>
        </div>
      </div>

      {/* Latest Orders and Most Selling Products */}
      <div className="flex space-x-6 mt-8">
        {/* Latest Orders Table */}
        <div className="w-2/3 bg-white p-4 rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-text mb-4">Latest Orders</h2>
  {orders ? (
    <table className="min-w-full border-collapse">
      <thead>
        <tr className="bg-primary text-white">
          <th className="py-3 px-4 text-left">Order ID</th>
          <th className="py-3 px-4 text-left">Client</th>
          <th className="py-3 px-4 text-left">Phone</th>
          <th className="py-3 px-4 text-left">Total</th>
        </tr>
      </thead>
      <tbody>
        {/* Sort by timestamp descending and slice top 5 */}
        {orders
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) 
          .slice(0, 10)
          .map((order) => (
            <tr key={order.id} className="hover:bg-gray-100">
              <td className="py-3 px-4">{order.id}</td>
              <td className="py-3 px-4">{order.client_name}</td>
              <td className="py-3 px-4">{order.client_phone}</td>
              <td className="py-3 px-4">{order.total_price} Dhs</td>
            </tr>
          ))}
      </tbody>
    </table>
  ) : (
    <p className="text-primary">No orders available.</p>
  )}
</div>



        {/* Most Selling Products */}
        
        <MostSellingItems />
      </div>
    </div>
  )
}

export default Dashboard
