module.exports = {
    preset: 'jest-puppeteer',
    testEnvironment: 'jsdom', // or 'node' depending on your needs
    testTimeout: 30000,
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
    verbose: true,
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
      '^.+\\.tsx?$': 'ts-jest' // Include this if using TypeScript
    },
    moduleFileExtensions: ['js', 'jsx', 'json', 'node', 'ts', 'tsx'],
  };
  