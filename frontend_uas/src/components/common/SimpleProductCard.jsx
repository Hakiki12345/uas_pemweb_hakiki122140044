import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const SimpleProductCard = ({ product }) => {
  return (
    <Link to={`/products/${product.id}`} className="block">
      <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 p-4">
        <div className="h-32 flex items-center justify-center mb-3">
          <img 
            src={product.image} 
            alt={product.title} 
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <h3 className="font-medium text-sm line-clamp-2 mb-2 hover:text-blue-600">{product.title}</h3>
        <p className="font-bold text-sm">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
};

SimpleProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired
  }).isRequired
};

export default SimpleProductCard;