# Changelog

## 2.0.0 - 2022-03-22

- **BREAKING CHANGE**: use `swc.minify()` instead of `swc.transform()` for better performance
- **BREAKING CHANGE**: `options` now is `jsc.minify` options, not swc opions.
  ```js
  const { SWCMinifyPlugin } = require("swc-webpack-plugin");

  module.exports = {
    optimization: {
      minimize: true,
      minimizer: [
        new SWCMinifyPlugin({
          compress: true,
          mangle: true,
        }),
      ],
    },
  };
  ```
- Enable `mangle` by default, to get much smaller minified sizes
