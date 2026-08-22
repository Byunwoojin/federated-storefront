const path = require("path");

const {
  ModuleFederationPlugin,
} = require("@module-federation/enhanced/webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const {
  buildPageExposes,
  buildPagesManifest,
  PagesManifestPlugin,
} = require("../../packages/webpack-utils");

const pagesDir = path.resolve(__dirname, "src/pages");

module.exports = {
  entry: "./src/index.ts",
  mode: "development",
  devServer: {
    port: 3004,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "cart_remote",
      filename: "remoteEntry.js",
      exposes: {
        ...buildPageExposes(pagesDir),
        "./styles": "./src/styles-entry",
      },
      dts: {
        generateTypes: {
          compilerInstance: "tsc",
        },
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
        "react-router-dom": { singleton: true },
        "@mfe/cart-store": { singleton: true },
      },
    }),
    new PagesManifestPlugin(buildPagesManifest(pagesDir, "cart_remote")),
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
  ],
};
