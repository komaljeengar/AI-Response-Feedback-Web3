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
          <div className="flex_star">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl focus:outline-none ${rating >= star ? "text-yellow-500" : "text-gray-400"}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 border-black text-sm font-bold mb-2">Review:</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="shadow appearance-none border rounded border-[#D8EFD3] w-full py-2 px-3 bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
            rows={3}
          />
        </div>
        <button
          type="submit"
          className="flex-shrink-0 bg-[#50B498] hover:bg-[#95D2B3] border-[#50B498] hover:border-[#95D2B3] hover:text-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  )
}

export default RatingAndReview

