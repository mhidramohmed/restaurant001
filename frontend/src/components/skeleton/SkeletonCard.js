const SkeletonCard = () => {
    return (
      <div className="h-[350px] border border-gray-200 rounded-lg overflow-hidden animate-pulse">
        <div className="h-2/3 bg-gray-300" />
        <div className="h-1/3 p-4 flex flex-col justify-between">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-300 rounded w-1/2" />
          <div className="flex items-center justify-between mt-4">
            <div className="h-4 bg-gray-300 rounded w-1/4" />
            <div className="flex space-x-2">
              <div className="h-8 w-8 bg-gray-300 rounded-full" />
              <div className="h-8 w-8 bg-gray-300 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default SkeletonCard