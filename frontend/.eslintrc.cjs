/* eslint-env node */
module.exports = {
  root: true,
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "prettier",
    "plugin:tailwindcss/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  plugins: ["@typescript-eslint", "tailwindcss"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "@next/next/no-img-element": "off", // Not using next/image because it isn't supported with SSG mode
    "react-hooks/exhaustive-deps": "off", // Incorrectly report needed dependency with Next.js router
    "tailwindcss/no-custom-classname": "off",
    "tailwindcss/classnames-order": "off", // Turn off enforcement of classnames order
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-call": "off", // Turn off unsafe call checks
    "@typescript-eslint/no-unsafe-return": "off", // Turn off unsafe return checks
    "@typescript-eslint/restrict-template-expressions": "off", // Turn off restrictions on template literals
    "no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off", // Allow use of the `any` type
    "tailwindcss/enforces-shorthand": "off", // Turn off shorthand enforcement in Tailwind CSS
    "tailwindcss/no-unnecessary-arbitrary-value": "off", // Turn off warnings for arbitrary values in Tailwind CSS
    "react/no-unescaped-entities": "off", // Allow unescaped entities in JSX
  },
  settings: {
    tailwindcss: {
      callees: ["cn", "cva"],
      config: "tailwind.config.js",
    },
    next: {
      rootDir: true,
    },
  },
}
