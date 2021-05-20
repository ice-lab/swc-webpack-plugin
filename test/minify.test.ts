import webpack5 from "webpack";
import webpack4 from "webpack4";
// import { RawSource } from "webpack-sources";
import { SWCMinifyPlugin } from "../src/index";
import { build, getFile } from "./utils";
import * as fixtures from "./fixtures";

describe.each([
  ["Webpack 5", webpack5],
  ["Webpack 4", webpack4],
])("%s Minification", (_name, webpack) => {
  test("minify", async () => {
    const statsUnminified = await build(webpack, fixtures.js);
    const stats = await build(webpack, fixtures.js, config => {
      config.optimization = {
        minimize: true,
        minimizer: [new SWCMinifyPlugin()],
      };
    });
    expect(statsUnminified.hash).not.toBe(stats.hash);

    const file = getFile(stats, "/dist/index.js");

    expect(file.content).toMatchSnapshot();
    expect(file.execute()).toMatchSnapshot();
  });

  test("minify chunks", async () => {
    const stats = await build(webpack, fixtures.webpackChunks, config => {
      config.optimization = {
        minimize: true,
        minimizer: [new SWCMinifyPlugin()],
      };
    });

    expect(getFile(stats, "/dist/index.js").content).toMatchSnapshot();
    expect(getFile(stats, "/dist/named-chunk-foo.js").content).toMatchSnapshot();
    expect(getFile(stats, "/dist/named-chunk-bar.js").content).toMatchSnapshot();
  });

  test("minify in sync mode", async () => {
    const statsUnminified = await build(webpack, fixtures.js);
    const stats = await build(webpack, fixtures.js, config => {
      config.optimization = {
        minimize: true,
        minimizer: [new SWCMinifyPlugin({ sync: true })],
      };
    });
    expect(statsUnminified.hash).not.toBe(stats.hash);

    const file = getFile(stats, "/dist/index.js");

    expect(file.content).toMatchSnapshot();
    expect(file.execute()).toMatchSnapshot();
  });

  test("minify chunks in sync mode", async () => {
    const stats = await build(webpack, fixtures.webpackChunks, config => {
      config.optimization = {
        minimize: true,
        minimizer: [new SWCMinifyPlugin({ sync: true })],
      };
    });

    expect(getFile(stats, "/dist/index.js").content).toMatchSnapshot();
    expect(getFile(stats, "/dist/named-chunk-foo.js").content).toMatchSnapshot();
    expect(getFile(stats, "/dist/named-chunk-bar.js").content).toMatchSnapshot();
  });
});
