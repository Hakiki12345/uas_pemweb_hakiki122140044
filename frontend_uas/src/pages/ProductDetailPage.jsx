import React, { useState, useEffect } from "react";  
import { useParams, useNavigate } from "react-router-dom";  
import PropTypes from 'prop-types';  
import useFetch from "../hooks/useFetch";  
import { useAppContext } from "../context/AppContext";  
import LoadingSpinner from "../components/ui/LoadingSpinner";  
import ErrorDisplay from "../components/ui/ErrorDisplay";  
import StarRating from "../components/ui/StarRating";  
import SimpleProductCard from "../components/common/SimpleProductCard";  

const ProductDetailPage = () => {  
  const { id } = useParams();  
  const navigate = useNavigate();  
  const {  
    data: product,  
    loading,  
    error,  
  } = useFetch(`https://fakestoreapi.com/products/${id}`);  
  
  const {   
    addToCart,   
    favorites,   
    addToFavorites,   
    removeFromFavorites   
  } = useAppContext();  

  const [quantity, setQuantity] = useState(1);  
  const [isFavorite, setIsFavorite] = useState(false);  
  const [activeImage, setActiveImage] = useState(null);  
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);  
  const buttonHoverClass = "transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95";  
  const cardTransitionClass = "transition-all duration-500 ease-in-out";  

  useEffect(() => {  
    setIsFavorite(  
      product ? favorites.some((item) => item.id === product.id) : false  
    );  
  }, [product, favorites]);  

  const handleAddToCart = () => {  
    if (!product) {  
      console.error("Product not available");  
      return;  
    }  
    
    Array.from({ length: quantity }).forEach(() => addToCart(product));  
  };  

  const handleFavoriteToggle = () => {  
    if (!product) return;  
    
    isFavorite   
      ? removeFromFavorites(product.id)  
      : addToFavorites(product);  
  };  

  const handleQuantityChange = (e) => {  
    const value = parseInt(e.target.value, 10);  
    setQuantity(Math.max(1, value));  
  };  

  const {   
    data: relatedProducts,   
    loadingRelated   
  } = useFetch(  
    product   
      ? `https://fakestoreapi.com/products/category/${product.category}`  
      : null  
  );  

  const handleImageZoom = (img) => {  
    setActiveImage(img);  
    setIsImageEnlarged(true);  
  };  

  const closeImageZoom = () => {  
    setIsImageEnlarged(false);  
    setTimeout(() => setActiveImage(null), 300);  
  };  

  if (loading) return <LoadingSpinner fullPage />;  
  if (error) return <ErrorDisplay message={error} />;  
  if (!product) return null;  

  return (  
    <div   
      className={`container mx-auto px-4 py-8 mt-18 ${cardTransitionClass}`}  
    >  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">  
        <div className="space-y-6">  
          <div   
            className={`bg-gray-100 rounded-2xl p-8 flex items-center justify-center overflow-hidden ${cardTransitionClass}`}  
          >  
            <img   
              src={product.image}   
              alt={product.title}  
              className={`max-h-96 object-contain cursor-zoom-in   
                hover:scale-110   
                transition-transform   
                duration-500   
                ease-in-out`}  
              onClick={() => handleImageZoom(product.image)}  
            />  
          </div>  
        </div>  

        <div className="space-y-6">  
          <div   
            className={`transform transition-all duration-500   
              ${isImageEnlarged ? 'opacity-50' : 'opacity-100'}`}  
          >  
            <div className="flex justify-between items-start mb-4">  
              <h1 className="text-3xl font-bold text-gray-800">  
                {product.title}  
              </h1>  
              <button   
                onClick={handleFavoriteToggle}  
                className={`text-3xl transition-colors ${  
                  isFavorite   
                    ? "text-red-500 hover:text-red-600"   
                    : "text-gray-400 hover:text-gray-600"  
                } ${buttonHoverClass}`}  
              >  
                {isFavorite ? '♥' : '♡'}  
              </button>  
            </div>  

            <div className="flex items-center space-x-4 mb-4">  
              <span className="text-2xl font-bold text-blue-600">  
                ${product.price.toFixed(2)}  
              </span>  
              <StarRating   
                rating={product.rating.rate}   
                count={product.rating.count}   
              />  
            </div>  

            <div className="prose max-w-none mb-6">  
              <h3 className="text-xl font-semibold">Description</h3>  
              <p className="text-gray-700">{product.description}</p>  
            </div>  

            <div className="flex items-center space-x-4 mb-6">  
              <label className="font-semibold">Quantity:</label>  
              <input  
                type="number"  
                min="1"  
                value={quantity}  
                onChange={handleQuantityChange}  
                className="w-20 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"  
              />  
            </div>  

            <div className="flex space-x-4">  
              <button  
                onClick={handleAddToCart}  
                className={`flex-1 bg-blue-600 text-white py-3 rounded-lg   
                  hover:bg-blue-700   
                  transition-colors   
                  ${buttonHoverClass}`}  
              >  
                Add to Cart  
              </button>  
              <button  
                onClick={() => navigate(-1)}  
                className={`flex-1 border border-gray-300 py-3 rounded-lg   
                  hover:bg-gray-100   
                  ${buttonHoverClass}`}  
              >  
                Back to Products  
              </button>  
            </div>  
          </div>  
        </div>  
      </div>  

      <section className="mt-16">  
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>  
        {loadingRelated ? (  
          <LoadingSpinner />  
        ) : (  
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">  
            {relatedProducts  
              ?.filter((item) => item.id !== product.id)  
              .slice(0, 5)  
              .map((item) => (  
                <SimpleProductCard key={item.id} product={item} />  
              ))}  
          </div>  
        )}  
      </section>  

      {activeImage && (  
        <div   
          className={`fixed inset-0 z-50 flex items-center justify-center   
            bg-black/80   
            transition-all   
            duration-300   
            ease-in-out   
            ${isImageEnlarged ? 'opacity-100' : 'opacity-0'}`}  
          onClick={closeImageZoom}  
        >  
          <div   
            className={`max-w-[90%] max-h-[90%] transform transition-all duration-500   
              ${isImageEnlarged   
                ? 'scale-100 opacity-100'   
                : 'scale-50 opacity-0'}`}  
          >  
            <img  
              src={activeImage}  
              alt="Zoomed Product"  
              className="w-full h-full object-contain"  
            />  
          </div>  
        </div>  
      )}  
    </div>  
  );  
};  

ProductDetailPage.propTypes = {  
  id: PropTypes.string,  
  navigate: PropTypes.func,  
  addToCart: PropTypes.func,  
  favorites: PropTypes.array,  
  addToFavorites: PropTypes.func,  
  removeFromFavorites: PropTypes.func  
};  

export default ProductDetailPage;
