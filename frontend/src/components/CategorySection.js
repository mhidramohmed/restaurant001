import Card from './Card';

const CategorySection = ({ categoryName, categoryId }) => {
  // Mock data for items
  const allItems = [
    { id: 1, imgSrc: 'https://via.placeholder.com/150', title: 'Pizza', price: 12.99, categoryId: 1 },
    { id: 2, imgSrc: 'https://via.placeholder.com/150', title: 'Burger', price: 8.99, categoryId: 1 },
    { id: 3, imgSrc: 'https://via.placeholder.com/150', title: 'Sushi', price: 14.99, categoryId: 2 },
    { id: 4, imgSrc: 'https://via.placeholder.com/150', title: 'Pasta', price: 10.99, categoryId: 2 },
    { id: 5, imgSrc: 'https://via.placeholder.com/150', title: 'Salad', price: 6.99, categoryId: 3 },
    { id: 6, imgSrc: 'https://via.placeholder.com/150', title: 'Tacos', price: 8.99, categoryId: 1 },
    { id: 7, imgSrc: 'https://via.placeholder.com/150', title: 'Tajine', price: 8.99, categoryId: 2 },
    { id: 8, imgSrc: 'https://via.placeholder.com/150', title: 'Couscous', price: 8.99, categoryId: 2 },
  ];

  // Filter items based on categoryId
  const categoryItems = allItems.filter(item => item.categoryId === categoryId);

  return (
    <section className="my-8 px-2 md:px-4 lg:px-6">
      <h2 className="text-3xl font-bold text-primary mb-4">
        {categoryName}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categoryItems.map((item) => (
          <Card
            key={item.id}
            imgSrc={item.imgSrc}
            title={item.title}
            price={item.price}
            onAddToCart={() => console.log(`Added ${item.title} to cart`)}
            onDetails={() => console.log(`Details for ${item.title}`)}
          />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
