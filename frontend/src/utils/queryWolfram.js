// src/utils/queryWolfram.js
import axios from "axios";

export async function queryWolfram(expression) {
  try {
    const url = `http://localhost:5000/wolfram?input=${encodeURIComponent(expression)}`;

    const res = await axios.get(url);
    const pods = res.data?.queryresult?.pods || [];

    const steps = [];
    let finalAnswer = null;

    // Extract step-by-step if available
    pods.forEach((pod) => {
      if (pod.title.toLowerCase().includes("step")) {
        pod.subpods.forEach((sub) => {
          if (sub.mathml) {
            steps.push({ type: "mathml", content: sub.mathml });
          } else if (sub.plaintext) {
            steps.push({ type: "text", content: sub.plaintext });
          }
        });
      }
    });

    // Get final result
    const resultPod = pods.find((p) =>
      p.title.toLowerCase().includes("result")
    );
    if (resultPod) {
      const sub = resultPod.subpods[0];
      if (sub.mathml) {
        finalAnswer = { type: "mathml", content: sub.mathml };
      } else if (sub.plaintext) {
        finalAnswer = { type: "text", content: sub.plaintext };
      }
    }

    return {
      steps: steps.length
        ? steps
        : [{ type: "text", content: "Step-by-step not available (requires Pro)." }],
      finalAnswer:
        finalAnswer || { type: "text", content: "No result found" },
    };
  } catch (err) {
    console.error("Wolfram error:", err);
    return {
      steps: [{ type: "text", content: "Error querying Wolfram API." }],
      finalAnswer: { type: "text", content: "" },
    };
  }
}
