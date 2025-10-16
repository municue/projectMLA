// src/utils/queryChatGPT.js
export async function queryChatGPT(expression) {
  try {
    const res = await fetch("http://localhost:5000/solve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expression }),
    });

    if (!res.ok) throw new Error("Failed to fetch solution");

    return await res.json();
  } catch (err) {
    console.error("ChatGPT API error:", err);
    return {
      steps: [
        {
          parts: [
            { type: "text", content: "❌ Error solving" }
          ]
        }
      ],
      finalAnswer: { type: "latex", content: "" },
    };
  }
}
