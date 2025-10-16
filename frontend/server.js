import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/solve", async (req, res) => {
  const { expression } = req.body;

  try {
    const prompt = `
You are a math tutor. Solve the following problem step by step.
Return your response in strict JSON with this structure:
{
  "steps": [
    {
      "parts": [
        { "type": "text", "content": "short explanation" },
        { "type": "latex", "content": "math in LaTeX" }
      ]
    }
  ],
  "finalAnswer": { "type": "latex", "content": "final answer in LaTeX" }
}

⚠️ Do NOT merge text and math into a single string.
⚠️ Always use "parts" with one text explanation and one LaTeX equation per step.
⚠️ Keep formatting clean and simple.

Problem: ${expression}
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(response.choices[0].message.content);

    res.json(parsed);
  } catch (err) {
    console.error("ChatGPT error:", err);
    res.status(500).json({
      steps: [
        {
          parts: [
            { type: "text", content: "❌ Error solving" }
          ]
        }
      ],
      finalAnswer: { type: "latex", content: "" },
    });
  }
});

// ✅ Serve Vite build output in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ✅ Dynamic PORT for production deployment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
