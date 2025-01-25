import React, { useState } from "react"
import { getAIResponse } from "../utils/aiUtils.js"
import RatingAndReview from "./RatingAndReview"

const ChatInterface = ({ updateBalance }) => {
  const [question, setQuestion] = useState("")
  const [response, setResponse] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showReview, setShowReview] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const aiResponse = await getAIResponse(question)
      setResponse(aiResponse)
      setShowReview(true)
    } catch (error) {
      console.error("Error getting AI response:", error)
    }
    setIsLoading(false)
    setQuestion("")
  }

  const handleReviewSubmitted = async () => {
    // Mock backend verification
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update balance after successful review
    await updateBalance()
    setShowReview(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-2xl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">AI Chatbot</h2>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex items-center border-b border-[#95D2B3] py-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question..."
              className="appearance-none bg-transparent border-none w-full text-gray-750 mr-3 py-1 px-2 leading-tight focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="flex-shrink-0 bg-[#50B498] hover:bg-[#95D2B3] border-[#50B498] hover:border-[#95D2B3] text-sm border-4 text-white py-1 px-2 rounded"
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
        {showReview && <RatingAndReview onReviewSubmitted={handleReviewSubmitted} />}
      </div>
    </div>
  )
}

export default ChatInterface

