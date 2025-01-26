import { useState, useRef, useEffect } from "react";
import RatingAndReview from "./RatingAndReview";
import getAIResponse from "../utils/aiUtils.js";
import { Send, Loader2, Bot, User } from "lucide-react"; // Added Bot and User icons

const ChatInterface = ({ updateBalance, darkMode }) => {
  const [question, setQuestion] = useState("");
  const [conversations, setConversations] = useState([]); // Store chat history
  const [isLoading, setIsLoading] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  // Handle AI Question Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = question.trim();
    setQuestion("");
    setIsLoading(true);
    setShowReview(false);

    // Add user message immediately
    setConversations(prev => [...prev, { type: 'user', content: userMessage }]);

    try {
      const geminiResponse = await getAIResponse(userMessage);
      // Add AI response
      setConversations(prev => [...prev, { type: 'ai', content: geminiResponse }]);
      setShowReview(true);
    } catch (error) {
      console.error("Error getting Gemini response:", error);
      setConversations(prev => [...prev, {
        type: 'ai',
        content: "Sorry, an error occurred. Please try again.",
        isError: true
      }]);
    }

    setIsLoading(false);
  };

  // Handle Review Submission
  const handleReviewSubmitted = async (rating, reviewText) => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("Please connect your wallet first.");
        return;
      }

      const response = await fetch("http://localhost:5174/submit-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, rating, reviewText }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Review submitted successfully!");
        await updateBalance();
      } else {
        alert("Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Chat Messages Area */}
      <div className={`flex-1 mb-4 rounded-t-lg ${darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
        {conversations.length === 0 ? (
          <div className="h-full flex items-center justify-center w-[70vw]">
            <div className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">How can I help you today?</h3>
              <p className="text-sm">Ask me anything...</p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-6 w-[70vw]">
            {conversations.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 ${message.type === 'user' ? 'justify-end' : ''
                  }`}
              >
                {message.type === 'ai' && (
                  <div className={`p-2 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-100'
                    }`}>
                    <Bot className="w-6 h-6" />
                  </div>
                )}
                <div className={`flex-1 max-w-[80%] ${message.type === 'user' ? 'ml-auto' : ''
                  }`}>
                  <div className={`p-4 rounded-lg ${message.type === 'user'
                    ? darkMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white'
                    : darkMode
                      ? 'bg-gray-700 text-gray-200'
                      : 'bg-gray-100 text-gray-800'
                    } ${message.isError ? 'border-red-500 border' : ''}`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
                {message.type === 'user' && (
                  <div className={`p-2 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-100'
                    }`}>
                    <User className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-100'
                  }`}>
                  <Bot className="w-6 h-6" />
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        } rounded-b-lg`}>
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your message..."
              className={`flex-1 p-4 rounded-lg ${darkMode
                ? 'bg-gray-700 text-white placeholder-gray-400'
                : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-500'
                }`}
            />
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className={`p-4 rounded-lg transition-colors duration-200 ${darkMode
                ? 'bg-blue-600 hover:bg-blue-500 text-white disabled:bg-gray-700'
                : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300'
                } disabled:cursor-not-allowed`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Review Component */}
      {showReview && (
        <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
          <RatingAndReview
            onReviewSubmitted={handleReviewSubmitted}
            rating={rating}
            setRating={setRating}
            reviewText={reviewText}
            setReviewText={setReviewText}
            darkMode={darkMode}
          />
        </div>
      )}
    </div>
  );
};

export default ChatInterface;