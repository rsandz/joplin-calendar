/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  collectCoverage: true,
  moduleNameMapper: {
    "@constants/messageTypes": "<rootDir>/src/constants/messageTypes",
  },
};
