module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '^handlebars$': '<rootDir>/src/__mocks__/handlebars.ts',
    '^(.*)\\.hbs\\?raw$': '$1.hbs',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
    '^.+\\.hbs$': '<rootDir>/jest/hbs-transformer.cjs',
  },
};
