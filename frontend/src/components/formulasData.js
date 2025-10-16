// src/components/formulasData.js

export default [
  // Integer Exponents
  {
    topic: "Integer Exponents",
    formulas: [
      { property: "$a^n \\cdot a^m = a^{n+m}$" },
      { property: "$(a^n)^m = a^{n \\cdot m}$" },
      { property: "$\\frac{a^n}{a^m} = a^{n-m}$" },
      { property: "$\\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}$" },
      { property: "$\\left(\\frac{a}{b}\\right)^{-n} = \\left(\\frac{b}{a}\\right)^n$" },
      { property: "$\\frac{1}{a^{-n}} = a^n$" },
      { property: "$a^{-n} \\cdot b^{-m} = \\frac{b^m}{a^n}$" },
      { property: "$(a^n b^m)^k = a^{n \\cdot k} b^{m \\cdot k}$" }
    ]
  },

  // Rational Exponents
  {
    topic: "Rational Exponents",
    formulas: [
      { property: "$a^{1/n} = \\sqrt[n]{a}$" },
      { property: "$(a^n)^m = a^{n \\cdot m}$" },
      { property: "$a^{m/n} = (a^{1/n})^m$" },
      { property: "$a^{m/n} = (a^m)^{1/n}$" }
    ]
  },

  // Polynomials
  {
    topic: "Polynomials",
    formulas: [
      { property: "$(a + b)(a - b) = a^2 - b^2$" },
      { property: "$(a + b)^2 = a^2 + 2ab + b^2$" },
      { property: "$(a - b)^2 = a^2 - 2ab + b^2$" }
    ]
  }
];
