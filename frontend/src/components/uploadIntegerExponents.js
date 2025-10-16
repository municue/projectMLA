// src/components/uploadIntegerExponents.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { firebaseConfig } from "./firebase.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const integerExponentsData = {
  name: "Integer Exponents",
  explanation:
    "We begin with integer exponents, starting with positive integers, then moving to zero and negative exponents. We'll review key properties, highlight common mistakes, and work through several examples.",

  formulas: [
    { property: "$a^n \\cdot a^m = a^{n+m}$", example: "$a^{-9} \\cdot a^4 = a^{-5}$" },
    { property: "$(a^n)^m = a^{n \\cdot m}$", example: "$(a^7)^3 = a^{21}$" },
    { property: "$\\frac{a^n}{a^m} = a^{n-m}$", example: "$\\frac{a^4}{a^{11}} = a^{-7}$" },
    { property: "$\\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}$", example: "$\\left(\\frac{a}{b}\\right)^{-4} = \\frac{a^{-4}}{b^{-4}}$" },
    { property: "$\\left(\\frac{a}{b}\\right)^{-n} = \\left(\\frac{b}{a}\\right)^n$", example: "$\\left(\\frac{a}{b}\\right)^{-10} = \\left(\\frac{b}{a}\\right)^{10}$" },
    { property: "$\\frac{1}{a^{-n}} = a^n$", example: "$\\frac{1}{a^{-2}} = a^2$" },
    { property: "$a^{-n} \\cdot b^{-m} = \\frac{b^m}{a^n}$", example: "$a^{-6} \\cdot b^{-17} = \\frac{b^{17}}{a^6}$" },
    { property: "$(a^n b^m)^k = a^{n \\cdot k} b^{m \\cdot k}$", example: "$(a^4 b^{-9})^3 = a^{12} b^{-27}$" }
  ],

  commonMistakes: [
    {
      correct: "$\\frac{a}{b^{-2}} = a \\cdot b^2$",
      incorrect: "$\\frac{a}{b^{-2}} \\neq \\frac{1}{a \\cdot b^2}$",
      explanation: "Only $b$ is affected by the exponent, so only it moves to the numerator."
    },
    {
      correct: "$\\left(\\frac{a}{b}\\right)^{-2} = \\frac{1}{(a/b)^2}$",
      incorrect: "$\\left(\\frac{a}{b}\\right)^{-2} \\neq \\frac{a^2}{b^2}$",
      explanation: "The exponent applies to the whole fraction, so both $a$ and $b$ move together."
    },
    {
      correct: "$\\frac{1}{3} \\cdot a^{-5} = \\frac{1}{3a^5}$",
      incorrect: "$\\frac{1}{3} \\cdot a^{-5} \\neq 3a^5$",
      explanation: "Only $a$ has the negative exponent, not the 3."
    }
  ],

  examples: [
    {
      question: "$(4x^{-4}y^5)^3$",
      solution:
        "We'll start by using the power rule to distribute the exponent to each factor inside the parentheses. \n\n$(4x^{-4}y^5)^3 = 4^3x^{-12}y^{15}$ \n\nA key point to remember: the outer exponent must be applied to every factor, including the coefficient 4. Students often forget this step when working with constants. \n\nNext, we evaluate $4^3 = 64$ and handle the negative exponent using the rule that $x^{-12} = \\frac{1}{x^{12}}$: \n\n$64x^{-12}y^{15} = 64 \\cdot \\frac{1}{x^{12}} \\cdot y^{15} = \\frac{64y^{15}}{x^{12}}$ \n\nCombining all terms into a single fraction gives us our final answer. This consolidated form is the preferred way to express the result. \n\nGoing forward, we'll skip the intermediate step of writing $\\frac{1}{x^{12}}$ and directly move negative exponents to the opposite part of the fraction."
    },
    {
      question: "$(-10z^2y^{-4})^2(z^3y)^{-5}$",
      solution:
        "We'll begin by applying the power rule to both expressions, then combine like terms using the product rule for exponents. The final step involves converting negative exponents to positive ones. \n\n$(-10z^2y^{-4})^2(z^3y)^{-5} = (-10)^2z^4y^{-8}z^{-15}y^{-5} = 100z^{-11}y^{-13}$ \n\n$= \\frac{100}{z^{11}y^{13}}$ \n\nWatch out for these potential errors: When squaring the first term, ensure you're squaring the entire coefficient $(-10)$, not just the 10. Also, in the final result, the constant 100 remains in the numerator because it has no negative exponent. Only the variables z and y move to the denominator due to their negative exponents."
    },
    {
      question: "$\\frac{n^{-2}m}{7m^{-4}n^{-3}}$",
      solution:
        "This problem is straightforward once we understand how to handle negative exponents. We'll relocate all terms with negative exponents: those in the numerator go to the denominator, and those in the denominator go to the numerator, removing the negative signs. \n\nFirst, let's rearrange the negative exponents: \n\n$\\frac{n^{-2}m}{7m^{-4}n^{-3}} = \\frac{m^4n^3m}{7n^2}$ \n\nNow we simplify by combining like terms. Using the product rule, we multiply the m terms in the numerator. For the n terms, we use the quotient rule, keeping the result in the numerator since we want positive exponents: \n\n$\\frac{n^{-2}m}{7m^{-4}n^{-3}} = \\frac{m^5n}{7}$ \n\nNote that the constant 7 stays put in the denominator since it doesn't have a negative exponent. Don't be surprised if sometimes all variables end up in the numerator or all in the denominator - this happens naturally."
    },
    {
      question: "$\\frac{5x^{-1}y^{-4}}{(3y^5)^{-2}x^9}$",
      solution:
        "This problem builds on the previous concept but includes a parenthetical expression with a negative exponent. We'll follow the same approach: relocate negative exponents and simplify. \n\nWhen moving terms with negative exponents, variables in the numerator shift to the denominator, and those in the denominator move to the numerator. The parenthetical term $(3y^5)^{-2}$ moves as a complete unit, including the coefficient 3. \n\nHere's our step-by-step work: \n\n$\\frac{5x^{-1}y^{-4}}{(3y^5)^{-2}x^9} = \\frac{5(3y^5)^2}{xy^4x^9} = \\frac{5(9)y^{10}}{xy^4x^9} = \\frac{45y^6}{x^{10}}$"
    }
  ]
};

async function uploadIntegerExponents() {
  try {
    const subtopicId = "integer-exponents"; // Matches route
    const docRef = doc(db, "subtopics", subtopicId);
    await setDoc(docRef, integerExponentsData);
    console.log(`✅ Uploaded subtopic: ${integerExponentsData.name}`);
  } catch (error) {
    console.error("❌ Error uploading subtopic:", error);
  }
}

uploadIntegerExponents();