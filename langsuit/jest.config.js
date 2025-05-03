const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Path to Next.js app to load next.config.js and .env files
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  coveragePathIgnorePatterns: ["/node_modules/", "/.next/", "/utils/"],
};

module.exports = createJestConfig(customJestConfig);
