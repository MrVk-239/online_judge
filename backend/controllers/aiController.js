import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();
console.log("Using API Key:", process.env.GEMINI_API_KEY);


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



export const aiReview = async (req, res) => {
  try {
    const { code, input, output, problemTitle, problemDescription } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // ✅ Free version

    const chat = model.startChat(); // ✅ Use chat interface

    const prompt = `
You are an AI code reviewer.
Problem Title: ${problemTitle}
Problem Description: ${problemDescription}

User Code:
${code}

Input:
${input}

User Output:
${output}

Please:
- If the code is correct, suggest any optimizations.
- If it has syntax/compilation error, explain.
- If the logic is wrong, give hints only (not full solution).
Also give your response in short and points wise readable
    `;

    const result = await chat.sendMessage(prompt); // ✅ Use chat.sendMessage()

    const aiResponse = result.response.text(); // ✅ Extract text

    res.json({ aiResponse });

  } catch (error) {
    console.error("AI Review Error:", error);
    res.status(500).json({
      message: "AI Review failed",
      error: error.message || "Unknown error"
    });
  }
};
