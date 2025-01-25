import React, { useState } from "react";
import RatingAndReview from "./RatingAndReview";
import getAIResponse from "../utils/aiUtils.js";

const ChatInterface = ({ updateBalance }) => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // Handle AI Question Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null);
    setShowReview(false);

    try {
      const geminiResponse = await getAIResponse(question);
      setResponse(geminiResponse);
      setShowReview(true); // Allow review after response
    } catch (error) {
      console.error("Error getting Gemini response:", error);
      setResponse("Sorry, an error occurred. Please try again.");
    }

    setIsLoading(false);
    setQuestion("");
  };

  // Handle Review Submission
  const handleReviewSubmitted = async (rating, reviewText) => {
    try {
      const response = await fetch("http://localhost:5174/submit-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, review: reviewText }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Review submitted successfully!");
        await updateBalance(); // Update user balance after transaction
      } else {
        alert("Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-2xl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">AI Chatbot</h2>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex items-center border-b border-green-500 py-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question..."
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="flex-shrink-0 bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-sm border-4 text-white py-1 px-2 rounded"
            >
              {isLoading ? "Thinking..." : "Ask"}
            </button>
          </div>
        </form>
        {response && (
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">AI Response:</h3>
            <p className="text-gray-700">{response}</p>
          </div>
        )}
        {showReview && (
          <RatingAndReview
            onReviewSubmitted={handleReviewSubmitted}
            rating={rating}
            setRating={setRating}
            reviewText={reviewText}
            setReviewText={setReviewText}
          />
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
