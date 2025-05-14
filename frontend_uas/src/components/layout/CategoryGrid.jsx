import { Link } from "react-router-dom";

const CategoryGrid = () => {
  const categories = [
    {
      id: 1,
      name: "Pria",
      slug: "men's clothing",
      image:
        "https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      gradientFrom: "blue-900/80",
      gradientVia: "blue-900/50",
      buttonBg: "blue-600/80",
    },
    {
      id: 2,
      name: "Wanita",
      slug: "women's clothing",
      image: "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg",
      gradientFrom: "purple-900/80",
      gradientVia: "purple-900/50",
      buttonBg: "purple-600/80",
    },
    {
      id: 3,
      name: "Aksesoris",
      slug: "jewelery",
      image:
        "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      gradientFrom: "amber-900/80",
      gradientVia: "amber-900/50",
      buttonBg: "amber-600/80",
    },
    {
      id: 4,
      name: "Elektronik",
      slug: "electronics",
      image:
        "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      gradientFrom: "gray-900/80",
      gradientVia: "gray-900/50",
      buttonBg: "gray-600/80",
    },
  ];

  return (
    <section className="container mx-auto mt-16 sm:mt-24 px-4">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold relative inline-block">
          Kategori Populer
          <span className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-600/30 rounded-full"></span>
        </h2>
        <p className="text-gray-600 mt-3">
          Temukan koleksi yang sesuai dengan gaya Anda
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/products?category=${category.slug}`}
            className="category-card group"
          >
            <div className="relative rounded-xl overflow-hidden shadow-lg h-60 transform transition-all duration-500 group-hover:shadow-xl">
              <div
                className={`absolute inset-0 bg-gradient-to-t from-${category.gradientFrom} via-${category.gradientVia} to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500`}
              ></div>
              <img
                src={category.image}
                alt={`Kategori ${category.name}`}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
                <span className="text-white text-xl sm:text-2xl font-bold block mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {category.name}
                </span>
                <div className="flex items-center mt-1 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span
                    className={`text-white text-sm bg-${category.buttonBg} px-3 py-1 rounded-full`}
                  >
                    Lihat Koleksi
                  </span>
                  <span className="material-icons text-white ml-1">
                    arrow_forward
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
