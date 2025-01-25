import axios from "axios";

const getAIResponse = async (question) => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  if (!API_KEY) {
    console.error("❌ API Key is missing! Check your .env file.");
    return "Error: API Key is missing.";
  }

  const payload = {
    contents: [{ role: "user", parts: [{ text: question }] }],
  };

  try {
    console.log("🔍 Sending request to:", API_URL);
    console.log("📩 Payload:", JSON.stringify(payload));

    const response = await axios.post(API_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("✅ API Response:", response.data);

    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response available.";
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    return "Error: Unable to fetch AI response at the moment.";
  }
};

export default getAIResponse;
