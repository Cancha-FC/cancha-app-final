import js from "@eslint/js";
import pkg from "eslint-plugin-react";
import globals from "globals";

// Ajustando a importação para lidar com o CommonJS
const { configs: reactConfigs } = pkg;

export default [
  js.configs.recommended,
  reactConfigs.recommended,
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      react: reactConfigs,
    },
    rules: {
      "no-unused-vars": "warn",
      "react/react-in-jsx-scope": "off", // Necessário para React 17+
    },
  },
];