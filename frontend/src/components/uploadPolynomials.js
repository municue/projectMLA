// src/components/uploadPolynomials.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { firebaseConfig } from "./firebase.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const polynomialsData = {
  name: "Polynomials",
  explanation:
    "In this section, we explore polynomials — algebraic expressions made of terms in the form $ax^n$, where $n$ is a non-negative integer and $a$ is a real coefficient. We cover identifying polynomials, their degrees, types (monomials, binomials, trinomials), and operations like addition, subtraction, and multiplication. Special formulas for certain products and common mistakes are also highlighted.",

  formulas: [
    { property: "$(a + b)(a - b) = a^2 - b^2$", example: "$(3x + 5)(3x - 5) = 9x^2 - 25$" },
    { property: "$(a + b)^2 = a^2 + 2ab + b^2$", example: "$(2x + 6)^2 = 4x^2 + 24x + 36$" },
    { property: "$(a - b)^2 = a^2 - 2ab + b^2$", example: "$(1 - 7x)^2 = 1 - 14x + 49x^2$" }
  ],

  commonMistakes: [
    {
      correct: "$(a + b)^2 = a^2 + 2ab + b^2$",
      incorrect: "$(a + b)^2 \\neq a^2 + b^2$",
      explanation: "When squaring a binomial, remember the middle term $2ab$. Forgetting it is a common mistake."
    },
    {
      correct: "$(a - b)^2 = a^2 - 2ab + b^2$",
      incorrect: "$(a - b)^2 \\neq a^2 - b^2$",
      explanation: "This incorrect form is actually the difference of squares, not the square of a difference."
    }
  ],

  examples: [
    {
      category: "Example 1 – Adding and Subtracting Polynomials",
      questions: [
        {
          question: "Add $6x^5 - 10x^2 + x - 45$ to $13x^2 - 9x + 4$",
          solution:
            "Set up the addition: $(6x^5 - 10x^2 + x - 45) + (13x^2 - 9x + 4)$. Group terms with matching exponents: $6x^5 + (-10 + 13)x^2 + (1 - 9)x + (-45 + 4) = 6x^5 + 3x^2 - 8x - 41$."
        },
        {
          question: "Subtract $5x^3 - 9x^2 + x - 3$ from $x^2 + x + 1$",
          solution:
            "Write as: $(x^2 + x + 1) - (5x^3 - 9x^2 + x - 3)$. Apply the negative sign to each term in the second polynomial: $x^2 + x + 1 - 5x^3 + 9x^2 - x + 3$. Collect like terms: $-5x^3 + (1 + 9)x^2 + (1 - 1)x + (1 + 3) = -5x^3 + 10x^2 + 4$."
        }
      ]
    },
    {
      category: "Example 2 – Multiplying Polynomials",
      questions: [
        {
          question: "$4x^2(x^2 - 6x + 2)$",
          solution:
            "Multiply $4x^2$ by each term inside the parentheses: $4x^2 \\cdot x^2 - 4x^2 \\cdot 6x + 4x^2 \\cdot 2 = 4x^4 - 24x^3 + 8x^2$."
        },
        {
          question: "$(3x + 5)(x - 10)$",
          solution:
            "Apply the FOIL method: First terms: $3x \\cdot x = 3x^2$, Outer terms: $3x \\cdot (-10) = -30x$, Inner terms: $5 \\cdot x = 5x$, Last terms: $5 \\cdot (-10) = -50$. Combine: $3x^2 - 30x + 5x - 50 = 3x^2 - 25x - 50$."
        },
        {
          question: "$(4x^2 - x)(6 - 3x)$",
          solution:
            "Distribute each term: $4x^2 \\cdot 6 + 4x^2 \\cdot (-3x) + (-x) \\cdot 6 + (-x) \\cdot (-3x) \n\n= 24x^2 - 12x^3 - 6x + 3x^2$. Arrange in descending order: $-12x^3 + (24 + 3)x^2 - 6x = -12x^3 + 27x^2 - 6x$."
        },
        {
          question: "$(3x + 7y)(x - 2y)$",
          solution:
            "Use FOIL with two variables: $3x \\cdot x - 3x \\cdot 2y + 7y \\cdot x - 7y \\cdot 2y = 3x^2 - 6xy + 7xy - 14y^2$. Simplify: $3x^2 + xy - 14y^2$."
        },
        {
          question: "$(2x + 3)(x^2 - x + 1)$",
          solution:
            "Multiply each term in the first polynomial by every term in the second: $2x(x^2 - x + 1) + 3(x^2 - x + 1) = 2x^3 - 2x^2 + 2x + 3x^2 - 3x + 3$. Combine like terms: $2x^3 + x^2 - x + 3$."
        }
      ]
    },
    {
      category: "Example 3 – Special Products",
      questions: [
        {
          question: "$(3x + 5)(3x - 5)$",
          solution:
            "This is a difference of squares pattern. Multiply: $(3x)^2 - (5)^2 = 9x^2 - 25$. Note how the middle terms cancel out when expanded."
        },
        {
          question: "$(2x + 6)^2$",
          solution:
            "Square the binomial: $(2x + 6)(2x + 6)$. Expand: $(2x)^2 + 2(2x)(6) + (6)^2 = 4x^2 + 24x + 36$."
        },
        {
          question: "$(1 - 7x)^2$",
          solution:
            "Square the binomial: $(1 - 7x)(1 - 7x)$. Expand using the pattern $(a - b)^2 = a^2 - 2ab + b^2$: $(1)^2 - 2(1)(7x) + (7x)^2 = 1 - 14x + 49x^2$."
        },
        {
          question: "$4(x + 3)^2$",
          solution:
            "Important: Handle the exponent before multiplying by the coefficient. First expand $(x + 3)^2 = x^2 + 6x + 9$, then multiply by 4: $4(x^2 + 6x + 9) = 4x^2 + 24x + 36$."
        }
      ]
    }
  ]
};

async function uploadPolynomials() {
  try {
    const subtopicId = "polynomials";
    const docRef = doc(db, "subtopics", subtopicId);
    await setDoc(docRef, polynomialsData);
    console.log(`✅ Uploaded subtopic: ${polynomialsData.name}`);
  } catch (error) {
    console.error("❌ Error uploading subtopic:", error);
  }
}

uploadPolynomials();