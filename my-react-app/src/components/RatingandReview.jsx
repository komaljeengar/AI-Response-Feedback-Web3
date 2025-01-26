import { Star } from "lucide-react";

const RatingAndReview = ({
  onReviewSubmitted,
  rating,
  setRating,
  reviewText,
  setReviewText,
  darkMode
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onReviewSubmitted(rating, reviewText);
    setRating(0);
    setReviewText("");
  };

  return (
    <div className={`${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
      <h3 className="text-lg font-semibold mb-4">Rate this response</h3>

      {/* Star Rating */}
      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`p-1 transition-colors duration-200 ${star <= rating
                ? 'text-yellow-400'
                : darkMode ? 'text-gray-600' : 'text-gray-300'
              }`}
          >
            <Star className="w-6 h-6 space-x-6 fill-current" />
          </button>
        ))}
      </div>

      {/* Review Text */}
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Share your feedback..."
        className={`w-full p-3 rounded-lg mb-4 ${darkMode
            ? 'bg-gray-700 text-white placeholder-gray-400'
            : 'bg-white text-gray-900 placeholder-gray-500'
          } border ${darkMode ? 'border-gray-600' : 'border-gray-300'
          } focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-blue-500' : 'focus:ring-green-500'
          }`}
        rows="3"
      />

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!rating || !reviewText.trim()}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${darkMode
            ? 'bg-blue-600 hover:bg-blue-500 text-white disabled:bg-gray-600'
            : 'bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-300'
          } disabled:cursor-not-allowed`}
      >
        Submit Review
      </button>
    </div>
  );
};

export default RatingAndReview;