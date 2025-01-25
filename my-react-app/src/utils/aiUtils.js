import axios from "axios";

const getAIResponse = async (question) => {
  const payload = {
    question, // The question sent to the Gemini API
  };

  const headers = {
    "Content-Type": "application/json",
  };
  

  try {
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, payload, { headers });
    console.log(response)

    // Return the AI response from the API
    return response.data.answer || "No response available."; // Adjust based on actual API response structure
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Error: Unable to fetch AI response at the moment.";
  }
};

export default getAIResponse;