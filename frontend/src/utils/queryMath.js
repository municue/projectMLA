// src/utils/queryMath.js
import * as mathsteps from "mathsteps";

export const queryMath = async (expression) => {
  try {
    const steps = mathsteps.simplifyExpression(expression);

    if (!steps.length) {
      return {
        steps: [
          {
            question: expression || "",
            expression: { type: "latex", content: expression || "" },
          },
        ],
        finalAnswer: { type: "latex", content: expression || "" },
      };
    }

    // Format only the math workings (no explanations)
    const formattedSteps = steps.map((s, i) => {
      const newExpr = s.newNode ? s.newNode.toTex() : expression || "";
      return {
        question: i === 0 ? expression || "" : "",
        expression: { type: "latex", content: newExpr || "" },
      };
    });

    const lastStep = steps[steps.length - 1];
    const finalExpr = lastStep?.newNode?.toTex?.() || expression || "";

    return {
      steps: formattedSteps,
      finalAnswer: { type: "latex", content: finalExpr },
    };
  } catch (err) {
    console.error("Math error:", err);
    return {
      steps: [
        {
          question: expression || "",
          expression: { type: "latex", content: expression || "" },
        },
      ],
      finalAnswer: { type: "latex", content: expression || "" },
    };
  }
};
