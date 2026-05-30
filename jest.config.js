module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  testRegex: '(/__tests__/.*\\.(test|spec))\\.[jt]sx?$',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
