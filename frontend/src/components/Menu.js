import CategorySection from "./CategorySection";
import useSWR from "swr";
import axios from "@/lib/axios";
import SkeletonCategory from "./skeleton/SkeletonCategory";
import SkeletonCard from "./skeleton/SkeletonCard";

const fetcher = (url) => axios.get(url).then((res) => res.data.data);

export default function Menu({ searchTerm }) {
  const { data: categories, error } = useSWR("/api/categories", fetcher);

  if (error) return <div>Failed to load categories</div>;

  if (!categories) {
    return (
      <div className="space-y-8">
        {Array(3).fill(null).map((_, categoryIndex) => (
          <div 
            key={`skeleton-category-section-${categoryIndex}`} 
            className="px-2 md:px-4 lg:px-6"
          >
            {/* Skeleton category title */}
            <div className="h-8 bg-gray-300 rounded w-1/3 md:w-1/6 mb-4"></div>

            {/* Skeleton cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(4).fill(null).map((_, cardIndex) => (
                <SkeletonCard 
                  key={`skeleton-card-${categoryIndex}-${cardIndex}`} 
                  isLoading={true} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {categories.map((category) => (
        <CategorySection
          key={category.id}
          categoryName={category.name}
          categoryId={category.id}
          searchTerm={searchTerm}
        />
      ))}
    </div>
  );
}