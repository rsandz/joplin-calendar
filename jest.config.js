/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  collectCoverage: true,
  moduleNameMapper: {
    "@constants/(.*)": "<rootDir>/src/constants/$1",
    "api/(.*)": "<rootDir>/api/$1",
  },
  clearMocks: true,
};
