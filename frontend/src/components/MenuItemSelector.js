import { useState, useEffect, useRef } from 'react'

const MenuItemSelector = ({ selectedItems, menuItems, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [filteredItems, setFilteredItems] = useState([])
  const dropdownRef = useRef(null)

  // Update filtered items when search term or menu items change
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredItems(menuItems)
    } else {
      const filtered = menuItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredItems(filtered)
    }
  }, [searchTerm, menuItems])

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Add an item to selection
  const handleSelectItem = (itemId) => {
    if (!selectedItems.includes(itemId)) {
      onChange([...selectedItems, itemId])
    }
    setSearchTerm('')
  }

  // Remove an item from selection
  const handleRemoveItem = (itemId) => {
    onChange(selectedItems.filter(id => id !== itemId))
  }

  // Find item name by ID
  const getItemNameById = (itemId) => {
    const item = menuItems.find(item => item.id.toString() === itemId)
    return item ? item.name : ''
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected items display */}
      <div className="mb-2 flex flex-wrap gap-2">
        {selectedItems.map(itemId => (
          <div key={itemId} className="bg-gray-100 rounded-full px-3 py-1 flex items-center text-sm">
            <span>{getItemNameById(itemId)}</span>
            <button
              type="button"
              onClick={() => handleRemoveItem(itemId)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {/* Search input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder="Search menu items..."
          className="w-full p-2 border border-gray-300 rounded"
        />
        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item.id.toString())}
                  className={`p-2 hover:bg-gray-100 cursor-pointer ${
                    selectedItems.includes(item.id.toString()) ? 'bg-gray-50 text-gray-400' : ''
                  }`}
                >
                  {item.name}
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-500">No matching items found</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MenuItemSelector