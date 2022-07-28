/*
 * For a detailed explanation regarding each configuration property, visit:
*/

export default {
  clearMocks: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: [
      "json",
      "text",
      "lcov",
      "clover"
    ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
}