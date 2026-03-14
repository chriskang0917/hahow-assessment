import pluginQuery from "@tanstack/eslint-plugin-query";
import tsParser from "typescript-eslint";

export default [
  { ignores: ["dist"] },
  ...pluginQuery.configs["flat/recommended"],
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser.parser,
    },
  },
];
