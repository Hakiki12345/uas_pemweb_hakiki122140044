import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import StarRating from "../ui/StarRating";
import { useState } from "react";

const ProductCard = ({ product }) => {
  const { addToCart, favorites, addToFavorites, removeFromFavorites } =
    useAppContext();
  const isFavorite = favorites.some((item) => item.id === product.id);
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    addToCart(product);
    setTimeout(() => setIsAddingToCart(false), 600);
  };

  const hasDiscount = product.discountPercentage > 0;
  const originalPrice = hasDiscount
    ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  return (
    <div
      className="relative group rounded-xl overflow-hidden bg-white transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl"
      style={{
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {product.isNew && (
        <div className="absolute top-3 left-3 z-10 bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded-full">
          NEW
        </div>
      )}
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full">
          {product.discountPercentage}% OFF
        </div>
      )}

      <div className="relative overflow-hidden aspect-square bg-gray-50">
        <Link to={`/products/${product.id}`}>
          <div className="absolute inset-0 flex items-center justify-center p-4 transition-opacity duration-300">
            <img
              src={product.image}
              alt={product.title}
              className={`object-contain max-h-full transition-transform duration-500 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
            />
          </div>

          <div
            className={`absolute inset-0 bg-opacity-40 flex items-center justify-center opacity-0 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : ""
            }`}
          >
            <span className="text-white font-medium px-4 py-2 rounded-full bg-black bg-opacity-60 text-sm">
              Quick View
            </span>
          </div>
        </Link>

        <button
          onClick={handleFavoriteToggle}
          className={`absolute top-3 right-3 z-10 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isFavorite
              ? "bg-red-500 text-white shadow-md"
              : "bg-white text-gray-500 hover:text-red-500"
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <span className="material-icons text-lg">
            {isFavorite ? "favorite" : "favorite_border"}
          </span>
        </button>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center">
          <StarRating
            rating={product.rating.rate}
            count={product.rating.count}
          />
          <span className="text-gray-500 text-xs ml-2">
            ({product.rating.count})
          </span>
        </div>

        <Link to={`/products/${product.id}`}>
          <h3 className="font-medium text-gray-800 mb-1 line-clamp-1 hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center">
            <span className="font-bold text-lg text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-gray-400 text-sm line-through ml-2">
                ${originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white py-4 px-4 transform transition-transform duration-300 ${
          isHovered ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="w-full bg-white text-blue-600 rounded-full py-2 font-medium text-sm hover:bg-blue-50 transition-colors cursor-pointer"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    rating: PropTypes.shape({
      rate: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired,
    }).isRequired,
    discountPercentage: PropTypes.number,
    isNew: PropTypes.bool,
  }).isRequired,
};

ProductCard.defaultProps = {
  product: {
    discountPercentage: 0,
    isNew: false,
  },
};

export default ProductCard;
