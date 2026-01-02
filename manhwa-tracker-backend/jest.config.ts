import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm", // ✅ ESM + TS
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true }],
  },
  moduleFileExtensions: ["ts", "js", "json"],
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
};

export default config;