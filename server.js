const express = require("express");
const cors = require("cors");
const { Groq } = require("groq-sdk"); // Fast & Free Alternative
require("dotenv").config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// 🔑 API Key Check
if (!process.env.GROQ_API_KEY) {
  console.error("❌ ERROR: GROQ_API_KEY is missing in .env file!");
}

// ✅ Groq Initialize
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Groq Backend Working 🚀");
});

// ✅ Generate Study Plan (Extremely Fast & No Quota Issues)
app.post("/generate-plan", async (req, res) => {
  const { subject, topic, time } = req.body;

  // ✅ Validation
  if (!subject || !topic || !time) {
    return res.status(400).json({ result: "Please fill all fields" });
  }

  try {
    const prompt = `
Create a highly detailed, comprehensive, and complete study plan based on the following details:
Subject: ${subject}
Topic: ${topic}
Available Time: ${time}

Please provide an extensive response with these three distinct sections:
1. Day wise study plan: Break down the topic deeply. For each day or session, write comprehensive bullet points explaining what sub-topics to cover, what concepts to understand, and practical steps to follow.
2. Comprehensive Revision tips: Provide actionable and deep strategies to retain the learned material.
3. Detailed Study advice: Share expert learning methodologies, focus techniques, and advice tailored for this specific topic.

Make the explanation rich, thorough, and highly informative. Do not shorten or summarize it.
`;

    // ✅ Groq API Call (Using Llama-3 model which is completely free and huge)
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile", // Powerful model like Gemini
      temperature: 0.7,
      max_tokens: 2500,
    });

    const resultText = chatCompletion.choices[0]?.message?.content;

    if (resultText) {
      return res.json({ result: resultText });
    } else {
      return res.status(500).json({ result: "AI returned an empty response." });
    }

  } catch (error) {
    console.error("====== GROQ API ERROR ======");
    console.error(error); 
    console.error("============================");
    
    return res.status(500).json({
      result: "AI generation failed. Please check backend terminal."
    });
  }
});

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("🔑 GROQ KEY STATUS:", process.env.GROQ_API_KEY ? "LOADED" : "NOT FOUND ❌");
});