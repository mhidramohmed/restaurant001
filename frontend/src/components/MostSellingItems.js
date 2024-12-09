'use client'
import axios from '@/lib/axios'
import useSWR from 'swr'
// import Image from 'next/image'

const fetcher = async (url) => {
    const response = await axios.get(url, { withCredentials: true })
    return response.data.data || response.data
}

const MostSellingItems = () => {
  const { data: data, error, isLoading } = useSWR('/api/order-elements', fetcher)

  if (error) return <div>Error loading items</div>

  if (!data || isLoading) {
    return <div>Loading...</div>
  }

  const itemSales = {}
  data.forEach((element) => {
    const { menu_item_id, quantity, menu_item } = element
    if (!menu_item) return

    if (!itemSales[menu_item_id]) {
      itemSales[menu_item_id] = { ...menu_item, totalQuantity: 0 }
    }
    itemSales[menu_item_id].totalQuantity += quantity
  })

  const sortedItems = Object.values(itemSales).sort((a, b) => b.totalQuantity - a.totalQuantity)

  const limitedItems = sortedItems.slice(0, 5)

//   const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

  return (
    <div className="flex flex-col w-1/3 bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text">Most Selling Items</h2>
      </div>

      <div className="flex-1 overflow-y-auto mt-4">
        {limitedItems.length === 0 ? (
          <p className="text-center text-text">No sales data available.</p>
        ) : (
          <ul className="w-full space-y-4">
            {limitedItems.map((item) => (
              <li key={item.id} className="border-t pt-4">
                <div className="flex items-center gap-4">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name || 'Unnamed Item'}
                    //   width={50}
                    //   height={50}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded">
                      <span className="text-sm text-gray-500">No Image</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-text">{item.name || 'Unnamed Item'}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-text">Sold: {item.totalQuantity}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default MostSellingItems
