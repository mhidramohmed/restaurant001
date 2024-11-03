// CategoryBar.js
import Category from './Category';

// Categories with color placeholders for testing
const categories = [
    { title: 'Pizza', color: '#F87171' },   // Light Red
    { title: 'Burgers', color: '#FBBF24' }, // Amber
    { title: 'Sushi', color: '#34D399' },   // Green
    { title: 'Desserts', color: '#60A5FA' },// Blue
    { title: 'Drinks', color: '#A78BFA' },  // Purple
  ];

const CategoryBar = () => {
  return (
    <div className="flex overflow-x-auto bg-background py-4 px-2 md:px-4 lg:px-6 space-x-4">
      {categories.map((category, index) => (
        <Category
          key={index}
          title={category.title}
        //   imgSrc={category.imgSrc}
        color={category.color}
        />
      ))}
    </div>
  );
};

export default CategoryBar;
