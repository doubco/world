import typescript from "rollup-plugin-typescript2";
import external from "rollup-plugin-peer-deps-external";

import pkg from "./package.json";

export default [
  {
    input: "./src/index.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
    ],
    plugins: [
      external(),
      typescript({
        clean: true,
        useTsconfigDeclarationDir: true,
        tsconfigOverride: {
          include: ["src/index.ts"],
        },
      }),
    ],
  },
  {
    input: "./src/react/index.tsx",
    output: [
      {
        file: pkg.react.main,
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
    ],
    plugins: [
      external(),
      typescript({
        clean: true,
        useTsconfigDeclarationDir: true,
        tsconfigOverride: {
          include: ["src/react/index.tsx"],
        },
      }),
    ],
  },
];
