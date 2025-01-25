import React, { useState } from "react"

const RatingAndReview = ({ onReviewSubmitted }) => {
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Here you would typically send the rating and review to your backend
    console.log("Submitting review:", { rating, review })
    await onReviewSubmitted()
    setRating(0)
    setReview("")
  }

  return (
    <div className="mt-4">
      <h3 className="text-xl font-bold mb-2">Provide Feedback</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Rating:</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl focus:outline-none ${rating >= star ? "text-yellow-500" : "text-gray-300"}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Review:</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={3}
          />
        </div>
        <button
          type="submit"
          className="flex-shrink-0 bg-[#F7418F] hover:bg-[#F94892] border-[#F7418F] hover:border-[#D14D72] hover:text-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  )
}

export default RatingAndReview

