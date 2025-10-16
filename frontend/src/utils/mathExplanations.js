// src/utils/mathExplanations.js

// Short explanation map for each change type
export const explanationMap = {
  SIMPLIFY_ARITHMETIC: "Simplify arithmetic operation",
  MULTIPLY_POLYNOMIAL_TERMS: "Multiply polynomial terms",
  DISTRIBUTE: "Distribute multiplication over addition",
  COMBINE_EXPONENTS: "Combine exponents",
  COLLECT_LIKE_TERMS: "Combine like terms",
  DEFAULT: "Simplify expression",
};

// ✅ fallback to guarantee a safe explanation
const safeDefaultExplanation = (before = "", after = "") => `
  <ol>
    <li>Simplify the expression step by step: \\(${before}\\) → \\(${after}\\).</li>
  </ol>
`;

// Teaching-style explanations with breakdown steps
export const detailedExplanations = {
  SIMPLIFY_ARITHMETIC: (before = "", after = "") => `
    <ol>
      <li>Simplify the numbers directly: \\(${before}\\) → \\(${after}\\).</li>
    </ol>
  `,

  MULTIPLY_POLYNOMIAL_TERMS: (before = "", after = "") => `
    <ol>
      <li>Take the first term from the first bracket and multiply it with each term in the second bracket.</li>
      <li>Repeat the process for the next term in the first bracket.</li>
      <li>Combine the results to form a single expanded expression.</li>
      <li>Finally, simplify if possible: \\(${before}\\) → \\(${after}\\).</li>
    </ol>
  `,

  DISTRIBUTE: (before = "", after = "") => `
    <ol>
      <li>Step 1: Multiply the first variable from the first bracket with each value in the second bracket.  
      Example: \\( x(x+3) = x^2 + 3x \\)</li>

      <li>Step 2: Multiply the second value in the first bracket with each value in the second bracket.  
      Example: \\( 2(x+3) = 2x + 6 \\)</li>

      <li>Step 3: Combine results from Step 1 and Step 2 into a single expression.  
      Example: \\( (x^2 + 3x) + (2x + 6) = x^2 + 3x + 2x + 6 \\)</li>

      <li>Step 4: Collect like terms for the final simplified answer.  
      Example: \\( x^2 + 3x + 2x + 6 = ${after} \\)</li>
    </ol>
  `,

  COMBINE_EXPONENTS: (before = "", after = "") => `
    <ol>
      <li>When multiplying terms with the same base, add their exponents.</li>
      <li>Example: \\( a^2 \\times a^3 = a^{2+3} = a^5 \\).</li>
      <li>So, \\(${before}\\) → \\(${after}\\).</li>
    </ol>
  `,

  COLLECT_LIKE_TERMS: (before = "", after = "") => `
    <ol>
      <li>Identify terms with the same variable part.</li>
      <li>Combine their coefficients together.</li>
      <li>Example: \\( 2x + 3x = 5x \\).</li>
      <li>So, \\(${before}\\) → \\(${after}\\).</li>
    </ol>
  `,

  DEFAULT: safeDefaultExplanation,
};

// ✅ Export a safe getter
export const getDetailedExplanation = (type, before = "", after = "") => {
  const fn = detailedExplanations[type] || detailedExplanations.DEFAULT;
  try {
    return fn(before, after) || safeDefaultExplanation(before, after);
  } catch {
    return safeDefaultExplanation(before, after);
  }
};
