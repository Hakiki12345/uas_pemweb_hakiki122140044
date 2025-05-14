import PropTypes from 'prop-types';

const StarRating = ({ rating, count }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center">
      <div className="flex mr-2">
        {[...Array(5)].map((_, index) => {
          let starClass = "text-gray-300";
          
          if (index < fullStars) {
            starClass = "text-yellow-400";
          } else if (index === fullStars && hasHalfStar) {
            return (
              <span key={index} className="relative">
                <span className="material-icons absolute text-gray-300">star</span>
                <span className="material-icons text-yellow-400" style={{ width: "50%", overflow: "hidden" }}>star</span>
              </span>
            );
          }
          
          return (
            <span key={index} className={`material-icons ${starClass}`}>
              star
            </span>
          );
        })}
      </div>
      
      {count && <span className="text-sm text-gray-600">({count})</span>}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  count: PropTypes.number
};

export default StarRating;