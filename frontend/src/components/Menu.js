"use client";
import CategorySection from "./CategorySection"

export default function Menu() {
  return (
    <div>
      <CategorySection categoryName="Popular Dishes" categoryId={1} />
      <CategorySection categoryName="Specials" categoryId={2} />
      <CategorySection categoryName="Healthy Options" categoryId={3} />
    </div>
  )
}
