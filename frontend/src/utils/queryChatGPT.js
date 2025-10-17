export async function queryChatGPT(expression) {
  try {
    const baseURL =
      import.meta.env.MODE === "development"
        ? "http://localhost:5000"
        : "https://projectmla.onrender.com";

    const res = await fetch(`${baseURL}/solve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expression }),
    });

    if (!res.ok) throw new Error(`Failed to fetch solution: ${res.status}`);

    return await res.json();
  } catch (err) {
    console.error("ChatGPT API error:", err);
    return {
      steps: [
        {
          parts: [{ type: "text", content: "❌ Error solving" }],
        },
      ],
      finalAnswer: { type: "latex", content: "" },
    };
  }
}
