// src/components/uploadTopics.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, setDoc, doc } from "firebase/firestore";
import { firebaseConfig } from "./firebase.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const topicsData = [
  {
    name: "Preliminaries",
    order: 1,
    description: "This section reviews core skills you'll need for algebra. We'll cover exponents (both integer and fractional), working with radicals, simplifying and factoring polynomials, handling rational expressions, and understanding complex numbers.",
    subtopics: [
      { name: "Integer Exponents", order: 1 },
      { name: "Rational Exponents", order: 2 },
      { name: "Radicals", order: 3 },
      { name: "Polynomials", order: 4 },
      { name: "Factoring Polynomials", order: 5 },
      { name: "Rational Expressions", order: 6 },
      { name: "Complex Numbers", order: 7 }
    ]
  },
  {
    name: "Solving Equations and Inequalities",
    order: 2,
    description: "Here, we focus on solving all kinds of equations and inequalities, from linear to quadratic, including applications. We'll also tackle polynomial, rational, and absolute value problems to strengthen problem-solving skills.",
    subtopics: [
      { name: "Solutions and Solution Sets", order: 1 },
      { name: "Linear Equations", order: 2 },
      { name: "Applications of Linear Equations", order: 3 },
      { name: "Equations With More Than One Variable", order: 4 },
      { name: "Quadratic Equations, Part I", order: 5 },
      { name: "Quadratic Equations, Part II", order: 6 },
      { name: "Quadratic Equations: A Summary", order: 7 },
      { name: "Applications of Quadratic Equations", order: 8 },
      { name: "Equations Reducible to Quadratic Form", order: 9 },
      { name: "Equations with Radicals", order: 10 },
      { name: "Linear Inequalities", order: 11 },
      { name: "Polynomial Inequalities", order: 12 },
      { name: "Rational Inequalities", order: 13 },
      { name: "Absolute Value Equations", order: 14 }
    ]
  },
  {
    name: "Graphing and Functions",
    order: 3,
    description: "We'll explore the coordinate plane, how to graph lines and circles, and what makes a function. You'll learn to graph different functions, combine them, and find their inverses.",
    subtopics: [
      { name: "Graphing", order: 1 },
      { name: "Lines", order: 2 },
      { name: "Circles", order: 3 },
      { name: "The Definition of a Function", order: 4 },
      { name: "Graphing Functions", order: 5 },
      { name: "Combining functions", order: 6 },
      { name: "Inverse Functions", order: 7 }
    ]
  },
  {
    name: "Common Graphs",
    order: 4,
    description: "This section covers graphing frequently used functions, including parabolas, ellipses, and rational functions. We'll also look at transformations and symmetry in graphs.",
    subtopics: [
      { name: "Lines, Circles and Piecewise Functions", order: 1 },
      { name: "Parabolas", order: 2 },
      { name: "Ellipses", order: 3 },
      { name: "Miscellaneous Functions", order: 4 },
      { name: "Transformations", order: 5 },
      { name: "Symmetry", order: 6 },
      { name: "Rational Functions", order: 7 }
    ]
  },
  {
    name: "Polynomial Functions",
    order: 5,
    description: "A deeper dive into polynomials: how to divide them, find their zeros, and sketch their graphs. We'll also break down partial fractions.",
    subtopics: [
      { name: "Dividing Polynomials", order: 1 },
      { name: "Zeroes/Roots of Polynomials", order: 2 },
      { name: "Graphing Polynomials", order: 3 },
      { name: "Finding Zeroes of Polynomials", order: 4 },
      { name: "Partial Fractions", order: 5 }
    ]
  },
  {
    name: "Exponential and Logarithm Functions",
    order: 6,
    description: "This section introduces exponential and logarithmic functions, how they're related, and how to solve equations involving them. We'll also look at practical applications in science and engineering.",
    subtopics: [
      { name: "Exponential Functions", order: 1 },
      { name: "Logarithm Functions", order: 2 },
      { name: "Solving Exponential Equations", order: 3 },
      { name: "Solving Logarithm Equations", order: 4 },
      { name: "Applications", order: 5 }
    ]
  },
  {
    name: "Systems of Equations",
    order: 7,
    description: "Learn methods for solving systems of equations, including linear and nonlinear types. We'll also explore augmented matrices as a tool for solving linear systems.",
    subtopics: [
      { name: "Linear Systems with Two Variables", order: 1 },
      { name: "Linear Systems with Three Variables", order: 2 },
      { name: "Augmented Matrices", order: 3 },
      { name: "More on the Augmented Matrix", order: 4 },
      { name: "Nonlinear Systems", order: 5 }
    ]
  }
];

async function uploadTopics() {
  try {
    for (const topic of topicsData) {
      const docRef = doc(collection(db, "topics"), topic.name.toLowerCase().replace(/\s+/g, "-"));
      await setDoc(docRef, topic);
      console.log(`✅ Uploaded topic: ${topic.name}`);
    }
    console.log("🎉 All topics uploaded successfully!");
  } catch (error) {
    console.error("❌ Error uploading topics:", error);
  }
}

uploadTopics();