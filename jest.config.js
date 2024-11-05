module.exports = {
    preset: 'jest-puppeteer',
    testMatch: ['**/tests/**/*.test.js'],
    testEnvironment: 'node', // or 'node' depending on your needs
    testTimeout: 120000,
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
    verbose: true,
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
      '^.+\\.tsx?$': 'ts-jest' // Include this if using TypeScript
    },
    moduleFileExtensions: ['js', 'jsx', 'json', 'node', 'ts', 'tsx'],
  };
  