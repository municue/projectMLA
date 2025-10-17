// src/utils/queryChatGPT.js

export async function queryChatGPT(expression) {
  try {
    // 🔍 Automatically pick the right backend depending on environment
    const baseURL =
      import.meta.env.MODE === "development"
        ? "http://localhost:5000"
        : "https://projectmla.onrender.com"; // ✅ Render live domain

    const res = await fetch(`${baseURL}/solve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expression }),
    });

    if (!res.ok) throw new Error("Failed to fetch solution");

    // ✅ Expecting valid JSON response from your Express server
    return await res.json();
  } catch (err) {
    console.error("ChatGPT API error:", err);

    // Return default structure so UI doesn’t break
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
