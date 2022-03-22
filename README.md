# swc-webpack-plugin

[![npm](https://img.shields.io/npm/v/swc-webpack-plugin)](https://www.npmjs.com/package/swc-webpack-plugin)
[![npm](https://img.shields.io/npm/dw/swc-webpack-plugin)](https://www.npmjs.com/package/swc-webpack-plugin)
[![ci](https://github.com/soulwu/swc-webpack-plugin/actions/workflows/ci.yml/badge.svg)](https://github.com/soulwu/swc-webpack-plugin/actions/workflows/ci.yml)
![David](https://img.shields.io/david/soulwu/swc-webpack-plugin)

Use swc as minifier for webpack. [10x faster than terser](https://github.com/guoyunhe/benchmark-js-minifiers).

## Installation

```shell
npm i --save-dev @swc/core swc-webpack-plugin webpack
```

## Usage

Use with recommended configuration:

```js
const { SWCMinifyPlugin } = require('swc-webpack-plugin');

module.exports = {
  ...,
  optimization: {
    minimize: true,
    minimizer: [new SWCMinifyPlugin()],
  },
};
```

Use with custom configuration:

```js
const { SWCMinifyPlugin } = require('swc-webpack-plugin');

module.exports = {
  ...,
  optimization: {
    minimize: true,
    minimizer: [new SWCMinifyPlugin({
      sync: true,
      compress: false,
      mangle: true,
    })],
  },
};
```

## Options

Supports [all swc jsc.minify configuration](https://swc.rs/docs/configuration/minification#configuration)

### `sync`

Type: `boolean`

Default: `false`

Run in sync mode

### `compress`

Type: `boolean | object`

Default: `true`

See <https://swc.rs/docs/configuration/minification#jscminifycompress>

### `mangle`

Type: `boolean | object`

Default: `true`

See <https://swc.rs/docs/configuration/minification#jscminifymangle>
