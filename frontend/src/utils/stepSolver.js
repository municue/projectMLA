// src/utils/stepSolver.js
import { parse, simplify } from "mathjs";

export function solveWithSteps(expr) {
  const steps = [];

  try {
    // Step 1: Original question
    steps.push({
      question: expr,
      expression: expr,
    });

    const node = parse(expr);

    // Handle power distribution like (4x^-4y^5)^3
    if (node.type === "OperatorNode" && node.op === "^") {
      const base = node.args[0];
      const exponent = node.args[1];

      if (base.type === "ParenthesisNode" || base.type === "OperatorNode") {
        const inside = base.content || base;
        if (inside.type === "OperatorNode" && inside.op === "*") {
          const factors = inside.args;
          const distributed = factors
            .map((factor) => `(${factor.toString()})^${exponent.toString()}`)
            .join(" * ");

          steps.push({ expression: distributed });

          const simplified = simplify(distributed).toString();
          steps.push({ expression: simplified });
        }
      }
    }

    // General simplification
    const simplified = simplify(expr).toString();
    if (simplified !== expr) {
      steps.push({ expression: simplified });
    }

    return steps;
  } catch (err) {
    return [
      {
        question: expr,
        expression: expr,
      },
    ];
  }
}
