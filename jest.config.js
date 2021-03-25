module.exports = async () => {
  return {
    rootDir: process.cwd(),
    testTimeout: 30000,
    testEnvironment: 'node',
    verbose: true,
    testPathIgnorePatterns: [ '<rootDir>/node_modules', '<rootDir>/dist' ],
    modulePathIgnorePatterns: [ '<rootDir>/dist' ],
    roots: [ '<rootDir>/tests' ],
    testMatch: [ '<rootDir>/tests/**/*.test.ts' ],
    transform: {
      '^.+\\.(ts)$': 'ts-jest'
    },
    collectCoverage: true,
    coverageDirectory: "./coverage",
    coverageThreshold: {
      "global": {
        "branches": 95,
        "functions": 95,
        "lines": 95,
        "statements": -10
      }
    }
  };
};