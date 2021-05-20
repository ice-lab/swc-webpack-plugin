# swc-webpack-plugin

[![npm](https://img.shields.io/npm/v/swc-webpack-plugin)](https://www.npmjs.com/package/swc-webpack-plugin)
[![npm](https://img.shields.io/npm/dw/swc-webpack-plugin)](https://www.npmjs.com/package/swc-webpack-plugin)
[![actions](https://github.com/soulwu/swc-webpack-plugin/actions/workflows/node.js.yml/badge.svg)](https://github.com/soulwu/swc-webpack-plugin/actions/workflows/node.js.yml)
![David](https://img.shields.io/david/soulwu/swc-webpack-plugin)

Minify bundle with swc in webpack

## Installation

```shell
$ npm i --save-dev @swc/core swc-webpack-plugin webpack
```

## Usage

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

## Options

### SWCMinifyPlugin

Supports [all swc configuration](https://swc.rs/docs/configuring-swc)

#### `sync`

Type: `boolean`

Run in sync mode
