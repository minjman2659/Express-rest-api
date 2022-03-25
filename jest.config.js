const testModulePath = [
  '**/auth/*',
  '**/posts/*',
  // Add something
];

const addExtname = ext => testModulePath.map(path => `${path}${ext}`);

module.exports = {
  collectCoverage: true,
  coveragePathIgnorePatterns: ['node_modules', 'migrations'],
  testEnvironment: 'node',
  modulePaths: ['./src'], // NODE_PATH=.
  setupFiles: ['./jest.setup.js'],
  collectCoverageFrom: addExtname('.js'), // coverage는 js 파일 기준
  testMatch: addExtname('.spec.js'), // testMatch는 test 파일 기준
};
