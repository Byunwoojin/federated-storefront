const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
  const isDev = argv.mode === "development";

  const catalogRemoteUrl = isDev
    ? "catalog_remote@http://localhost:3003/remoteEntry.js"
    : "catalog_remote@https://catalog-remote.vercel.app/remoteEntry.js";

  const cartRemoteUrl = isDev
    ? "cart_remote@http://localhost:3004/remoteEntry.js"
    : "cart_remote@https://cart-remote-murex.vercel.app/remoteEntry.js";

  return {
    entry: "./src/index.ts",
    mode: isDev ? "development" : "production",
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
          catalog_remote: catalogRemoteUrl,
          cart_remote: cartRemoteUrl,
        },
        shared: {
          react: { singleton: true },
          "react-dom": { singleton: true },
        },
      }),
      new HtmlWebpackPlugin({ template: "./public/index.html" }),
    ],
  };
};
