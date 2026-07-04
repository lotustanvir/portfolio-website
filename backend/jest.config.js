export default {
  roots: ["<rootDir>/tests"],
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  testEnvironment: "node",
  collectCoverageFrom: ["src/**/*.js", "!src/logs/**", "!src/docs/**"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "clover"],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
  clearMocks: true,
  restoreMocks: true,
};
