// src/components/uploadRationalExponents.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { firebaseConfig } from "./firebase.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 

const rationalExponentsData = {
  name: "Rational Exponents",
  explanation:
    "In this section, we move beyond integer exponents to explore rational exponents—those expressed as a fraction m/n, where m and n are integers. We'll start with the special case where the numerator is 1, then progress to more general forms. You'll see how these connect to roots, how to apply exponent properties, and common mistakes to avoid.",

  formulas: [
    { property: "$a^{1/n} = \\sqrt[n]{a}$", example: "$27^{1/3} = 3$" },
    { property: "$(a^n)^m = a^{n \\cdot m}$", example: "$(8^{1/3})^2 = 4$" },
    { property: "$a^{m/n} = (a^{1/n})^m$", example: "$16^{3/4} = (16^{1/4})^3 = 8$" },
    { property: "$a^{m/n} = (a^m)^{1/n}$", example: "$8^{2/3} = (8^2)^{1/3} = 4$" }
  ],

  commonMistakes: [
    {
      correct: "$a^{-n} = \\frac{1}{a^n}$",
      incorrect: "$a^{-n} \\neq a^{1/n}$",
      explanation: "Negative exponents mean reciprocal, not roots. This is one of the most common errors with rational exponents."
    },
    {
      correct: "$(ab)^{m/n} = a^{m/n} b^{m/n}$",
      incorrect: "$(a+b)^{m/n} \\neq a^{m/n} + b^{m/n}$",
      explanation: "Exponent rules work with multiplication/division, not addition/subtraction."
    }
  ],

  examples: [
    {
      category: "Example 1 – Evaluating $a^{1/n}$",
      questions: [
        { 
          question: "$25^{1/2}$", 
          solution: "To evaluate $25^{1/2}$, we need to find the number that, when squared, equals 25. Using the definition of fractional exponents, $25^{1/2} = ?$ means $?^2 = 25$. Since we know that $5^2 = 25$, we can conclude that $25^{1/2} = 5$. This is equivalent to finding the square root of 25." 
        },
        { 
          question: "$32^{1/5}$", 
          solution: "For $32^{1/5}$, we're looking for the number that when raised to the fifth power gives us 32. In other words, we need to solve $?^5 = 32$. Testing small integers: $2^5 = 32$, so $32^{1/5} = 2$. This demonstrates that $a^{1/n}$ is the nth root of $a$." 
        },
        { 
          question: "$81^{1/4}$", 
          solution: "To find $81^{1/4}$, we ask: what number raised to the fourth power equals 81? We need to solve $?^4 = 81$. Since $3^4 = 3 \\times 3 \\times 3 \\times 3 = 81$, we have $81^{1/4} = 3$. This is the fourth root of 81." 
        },
        { 
          question: "$(-8)^{1/3}$", 
          solution: "Here we need to be careful with the negative sign inside the parentheses. We're looking for a number that when cubed equals -8. Since $(-2)^3 = (-2) \\times (-2) \\times (-2) = -8$, we get $(-8)^{1/3} = -2$. Note that cube roots of negative numbers exist because odd powers preserve the sign." 
        },
        { 
          question: "$(-16)^{1/4}$", 
          solution: "This expression has no real solution. We would need to find a real number that when raised to the fourth power equals -16. However, any real number (positive or negative) raised to an even power always produces a positive result. Since we need a result of -16 (negative), no real number satisfies this condition. This illustrates that even roots of negative numbers don't exist in the real number system." 
        },
        { 
          question: "$-16^{1/4}$", 
          solution: "Notice the absence of parentheses around -16. This means only 16 is raised to the power $1/4$, and then we apply the negative sign. So we have $-16^{1/4} = -(16^{1/4})$. Since $2^4 = 16$, we know $16^{1/4} = 2$. Therefore, $-16^{1/4} = -(2) = -2$. The placement of parentheses is crucial in determining whether an expression has a real solution." 
        }
      ]
    },
    {
      category: "Example 2 – Evaluating $a^{m/n}$",
      questions: [
        { 
          question: "$8^{2/3}$", 
          solution: "For $8^{2/3}$, we can use either of two equivalent approaches. Method 1: $(8^{1/3})^2 = 2^2 = 4$ (find the cube root first, then square). Method 2: $(8^2)^{1/3} = 64^{1/3} = 4$ (square first, then find the cube root). Both methods yield the same answer, but Method 1 typically involves working with smaller numbers, making calculations easier." 
        },
        { 
          question: "$625^{3/4}$", 
          solution: "Let's evaluate $625^{3/4}$ using both methods to see why one is preferred. Method 1: $(625^{1/4})^3 = 5^3 = 125$ (since $5^4 = 625$). Method 2: $(625^3)^{1/4} = (244,140,625)^{1/4} = 125$. While both methods work, Method 1 is much more practical because finding $625^{1/4} = 5$ is straightforward, whereas finding the fourth root of 244,140,625 is considerably more challenging." 
        },
        { 
          question: "$\\left( \\frac{243}{32} \\right)^{4/5}$", 
          solution: "When dealing with fractions raised to fractional powers, we apply the exponent to both numerator and denominator separately: $\\left( \\frac{243}{32} \\right)^{4/5} = \\frac{243^{4/5}}{32^{4/5}}$. Now we evaluate each part: $243^{4/5} = (243^{1/5})^4 = 3^4 = 81$ (since $3^5 = 243$), and $32^{4/5} = (32^{1/5})^4 = 2^4 = 16$ (since $2^5 = 32$). Therefore, the final answer is $\\frac{81}{16}$." 
        }
      ]
    },
    {
      category: "Example 3 – Simplifying with rational exponents",
      questions: [
        { 
          question: "$\\left( \\frac{w^{-2}}{16v^{1/2}} \\right)^{1/4}$", 
          solution: "To simplify this expression, we distribute the outer exponent $1/4$ to each factor inside the parentheses. This gives us: $\\frac{(w^{-2})^{1/4}}{(16)^{1/4} \\cdot (v^{1/2})^{1/4}} = \\frac{w^{-2 \\cdot 1/4}}{16^{1/4} \\cdot v^{1/2 \\cdot 1/4}} = \\frac{w^{-1/2}}{2 \\cdot v^{1/8}}$. Since we want positive exponents only, we move $w^{-1/2}$ to the denominator: $\\frac{1}{2v^{1/8} \\cdot w^{1/2}}$ or $\\frac{1}{2v^{1/8}w^{1/2}}$." 
        },
        { 
          question: "$\\left( \\frac{x^2 y^{-2/3}}{x^{-1/2} y^{-3}} \\right)^{-1/7}$", 
          solution: "First, let's simplify the expression inside the parentheses by combining like terms. For the $x$ terms: $\\frac{x^2}{x^{-1/2}} = x^{2-(-1/2)} = x^{2+1/2} = x^{5/2}$. For the $y$ terms: $\\frac{y^{-2/3}}{y^{-3}} = y^{-2/3-(-3)} = y^{-2/3+3} = y^{7/3}$. So we have $(x^{5/2}y^{7/3})^{-1/7}$. Using the negative exponent rule, this becomes $\\frac{1}{(x^{5/2}y^{7/3})^{1/7}} = \\frac{1}{x^{5/2 \\cdot 1/7} \\cdot y^{7/3 \\cdot 1/7}} = \\frac{1}{x^{5/14}y^{1/3}}$." 
        }
      ]
    }
  ]
};

async function uploadRationalExponents() {
  try {
    const subtopicId = "rational-exponents";
    const docRef = doc(db, "subtopics", subtopicId);
    await setDoc(docRef, rationalExponentsData);
    console.log(`✅ Uploaded subtopic: ${rationalExponentsData.name}`);
  } catch (error) {
    console.error("❌ Error uploading subtopic:", error);
  }
}

uploadRationalExponents();