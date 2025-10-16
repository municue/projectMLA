// src/utils/seedQuestions.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import { firebaseConfig } from "../components/firebase.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔹 Safe formatter for Firestore IDs
const formatId = (str) =>
  str
    .toLowerCase()
    .replace(/\s+/g, "-") // spaces → hyphens
    .replace(/\//g, "-") // slashes → hyphens
    .replace(/[^a-z0-9\-]/g, ""); // strip anything else

const questionsData = {
  Preliminaries: {
    "Integer Exponents": {
      easy: [
        {
          id: "e1",
          question: "$-6^2 + 4 \\cdot 3^2$",
          solution:
            "We'll work through this problem by following PEMDAS (order of operations).\n\n" +
            "Begin by calculating the exponential terms: $6^2 = 36$ and $3^2 = 9$.\n\n" +
            "This gives us: $-36 + 4 \\cdot 9$.\n\n" +
            "Next, multiply: $4 \\cdot 9 = 36$.\n\n" +
            "Finally, add the terms: $-36 + 36 = 0$.\n\n" +
            "An important note about the first term: the exponent applies only to 6, not the negative sign. " +
            "So $-6^2$ means $-(6^2) = -36$, not $(-6)^2 = 36$. The negative sign sits outside the exponentiation.\n\n" +
            "To include the negative sign in the exponentiation, parentheses are required: $(-6)^2 = 36$.",
        },
        {
          id: "e2",
          question: "$\\frac{(-2)^4}{(3^2 + 2^2)^2}$",
          solution:
            "We'll solve this by evaluating the numerator and denominator separately, following proper order of operations.\n\n" +
            "The numerator evaluates to: $(-2)^4 = 16$.\n\n" +
            "For the denominator, start inside the parentheses: $3^2 + 2^2 = 9 + 4 = 13$.\n\n" +
            "Now square this result: $(13)^2 = 169$.\n\n" +
            "Our final answer is: $\\frac{16}{169}$.\n\n" +
            "Remember to fully evaluate expressions inside parentheses before applying any outer operations. " +
            "Here, we had to compute $9 + 4 = 13$ before we could square it to get $169$.",
        },
        {
          id: "e3",
          question: "$\\frac{4^0 \\cdot 2^{-2}}{3^{-1} \\cdot 4^{-2}}$",
          solution:
            "This problem requires us to apply several exponent properties systematically.\n\n" +
            "Start by moving terms with negative exponents to create positive exponents:\n\n" +
            "$\\frac{4^0 \\cdot 2^{-2}}{3^{-1} \\cdot 4^{-2}} = \\frac{4^0 \\cdot 3^1 \\cdot 4^2}{2^2}$.\n\n" +
            "Now evaluate each exponential term:\n- $4^0 = 1$ (the zero exponent rule)\n- $3^1 = 3$\n- $4^2 = 16$\n- $2^2 = 4$.\n\n" +
            "Putting these together: $\\frac{1 \\cdot 3 \\cdot 16}{4} = \\frac{48}{4} = 12$.\n\n" +
            "A useful tip: converting negative exponents to positive ones at the beginning simplifies the remaining calculations significantly.",
        },
        {
          id: "e4",
          question: "$2^{-1} + 4^{-1}$",
          solution:
            "We need to express the negative exponents as fractions, then combine them.\n\n" +
            "$2^{-1} = \\frac{1}{2}$ and $4^{-1} = \\frac{1}{4}$.\n\n" +
            "This transforms our expression into: $\\frac{1}{2} + \\frac{1}{4}$.\n\n" +
            "Find a common denominator (4 is the LCM of 2 and 4):\n\n" +
            "$\\frac{1}{2} + \\frac{1}{4} = \\frac{2}{4} + \\frac{1}{4} = \\frac{3}{4}$.\n\n" +
            "Converting negative exponents to fractions right away makes these problems much easier to handle and reduces the chance of errors.",
        },
      ],
      moderate: [
        {
          id: "m1",
          question: "$(2w^4v^{-5})^{-2}$",
          solution:
            "We'll apply the power rule, which distributes an outer exponent to each factor inside.\n\n" +
            "Distribute the -2 exponent to each term:\n\n" +
            "$(2w^4v^{-5})^{-2} = 2^{-2} \\cdot w^{-8} \\cdot v^{10}$.\n\n" +
            "Convert to positive exponents by relocating terms with negative exponents:\n\n" +
            "$2^{-2} \\cdot w^{-8} \\cdot v^{10} = \\frac{v^{10}}{2^2 \\cdot w^8} = \\frac{v^{10}}{4w^8}$.\n\n" +
            "There are different valid approaches to simplifying these expressions. " +
            "The essential strategy is to apply exponent rules methodically and ensure all final exponents are positive.",
        },
        {
          id: "m2",
          question: "$\\frac{2x^4y^{-1}}{x^{-6}y^3}$",
          solution:
            "We'll use the quotient rule for exponents to simplify, then ensure positive exponents.\n\n" +
            "Apply the quotient rule $\\frac{a^m}{a^n} = a^{m-n}$ to each variable:\n\n" +
            "$\\frac{2x^4y^{-1}}{x^{-6}y^3} = 2 \\cdot x^{4-(-6)} \\cdot y^{-1-3} = 2x^{10}y^{-4}$.\n\n" +
            "Move the term with negative exponent to the denominator:\n\n" +
            "$2x^{10}y^{-4} = \\frac{2x^{10}}{y^4}$.\n\n" +
            "This demonstrates how the quotient rule works together with negative exponent rules. " +
            "Although there are multiple solution approaches, they all yield the same result when executed correctly.",
        },
        {
          id: "m3",
          question: "$\\frac{m^{-2}n^{-10}}{m^{-7}n^{-3}}$",
          solution:
            "We'll simplify this expression using the quotient rule on terms with negative exponents.\n\n" +
            "Apply the quotient rule $\\frac{a^m}{a^n} = a^{m-n}$ separately for each variable:\n\n" +
            "$\\frac{m^{-2}n^{-10}}{m^{-7}n^{-3}} = m^{-2-(-7)} \\cdot n^{-10-(-3)} = m^5n^{-7}$.\n\n" +
            "Convert to positive exponents:\n\n" +
            "$m^5n^{-7} = \\frac{m^5}{n^7}$.\n\n" +
            "Notice how subtracting a negative exponent becomes addition. " +
            "With $-2 - (-7)$, we get $-2 + 7 = 5$. Pay close attention to signs when dealing with negative exponents.",
        },
        {
          id: "m4",
          question: "$\\frac{(2p^2)^{-3}q^4}{(6q)^{-1}p^{-7}}$",
          solution:
            "This problem involves multiple exponent rules, so we'll proceed step by step.\n\n" +
            "First, distribute exponents to products: $(2p^2)^{-3} = 2^{-3} \\cdot p^{-6}$ and $(6q)^{-1} = 6^{-1} \\cdot q^{-1}$.\n\n" +
            "Substitute these values: $\\frac{2^{-3} \\cdot p^{-6} \\cdot q^4}{6^{-1} \\cdot q^{-1} \\cdot p^{-7}}$.\n\n" +
            "Apply the quotient rule:\n\n" +
            "$\\frac{2^{-3}}{6^{-1}} \\cdot \\frac{p^{-6}}{p^{-7}} \\cdot \\frac{q^4}{q^{-1}} = \\frac{2^{-3}}{6^{-1}} \\cdot p^1 \\cdot q^5$.\n\n" +
            "Simplify the numerical coefficient:\n\n" +
            "$\\frac{2^{-3}}{6^{-1}} = \\frac{6}{2^3} = \\frac{6}{8} = \\frac{3}{4}$.\n\n" +
            "Final result: $\\frac{3pq^5}{4}$.\n\n" +
            "For complex expressions like this, work through one or two operations at a time " +
            "rather than attempting multiple simplifications simultaneously, which can lead to mistakes.",
        },
        {
          id: "m5",
          question: "$\\left(\\frac{z^3y^{-1}x^{-3}}{x^{-8}z^6y^4}\\right)^{-4}$",
          solution:
            "This problem has nested operations, so we'll simplify the inner fraction first.\n\n" +
            "Apply the quotient rule to simplify inside the parentheses:\n\n" +
            "$\\frac{z^3y^{-1}x^{-3}}{x^{-8}z^6y^4} = z^{3-6} \\cdot y^{-1-4} \\cdot x^{-3-(-8)} = z^{-3}y^{-5}x^5$.\n\n" +
            "Now distribute the outer -4 exponent:\n\n" +
            "$(z^{-3}y^{-5}x^5)^{-4} = z^{12}y^{20}x^{-20}$.\n\n" +
            "Express with positive exponents only:\n\n" +
            "$\\frac{z^{12}y^{20}}{x^{20}}$.\n\n" +
            "For nested expressions, it's generally easier to simplify inner components before applying outer operations. " +
            "This approach minimizes computational errors and makes verification simpler.",
        },
      ],
      hard: [
        {
          id: "h1",
          question: "$2 \\cdot 5^2 + (-4)^2$",
        },
        {
          id: "h2",
          question: "$6^0 - 3^5$",
        },
        {
          id: "h3",
          question: "$3 \\cdot 4^3 + 2 \\cdot 3^2$",
        },
        {
          id: "h4",
          question: "$(-1)^4 + 2(-3)^4$",
        },
        {
          id: "h5",
          question: "$7^0(4^2 \\cdot 3^2)^2$",
        },
        {
          id: "h6",
          question: "$-4^3 + (-4)^3$",
        },
        {
          id: "h7",
          question: "$8 \\cdot 2^{-3} + 16^0$",
        },
        {
          id: "h8",
          question: "$(2^{-1} + 3^{-1})^{-1}$",
        },
        {
          id: "h9",
          question: "$\\frac{3^2 \\cdot (-2)^3}{6^{-2}}$",
        },
        {
          id: "h10",
          question: "$\\frac{8^0 \\cdot 4^{-3}}{2^{-7}}$",
        },
        {
          id: "h11",
          question: "$(3x^{-2}y^{-4})^{-1}$",
        },
        {
          id: "h12",
          question: "$\\left((2a^3)^{-3}b^4\\right)^{-3}$",
        },
        {
          id: "h13",
          question: "$\\frac{c^{-6}b^{10}}{b^9c^{-11}}$",
        },
        {
          id: "h14",
          question: "$\\frac{4a^3(b^2a)^{-4}}{c^{-6}a^2b^{-7}}$",
        },
        {
          id: "h15",
          question: "$\\frac{(6v^2)^{-1}w^{-4}}{(2v)^{-3}w^{10}}$",
        },
      ],
    },

    "Rational Exponents": { 
      easy: [
        {
          id: "e1",
          question: "$36^{\\frac{1}{2}}$",
          solution:
            "We recognize that $6^2 = 36$, which allows us to determine:\n\n" +
            "$36^{\\frac{1}{2}} = 6$.\n\n" +
            "If you're uncertain about these types of problems, you can set up the equation\n\n" +
            "$?^2 = 36$\n\n" +
            "and test integer values until you find the correct one.",
        },
        {
          id: "e2",
          question: "$(-125)^{\\frac{1}{3}}$",
          solution:
            "We know that $5^3 = 125$. Following this logic, $(-5)^3 = -125$, so:\n\n" +
            "$(-125)^{\\frac{1}{3}} = -5$.\n\n" +
            "If you're unsure of the answer, set up the equation\n\n" +
            "$?^3 = -125$\n\n" +
            "and test integers systematically. Since the result is negative, we need a " +
            "negative base because raising a positive number to any integer power cannot produce a negative result.",
        },
        {
          id: "e3",
          question: "$-16^{\\frac{3}{2}}$",
          solution:
            "First, we rewrite the expression to clarify the order of operations:\n\n" +
            "$-\\left(16^{\\frac{3}{2}}\\right)$\n\n" +
            "This prevents us from incorrectly including the negative sign in the exponentiation.\n\n" +
            "Using exponent properties, we can rewrite this as:\n\n" +
            "$-\\left(16^{\\frac{3}{2}}\\right) = -\\left(\\left(16^{\\frac{1}{2}}\\right)^3\\right)$.\n\n" +
            "We recognize that:\n\n" +
            "$16^{\\frac{1}{2}} = 4$\n\n" +
            "since $4^2 = 16$.\n\n" +
            "Therefore:\n\n" +
            "$-16^{\\frac{3}{2}} = -\\left(16^{\\frac{3}{2}}\\right) = -\\left(\\left(16^{\\frac{1}{2}}\\right)^3\\right) = -(4^3) = -(64) = -64$.\n\n" +
            "Breaking down complex expressions into manageable steps makes the solution process clearer and easier to verify.",
        },
      ], 
      moderate: [
        {
          id: "m1",
          question: "$\\left(a^3 b^{-\\frac{1}{4}}\\right)^{\\frac{2}{3}}$",
          solution:
            "We'll apply the exponent properties we've learned to simplify this expression.\n\n" +
            "$\\left(a^3 b^{-\\frac{1}{4}}\\right)^{\\frac{2}{3}} = a^2 b^{-\\frac{1}{6}} = \\frac{a^2}{b^{\\frac{1}{6}}}$.",
        },
        {
          id: "m2",
          question: "$x^{\\frac{1}{4}} x^{-\\frac{1}{5}}$",
          solution:
            "We'll use the product rule for exponents to combine these terms.\n\n" +
            "$x^{\\frac{1}{4}} x^{-\\frac{1}{5}} = x^{\\frac{1}{4} - \\frac{1}{5}} = x^{\\frac{1}{20}}$.",
        },
        {
          id: "m3",
          question: "$\\left(\\frac{q^3 p^{-\\frac{1}{2}}}{q^{-\\frac{1}{3}} p}\\right)^{\\frac{3}{7}}$",
          solution:
            "We'll simplify this expression using standard exponent rules.\n\n" +
            "$\\left(\\frac{q^3 p^{-\\frac{1}{2}}}{q^{-\\frac{1}{3}} p}\\right)^{\\frac{3}{7}} = \\left(\\frac{q^3 q^{\\frac{1}{3}}}{pp^{\\frac{1}{2}}}\\right)^{\\frac{3}{7}} = \\left(\\frac{q^{\\frac{10}{3}}}{p^{\\frac{3}{2}}}\\right)^{\\frac{3}{7}} = \\frac{q^{\\frac{10}{7}}}{p^{\\frac{9}{14}}}$.",
        },
        {
          id: "m4",
          question: "$\\left(\\frac{m^{\\frac{1}{2}} n^{-\\frac{1}{3}}}{n^{\\frac{3}{4}} m^{-\\frac{7}{4}}}\\right)^{-\\frac{1}{6}}$",
          solution:
            "We'll work through this systematically using exponent properties.\n\n" +
            "$\\left(\\frac{m^{\\frac{1}{2}} n^{-\\frac{1}{3}}}{n^{\\frac{3}{4}} m^{-\\frac{7}{4}}}\\right)^{-\\frac{1}{6}} = \\left(\\frac{m^{\\frac{1}{2}} m^{\\frac{7}{4}}}{n^{\\frac{3}{4}} n^{\\frac{1}{3}}}\\right)^{-\\frac{1}{6}} = \\left(\\frac{m^{\\frac{9}{4}}}{n^{\\frac{13}{12}}}\\right)^{-\\frac{1}{6}} = \\left(\\frac{n^{\\frac{13}{12}}}{m^{\\frac{9}{4}}}\\right)^{\\frac{1}{6}} = \\frac{n^{\\frac{13}{72}}}{m^{\\frac{3}{8}}}$.",
        },
      ], 
      hard: [
        {
          id: "h1",
          question: "$64^{\\frac{2}{3}}$",
        },
        {
          id: "h2",
          question: "$-64^{\\frac{2}{3}}$",
        },
        {
          id: "h3",
          question: "$16^{\\frac{1}{2}}$",
        },
        {
          id: "h4",
          question: "$16^{\\frac{1}{4}}$",
        },
        {
          id: "h5",
          question: "$(-243)^{\\frac{1}{5}}$",
        },
        {
          id: "h6",
          question: "$121^{-\\frac{1}{2}}$",
        },
        {
          id: "h7",
          question: "$(-64)^{-\\frac{1}{3}}$",
        },
        {
          id: "h8",
          question: "$\\left(\\frac{625}{256}\\right)^{\\frac{1}{4}}$",
        },
        {
          id: "h9",
          question: "$\\left(-\\frac{27}{8}\\right)^{\\frac{1}{3}}$",
        },
        {
          id: "h10",
          question: "$\\left(p^{-2}q^{-4}\\right)^{\\frac{1}{2}}$",
        },
        {
          id: "h11",
          question: "$x^{\\frac{1}{4}}\\left(x^2 x^{-\\frac{1}{4}}\\right)^{\\frac{3}{2}}$",
        },
        {
          id: "h12",
          question: "$a^{\\frac{1}{2}} a^{-\\frac{1}{3}} a^{\\frac{1}{4}}$",
        },
        {
          id: "h13",
          question: "$\\left(m^{-\\frac{7}{3}}n^{\\frac{1}{4}}\\right)^{-\\frac{1}{9}}$",
        },
        {
          id: "h14",
          question: "$\\left(\\frac{a^{-\\frac{1}{3}} b^2}{b^{\\frac{1}{4}} a^{-\\frac{7}{4}}}\\right)^{\\frac{1}{2}}$",
        },
        {
          id: "h15",
          question: "$\\left(\\frac{p^{\\frac{1}{2}} q^{\\frac{5}{3}}}{p^{-\\frac{1}{4}} q^{-\\frac{1}{4}}}\\right)^{-3}$",
        },
        {
          id: "h16",
          question: "$\\left(\\frac{x^{\\frac{1}{2}} y^{-\\frac{2}{3}}}{x^{\\frac{1}{4}}}\\right)^{\\frac{7}{6}}$",
        },
      ] 
    },
    Radicals: { 
      easy: [
        {
          id: "e1",
          question: "$\\sqrt[7]{y}$",
          solution:
            "We need to convert this radical expression into exponential form.\n\n" +
            "$y^{\\frac{1}{7}}$.",
        },
        {
          id: "e2",
          question: "$\\sqrt[3]{x^2}$",
          solution:
            "We need to convert this radical expression into exponential form.\n\n" +
            "$(x^2)^{\\frac{1}{3}}$.",
        },
        {
          id: "e3",
          question: "$\\sqrt[6]{ab}$",
          solution:
            "We need to convert this radical expression into exponential form.\n\n" +
            "$(ab)^{\\frac{1}{6}}$.\n\n" +
            "Parentheses are critical here! Without them, only $b$ would receive the exponent. " +
            "Writing $ab^{\\frac{1}{6}}$ means $a\\left(b^{\\frac{1}{6}}\\right) = a\\sqrt[6]{b}$, " +
            "which differs from our original expression.\n\n" +
            "To correctly indicate that both $a$ and $b$ are under the radical, parentheses must be used as shown above.",
        },
        {
          id: "e4",
          question: "$\\sqrt{w^2v^3}$",
          solution:
            "We need to convert this radical expression into exponential form.\n\n" +
            "$(w^2v^3)^{\\frac{1}{2}}$.\n\n" +
            "When no index appears on a radical, it's understood to be 2 (square root).\n\n" +
            "Also, parentheses are essential here! The exponent only applies to what's immediately to its left, " +
            "so we need parentheses around the entire expression to show that both terms are under the root.",
        },
        {
          id: "e5",
          question: "$\\sqrt[4]{81}$",
          solution:
            "We'll convert to exponential form and then evaluate using methods from the Rational Exponent section.\n\n" +
            "$\\sqrt[4]{81} = 81^{\\frac{1}{4}} = 3$ because $3^4 = 81$.",
        },
      ], 
      moderate: [
        {
          id: "m1",
          question: "$\\sqrt[4]{x^7 y^{20} z^{11}}$",
          solution:
            "To put this in simplified radical form, we need to rewrite the radicand.\n\n" +
            "We can factor the radicand as:\n\n" +
            "$x^7 y^{20} z^{11} = x^4 y^{20} z^8 x^3 z^3 = x^4 (y^5)^4 (z^2)^4 x^3 z^3$.",
        },
        {
          id: "m2",
          question: "$\\sqrt[3]{54x^6 y^7 z^2}$",
          solution:
            "Our goal is simplified radical form. Let's factor the radicand strategically.\n\n" +
            "We can rewrite the radicand as:\n\n" +
            "$54x^6 y^7 z^2 = (27x^6 y^6)(2yz^2) = (3^3 (x^2)^3 (y^2)^3)(2yz^2)$.\n\n" +
            "With the radicand properly factored, we can now simplify:\n\n" +
            "$\\sqrt[3]{54x^6 y^7 z^2} = \\sqrt[3]{3^3 (x^2)^3 (y^2)^3} \\sqrt[3]{2yz^2} = \\sqrt[3]{(3x^2 y^2)^3} \\sqrt[3]{2yz^2} = 3x^2 y^2 \\sqrt[3]{2yz^2}$.",
        },
        {
          id: "m3",
          question: "$\\sqrt[4]{4x^3 y} \\sqrt[4]{8x^2 y^3 z^5}$",
          solution:
            "When multiplying radicals with matching indices, we must first combine them before simplifying.\n\n" +
            "$\\sqrt[4]{4x^3 y} \\sqrt[4]{8x^2 y^3 z^5} = \\sqrt[4]{(4x^3 y)(8x^2 y^3 z^5)} = \\sqrt[4]{32x^5 y^4 z^5}$.\n\n" +
            "Now we can proceed with simplification.\n\n" +
            "Factor the radicand:\n\n" +
            "$32x^5 y^4 z^5 = (2^4 x^4 y^4 z^4)(2xz) = (2xyz)^4 (2xz)$.\n\n" +
            "Complete the simplification:\n\n" +
            "$\\sqrt[4]{4x^3 y} \\sqrt[4]{8x^2 y^3 z^5} = \\sqrt[4]{32x^5 y^4 z^5} = \\sqrt[4]{2^4 x^4 y^4 z^4} \\sqrt[4]{2xz} = 2xyz \\sqrt[4]{2xz}$.",
        },
        {
          id: "m4",
          question: "$\\sqrt{x}(4 - 3\\sqrt{x})$",
          solution:
            "We simply need to distribute and multiply.\n\n" +
            "$\\sqrt{x}(4 - 3\\sqrt{x}) = 4\\sqrt{x} - 3\\sqrt{x}(\\sqrt{x}) = 4\\sqrt{x} - 3\\sqrt{x^2} = 4\\sqrt{x} - 3x$.\n\n" +
            "Remember to simplify any radicals in your final answer - this step is frequently overlooked.",
        },
        {
          id: "m5",
          question: "$\\frac{6}{\\sqrt{x}}$",
          solution:
            "To rationalize this denominator, we'll multiply both numerator and denominator by $\\sqrt{x}$.\n\n" +
            "$\\frac{6}{\\sqrt{x}} = \\frac{6}{\\sqrt{x}} \\frac{\\sqrt{x}}{\\sqrt{x}} = \\frac{6\\sqrt{x}}{\\sqrt{x^2}} = \\frac{6\\sqrt{x}}{x}$.",
        },
        {
          id: "m6",
          question: "$\\frac{9}{\\sqrt[3]{2x}}$",
          solution:
            "To rationalize this denominator, multiply numerator and denominator by $\\sqrt[3]{(2x)^2}$.\n\n" +
            "$\\frac{9}{\\sqrt[3]{2x}} = \\frac{9}{\\sqrt[3]{2x}} \\frac{\\sqrt[3]{(2x)^2}}{\\sqrt[3]{(2x)^2}} = \\frac{9\\sqrt[3]{(2x)^2}}{\\sqrt[3]{(2x)^3}} = \\frac{9\\sqrt[3]{4x^2}}{2x}$.",
        },
        {
          id: "m7",
          question: "$\\frac{4}{\\sqrt{x} + 2\\sqrt{y}}$",
          solution:
            "To eliminate radicals from the denominator, multiply by the conjugate $\\sqrt{x} - 2\\sqrt{y}$.\n\n" +
            "$\\frac{4}{\\sqrt{x} + 2\\sqrt{y}} = \\frac{4}{\\sqrt{x} + 2\\sqrt{y}} \\frac{\\sqrt{x} - 2\\sqrt{y}}{\\sqrt{x} - 2\\sqrt{y}} = \\frac{4(\\sqrt{x} - 2\\sqrt{y})}{(\\sqrt{x} + 2\\sqrt{y})(\\sqrt{x} - 2\\sqrt{y})} = \\frac{4\\sqrt{x} - 8\\sqrt{y}}{x - 4y}$.",
        },
        {
          id: "m8",
          question: "$\\frac{10}{3 - 5\\sqrt{x}}$",
          solution:
            "To rationalize the denominator, multiply by the conjugate $3 + 5\\sqrt{x}$.\n\n" +
            "$\\frac{10}{3 - 5\\sqrt{x}} = \\frac{10}{3 - 5\\sqrt{x}} \\frac{3 + 5\\sqrt{x}}{3 + 5\\sqrt{x}} = \\frac{10(3 + 5\\sqrt{x})}{(3 - 5\\sqrt{x})(3 + 5\\sqrt{x})} = \\frac{30 + 50\\sqrt{x}}{9 - 25x}$.",
        },
      ], 
      hard: [
        {
          id: "h1",
          question: "$(2\\sqrt{x} + 4)(\\sqrt{x} - 7)$",
        },
        {
          id: "h2",
          question: "$\\sqrt{x}\\left(\\sqrt[3]{x} + 2\\sqrt[3]{x^4}\\right)$",
        },
        {
          id: "h3",
          question: "$\\left(\\sqrt{x} + \\sqrt{2y}\\right)\\left(\\sqrt{x} - \\sqrt{2y}\\right)$",
        },
        {
          id: "h4",
          question: "$\\left(\\sqrt{x} + \\sqrt{x^2}\\right)^2$",
        },
        {
          id: "h5",
          question: "$\\frac{9}{\\sqrt{y}}$",
        },
        {
          id: "h6",
          question: "$\\frac{3}{\\sqrt[4]{7x}}$",
        },
        {
          id: "h7",
          question: "$\\frac{1}{\\sqrt[3]{x}}$",
        },
        {
          id: "h8",
          question: "$\\frac{12}{\\sqrt[3]{3x^2}}$",
        },
        {
          id: "h9",
          question: "$\\frac{2}{4 - \\sqrt{x}}$",
        },
        {
          id: "h10",
          question: "$\\frac{9}{\\sqrt{3y} + 2}$",
        },
        {
          id: "h11",
          question: "$\\frac{4}{\\sqrt{7} - 6\\sqrt{x}}$",
        },
        {
          id: "h12",
          question: "$\\frac{-6}{\\sqrt{5x} + 10\\sqrt{y}}$",
        },
        {
          id: "h13",
          question: "$\\frac{4 + x}{x - \\sqrt{x}}$",
        },
      ] 
    },
    Polynomials: { easy: [], moderate: [], hard: [] },
    "Factoring Polynomials": { easy: [], moderate: [], hard: [] },
    "Rational Expressions": { easy: [], moderate: [], hard: [] },
    "Complex Numbers": { easy: [], moderate: [], hard: [] },
  },

  // 🔹 Other topics (placeholders for now)
  "Solving Equations and Inequalities": {
    "Solutions and Solution Sets": { easy: [], moderate: [], hard: [] },
    "Linear Equations": { easy: [], moderate: [], hard: [] },
    "Applications of Linear Equations": { easy: [], moderate: [], hard: [] },
    "Equations With More Than One Variable": { easy: [], moderate: [], hard: [] },
    "Quadratic Equations, Part I": { easy: [], moderate: [], hard: [] },
    "Quadratic Equations, Part II": { easy: [], moderate: [], hard: [] },
    "Quadratic Equations: A Summary": { easy: [], moderate: [], hard: [] },
    "Applications of Quadratic Equations": { easy: [], moderate: [], hard: [] },
    "Equations Reducible to Quadratic Form": { easy: [], moderate: [], hard: [] },
    "Equations with Radicals": { easy: [], moderate: [], hard: [] },
    "Linear Inequalities": { easy: [], moderate: [], hard: [] },
    "Polynomial Inequalities": { easy: [], moderate: [], hard: [] },
    "Rational Inequalities": { easy: [], moderate: [], hard: [] },
    "Absolute Value Equations": { easy: [], moderate: [], hard: [] },
  },

  "Graphing and Functions": {
    Graphing: { easy: [], moderate: [], hard: [] },
    Lines: { easy: [], moderate: [], hard: [] },
    Circles: { easy: [], moderate: [], hard: [] },
    "The Definition of a Function": { easy: [], moderate: [], hard: [] },
    "Graphing Functions": { easy: [], moderate: [], hard: [] },
    "Combining functions": { easy: [], moderate: [], hard: [] },
    "Inverse Functions": { easy: [], moderate: [], hard: [] },
  },

  "Common Graphs": {
    "Lines, Circles and Piecewise Functions": { easy: [], moderate: [], hard: [] },
    Parabolas: { easy: [], moderate: [], hard: [] },
    Ellipses: { easy: [], moderate: [], hard: [] },
    "Miscellaneous Functions": { easy: [], moderate: [], hard: [] },
    Transformations: { easy: [], moderate: [], hard: [] },
    Symmetry: { easy: [], moderate: [], hard: [] },
    "Rational Functions": { easy: [], moderate: [], hard: [] },
  },

  "Polynomial Functions": {
    "Dividing Polynomials": { easy: [], moderate: [], hard: [] },
    "Zeroes/Roots of Polynomials": { easy: [], moderate: [], hard: [] },
    "Graphing Polynomials": { easy: [], moderate: [], hard: [] },
    "Finding Zeroes of Polynomials": { easy: [], moderate: [], hard: [] },
    "Partial Fractions": { easy: [], moderate: [], hard: [] },
  },

  "Exponential and Logarithm Functions": {
    "Exponential Functions": { easy: [], moderate: [], hard: [] },
    "Logarithm Functions": { easy: [], moderate: [], hard: [] },
    "Solving Exponential Equations": { easy: [], moderate: [], hard: [] },
    "Solving Logarithm Equations": { easy: [], moderate: [], hard: [] },
    Applications: { easy: [], moderate: [], hard: [] },
  },

  "Systems of Equations": {
    "Linear Systems with Two Variables": { easy: [], moderate: [], hard: [] },
    "Linear Systems with Three Variables": { easy: [], moderate: [], hard: [] },
    "Augmented Matrices": { easy: [], moderate: [], hard: [] },
    "More on the Augmented Matrix": { easy: [], moderate: [], hard: [] },
    "Nonlinear Systems": { easy: [], moderate: [], hard: [] },
  },

};

// 🔹 Utility to split solution strings into structured steps
const formatSolution = (solutionString) => {
  if (!solutionString) return [];

  // Split into paragraphs by double newlines
  const parts = solutionString.split(/\n\s*\n/);

  const formatted = [];
  for (let p of parts) {
    // Extract all math expressions inside $...$
    const matches = [...p.matchAll(/\$(.*?)\$/g)];

    if (matches.length > 0) {
      // Break text around math parts
      let lastIndex = 0;
      for (const m of matches) {
        const [full, inner] = m;
        const start = m.index;
        const before = p.slice(lastIndex, start).trim();
        if (before) formatted.push({ type: "text", content: before });
        formatted.push({ type: "latex", content: inner.trim() });
        lastIndex = start + full.length;
      }
      const after = p.slice(lastIndex).trim();
      if (after) formatted.push({ type: "text", content: after });
    } else {
      // No LaTeX, treat as plain text
      formatted.push({ type: "text", content: p.trim() });
    }
  }

  return formatted.filter((step) => step.content.length > 0);
};

// 🔹 Updated seeding logic
async function seedQuestions() {
  try {
    for (const [topic, subtopics] of Object.entries(questionsData)) {
      for (const [subtopic, difficulties] of Object.entries(subtopics)) {
        const docId = `${formatId(topic)}-${formatId(subtopic)}`;

        // Reformat all solutions before upload
        const structuredDifficulties = {};
        for (const [level, questions] of Object.entries(difficulties)) {
          structuredDifficulties[level] = questions.map((q) => ({
            ...q,
            solution: Array.isArray(q.solution)
              ? q.solution
              : formatSolution(q.solution),
          }));
        }

        await setDoc(doc(collection(db, "questions"), docId), {
          topic,
          subtopic,
          difficultyLevels: structuredDifficulties,
        });

        console.log(`✅ Seeded: ${topic} → ${subtopic}`);
      }
    }
    console.log("🎉 All questions seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding questions:", err);
  }
}

seedQuestions();
