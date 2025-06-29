import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import { string } from "rollup-plugin-string";

export default {
  input: "src/index.ts",
  output: {
    file: "dihor-cards-bundle.js",
    format: "es",
    sourcemap: false,
  },
  plugins: [
    resolve(),
    string({
      include: ["**/*.html", "**/*.css"],
    }),
    typescript({
      tsconfig: "./tsconfig.json",
    }),
    terser(),
  ],
};
