import { Link } from "react-router-dom";
import ProductCard from "../common/ProductCard";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorDisplay from "../ui/ErrorDisplay";

const ProductSection = ({ 
  title, 
  subtitle, 
  products, 
  loading, 
  error, 
  enhanceProduct,
  linkTo = "/products" 
}) => {
  return (
    <section className="container mx-auto mt-16 sm:mt-24 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-2xl sm:text-3xl font-bold relative inline-block">
            {title}
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-600/30 rounded-full"></span>
          </h2>
          <p className="text-gray-600 mt-2">{subtitle}</p>
        </div>
        <Link
          to={linkTo}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center group"
        >
          <span>Lihat Semua</span>
          <span className="material-icons ml-1 transform group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </Link>
      </div>

      {loading && (
        <div className="py-10 flex justify-center">
          <LoadingSpinner />
        </div>
      )}

      {error && <ErrorDisplay message={error} />}

      {products && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={enhanceProduct ? enhanceProduct(product, idx) : product}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductSection;