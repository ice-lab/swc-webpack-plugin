# swc-webpack-plugin

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
