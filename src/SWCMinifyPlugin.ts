import { JsMinifyOptions, minify, minifySync } from "@swc/core";
import webpack from "webpack";
import { RawSource, SourceMapSource } from "webpack-sources";

const { version } = require("../package.json");

export interface MinifyPluginOptions extends JsMinifyOptions {
  sync?: boolean;
}

const isWebpack5 = (compilation: webpack.Compilation) => "processAssets" in compilation.hooks;

const isJsFile = /\.[cm]?js(\?.*)?$/i;
const pluginName = "swc-minify";

export class SWCMinifyPlugin {
  private readonly sync: boolean;

  private readonly options: JsMinifyOptions = { compress: true, mangle: true };

  constructor(options: MinifyPluginOptions = {}) {
    const { sync, ...restOptions } = options;

    this.sync = sync;

    Object.assign(this.options, restOptions);
  }

  apply(compiler: webpack.Compiler) {
    const meta = JSON.stringify({ name: pluginName, version, options: this.options });

    compiler.hooks.compilation.tap(pluginName, compilation => {
      compilation.hooks.chunkHash.tap(pluginName, (_, hash) => hash.update(meta));

      const tapMethod = this.sync ? "tap" : "tapPromise";

      if (isWebpack5(compilation)) {
        compilation.hooks.processAssets[tapMethod](
          {
            name: pluginName,
            stage: (compilation.constructor as any).PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
            additionalAssets: true,
          },
          () => this.transformAssets(compilation),
        );

        compilation.hooks.statsPrinter.tap(pluginName, statsPrinter => {
          statsPrinter.hooks.print
            .for("asset.info.minimized")
            .tap(pluginName, (minimized, { green, formatFlag }) =>
              minimized ? green(formatFlag("minimized")) : undefined,
            );
        });
      } else {
        compilation.hooks.optimizeChunkAssets[tapMethod](pluginName, () => this.transformAssets(compilation));
      }
    });
  }

  private async transformAssets(compilation: webpack.Compilation) {
    const {
      options: { devtool },
    } = compilation.compiler;
    const sourcemap =
      this.options.sourceMap === undefined ? devtool && devtool.includes("source-map") : this.options.sourceMap;
    const assets = compilation.getAssets().filter(asset => !asset.info.minimized && isJsFile.test(asset.name));
    if (this.sync) {
      return this.processAssetsSync(assets, sourcemap, compilation);
    } else {
      return this.processAssets(assets, sourcemap, compilation);
    }
  }

  private processAssetsSync(assets: webpack.Asset[], sourcemap: boolean | "inline", compilation: webpack.Compilation) {
    assets.forEach(asset => {
      const { source, map } = asset.source.sourceAndMap();
      const sourceAsString = source.toString();
      const result = minifySync(sourceAsString, {
        ...this.options,
        sourceMap: Boolean(sourcemap),
      });
      compilation.updateAsset(
        asset.name,
        sourcemap
          ? new SourceMapSource(result.code, asset.name, result.map as any, sourceAsString, map as any, true)
          : new RawSource(result.code),
        {
          ...asset.info,
          minimized: true,
        },
      );
    });
  }

  private async processAssets(
    assets: webpack.Asset[],
    sourcemap: boolean | "inline",
    compilation: webpack.Compilation,
  ) {
    await Promise.all(
      assets.map(async asset => {
        const { source, map } = asset.source.sourceAndMap();
        const sourceAsString = source.toString();
        const result = await minify(sourceAsString, {
          ...this.options,
          sourceMap: Boolean(sourcemap),
        });

        compilation.updateAsset(
          asset.name,
          sourcemap
            ? new SourceMapSource(result.code, asset.name, result.map as any, sourceAsString, map as any, true)
            : new RawSource(result.code),
          {
            ...asset.info,
            minimized: true,
          },
        );
      }),
    );
  }
}
