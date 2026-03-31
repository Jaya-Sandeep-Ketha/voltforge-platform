/**
 * ESLint Configuration File
 *
 * Code linting configuration for the VoltForge energy management platform.
 * Enforces consistent code style, React best practices, and modern JavaScript
 * standards across the entire codebase.
 *
 * Linting rules include:
 * - JavaScript/ES6+ standard practices
 * - React component best practices and JSX runtime
 * - React Hooks rules for proper hook usage
 * - Fast Refresh optimization for development
 * - Browser environment globals support
 */

import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  // Ignore build output directory
  { ignores: ["dist"] },

  {
    // Target JavaScript and JSX files
    files: ["**/*.{js,jsx}"],

    // Language options for JavaScript parsing
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },

    // React version configuration
    settings: { react: { version: "18.3" } },

    // Plugin configuration
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },

    // Rule configuration
    rules: {
      // Base JavaScript recommended rules
      ...js.configs.recommended.rules,

      // React recommended rules and JSX runtime
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,

      // React Hooks recommended rules
      ...reactHooks.configs.recommended.rules,

      // Custom rule overrides
      "react/jsx-no-target-blank": "off",

      // React Refresh optimization for development
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
];
