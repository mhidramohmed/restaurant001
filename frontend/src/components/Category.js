const Category = ({ categoryId, name, image, isActive, setActiveCategory }) => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const imageUrl = image?.startsWith('http')
    ? image
    : image.includes('CategoriesImages')
        ? `${baseURL}/${image.replace(/^\/+/, '')}`
        : `${baseURL}/CategoriesImages/${image.replace(/^\/+/, '')}`;

  const handleClick = () => {
    const targetSection = document.getElementById(`category-${categoryId}`);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
      // Update active category
      setActiveCategory(`category-${categoryId}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      data-id={`category-${categoryId}`}
      className={`flex items-center space-x-4 p-3 border border-primary rounded-full cursor-pointer hover:bg-primary hover:text-background ${
        isActive ? "bg-primary text-background" : "bg-background text-text"
      }`}
    >
      <div className="w-12 h-12 rounded-full overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="font-medium pr-2">{name}</p>
    </button>
  );
};

export default Category;
