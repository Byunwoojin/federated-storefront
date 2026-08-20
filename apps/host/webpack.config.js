const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.jsx",
  mode: "development",
  devServer: {
    port: 3000,
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
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      remotes: {
        catalog_remote: "catalog_remote@http://localhost:3003/remoteEntry.js",
        cart_remote: "cart_remote@http://localhost:3004/remoteEntry.js",
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
      },
    }),
    ,
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
  ],
};
