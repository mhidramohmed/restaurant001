"use client"
import { useState } from 'react'
import MainButton from '@/components/MainButton'
import useSWR from 'swr'
import axios from '@/lib/axios'
import AdminCategoryCard from '@/components/AdminCategoryCard'
import AddCategoryModal from '@/components/AddCategoryModal'
import { toast } from 'react-toastify'
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable'

const fetcher = (url) => axios.get(url).then((res) => res.data.data)

const CategoryBar = () => {
  const { data: categories, error, mutate } = useSWR('/api/categories', fetcher)
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  const [isReordering, setIsReordering] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Require 5px movement before dragging starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  if (error) {
    toast.error('Failed to load categories')
    return <div>Failed to load categories</div>
  }

  if (!categories) return <div>Loading...</div>

  const handleDragEnd = async (event) => {
    const { active, over } = event
    
    if (active.id !== over.id) {
      const oldIndex = categories.findIndex(cat => cat.id === active.id)
      const newIndex = categories.findIndex(cat => cat.id === over.id)
      
      const reorderedCategories = arrayMove(categories, oldIndex, newIndex)
      
      // Update local state immediately for responsive UI
      mutate(reorderedCategories, false)
      
      // Send update to server
      try {
        await axios.post('/api/categories/reorder', {
          categories: reorderedCategories.map((cat, index) => ({
            id: cat.id,
            order: index + 1
          }))
        })
        mutate() // Revalidate with server data
      } catch (err) {
        toast.error('Failed to save new order')
        mutate() // Revert to server state
      }
    }
  }

  const handleCategoryAddSuccess = () => {
    setShowAddCategoryModal(false)
    mutate()
  }

  return (
    <div>
      <header className="bg-background pb-4 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Categories</h1>
          <div className="flex gap-2">
            <MainButton
              className={`${isReordering ? 'bg-green-600' : 'bg-secondary'} ${isReordering ? 'text-background' : 'text-primary-light'} border-2 border-secondary hover:bg-opacity-90 transition`}
              onClick={() => setIsReordering(!isReordering)}
            >
              {isReordering ? 'Done Reordering' : 'Reorder Categories'}
            </MainButton>
            <MainButton
              className="bg-primary text-background border-2 border-primary hover:bg-opacity-90 transition"
              onClick={() => setShowAddCategoryModal(true)}
            >
              Add New Category
            </MainButton>
          </div>
        </div>
      </header>
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCorners} // Changed from closestCenter
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={categories}
          strategy={rectSortingStrategy} // Changed from verticalListSortingStrategy
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 bg-background py-2 px-2 md:px-4 lg:px-6">
            {categories.map((category) => (
              <AdminCategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                image={category.image}
                isReordering={isReordering}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {showAddCategoryModal && (
        <AddCategoryModal
          onClose={() => setShowAddCategoryModal(false)}
          onSuccess={handleCategoryAddSuccess}
        />
      )}
    </div>
  )
}

export default CategoryBar