// from old .babelrc file
// This is needed for mocha to work (since the tests need to be transpiled before they run)
// {
//   "plugins": ["syntax-dynamic-import", "transform-class-properties", "transform-async-to-generator"],
//   "presets": ["@babel/preset-env","@babel/preset-react"]
// }

module.exports = {
  plugins: ["syntax-dynamic-import", "transform-class-properties", "transform-async-to-generator"],
  presets: ["@babel/preset-env", "@babel/preset-react"]
};
