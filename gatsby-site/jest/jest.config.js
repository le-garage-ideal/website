module.exports = {
  rootDir: '../',
  transform: {
    '^.+\\.jsx?$': '<rootDir>/jest/jest-preprocess.js',
  },
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',

    // Enable file mocks when required, see https://www.gatsbyjs.com/docs/how-to/testing/unit-testing/
    //
    // '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
    //   '<rootDir>/__mocks__/file-mock.js',
  },
  testMatch: [ "**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(xxx|test).[jt]s?(x)" ],
  testPathIgnorePatterns: ['node_modules', '\\.cache', '<rootDir>.*/public'],
  transformIgnorePatterns: ['node_modules/(?!(gatsby)/)'],
  globals: {
    __PATH_PREFIX__: '',
  },
  testURL: 'http://localhost',
  setupFiles: ['<rootDir>/jest/loadershim.js'],
};
