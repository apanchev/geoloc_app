module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  testPathIgnorePatterns: ["build"],
};

export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
};
