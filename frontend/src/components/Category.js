// import Image from "next/image"
const Category = ({ categoryId, name, image, isActive, setActiveCategory }) => {
//   const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

//   const imageUrl = image?.startsWith('http')
    // ? image
    // : image.includes('CategoriesImages')
    //     ? `${baseURL}/${image.replace(/^\/+/, '')}`
    //     : `${baseURL}/CategoriesImages/${image.replace(/^\/+/, '')}`

  const handleClick = () => {
    const targetSection = document.getElementById(`category-${categoryId}`)
    if (targetSection) {
      const offset = 125
      const topPosition = targetSection.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top: topPosition, behavior: "smooth" })
      setActiveCategory(`category-${categoryId}`)
    }
  }

  return (
    <button
      onClick={handleClick}
      data-id={`category-${categoryId}`}
      className={`flex items-center space-x-4 p-3 border border-primary rounded-full cursor-pointer hover:bg-primary hover:text-background transition-all duration-200 ${
        isActive ? "bg-primary text-background" : "bg-background text-text"
      }`}
    >
      <div className="w-12 h-12 rounded-full overflow-hidden">
        <img
          src={image}
          alt={name}
          //width={150}
          //height={150}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="font-medium pr-2">{name}</p>
    </button>
  )
}

export default Category
